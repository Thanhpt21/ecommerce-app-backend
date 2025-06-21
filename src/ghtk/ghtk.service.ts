import { Injectable, InternalServerErrorException, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { CalculateFeeDto, CreateOrderGHTKDto } from './dto/calculate-fee.dto'; // Đảm bảo đúng DTO cho CreateOrderGHTKDto
import {
  GHTKShipFeeResponse,
  GHTKCreateOrderResponse,
  GHTKProvinceResponse,
  GHTKDistrictResponse,
  GHTKWardResponse,
  GHTKTrackingResponse,
  GHTKCancelOrderResponse
} from './interfaces/ghtk.interface';
import { PrismaService } from 'prisma/prisma.service'; // Adjust path if needed

@Injectable()
export class GhtkService {
  private readonly logger = new Logger(GhtkService.name);
  private ghtkApi: AxiosInstance;
  private readonly GHTK_BASE_API_URL: string;
  private readonly GHTK_API_TOKEN: string;
  private readonly GHTK_PARTNER_CODE: string;

  private readonly GHTK_FEE_PATH = '/services/shipment/fee';
  private readonly GHTK_ORDER_PATH = '/services/shipment/order';
  private readonly GHTK_CANCEL_ORDER_PATH = '/services/shipment/cancel';
  private readonly GHTK_TRACKING_PATH = '/services/shipment/detail';
  private readonly GHTK_PRINT_LABEL_PATH = '/services/label';
  private readonly GHTK_PUBLIC_PROVINCE_PATH = '/public/province';
  private readonly GHTK_PUBLIC_DISTRICT_PATH = '/public/district';
  private readonly GHTK_PUBLIC_WARD_PATH = '/public/ward';

  private defaultPickupConfig: {
    pick_province: string | null;
    pick_district: string | null;
    pick_ward: string | null;
    pick_address: string | null;
    pick_tel: string | null;
    pick_name: string | null;
  } | undefined = undefined; // Initialize as undefined

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.GHTK_BASE_API_URL = this.configService.get<string>('GHTK_BASE_API_URL') || 'https://services.giaohangtietkiem.vn';
    this.GHTK_API_TOKEN = this.configService.get<string>('GHTK_API_TOKEN')!;
    this.GHTK_PARTNER_CODE = this.configService.get<string>('GHTK_PARTNER_CODE')!;

    if (!this.GHTK_API_TOKEN || !this.GHTK_PARTNER_CODE || !this.GHTK_BASE_API_URL) {
      this.logger.error('GHTK API credentials (token, base URL, partner code) are not fully set in environment variables.');
      throw new InternalServerErrorException('GHTK API is not configured. Please check your .env file.');
    }

    this.ghtkApi = axios.create({
      baseURL: this.GHTK_BASE_API_URL,
      headers: {
        Token: this.GHTK_API_TOKEN,
        'Content-Type': 'application/json',
        'X-Client-Source': this.GHTK_PARTNER_CODE,
      },
      timeout: 30000,
    });

    this.ghtkApi.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isAxiosError(error) && error.response) {
          const errorMessage = error.response.data?.message || `GHTK API returned status ${error.response.status}`;
          this.logger.error(`GHTK API Error [${error.response.status}]: ${JSON.stringify(error.response.data)}`);
          throw new BadRequestException(errorMessage);
        } else if (axios.isAxiosError(error) && error.request) {
          this.logger.error(`GHTK API No Response: ${error.message}`);
          throw new InternalServerErrorException('Không nhận được phản hồi từ GHTK API. Vui lòng thử lại sau.');
        } else {
          this.logger.error(`GHTK API Request Error: ${error.message}`);
          throw new InternalServerErrorException('Lỗi không xác định khi gửi yêu cầu đến GHTK API.');
        }
      }
    );

    // ⭐ Load default pickup config on service initialization ⭐
    this.loadDefaultPickupConfig();
  }

  // ⭐ New method to load default pickup configuration from database ⭐
  private async loadDefaultPickupConfig() {
    try {
      const config = await this.prisma.config.findFirst({
        select: {
          pick_province: true,
          pick_district: true,
          pick_ward: true,
          pick_address: true,
          pick_tel: true, // New field
          pick_name: true, // New field
        },
      });

      if (config) {
        this.defaultPickupConfig = config;
        this.logger.log('Default pickup configuration loaded successfully from Config model.');
      } else {
        this.logger.warn('No default pickup configuration found in Config model. GHTK orders may fail without it.');
        // Optionally, throw an error or set defaults if config is absolutely required.
        // For now, we'll let it be handled when createGHTKOrder is called.
      }
    } catch (error) {
      this.logger.error(`Failed to load default pickup configuration: ${error.message}`, error.stack);
      // It's critical if this fails, consider throwing a more severe error
      throw new InternalServerErrorException('Failed to load GHTK default pickup configuration.');
    }
  }

  // --- Các phương thức chung để gửi Request ---
  private async sendGetRequest<T>(path: string, params?: Record<string, any>): Promise<T> {
    try {
      this.logger.debug(`Sending GET request to GHTK: ${path} with params: ${JSON.stringify(params)}`);
      const response: AxiosResponse<T> = await this.ghtkApi.get<T>(path, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  private async sendPostRequest<T>(path: string, data: any): Promise<T> {
    try {
      this.logger.debug(`Sending POST request to GHTK: ${path} with data: ${JSON.stringify(data)}`);
      const response: AxiosResponse<T> = await this.ghtkApi.post<T>(path, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // --- 1. Tính phí vận chuyển ---
  async calculateShippingFee(data: CalculateFeeDto): Promise<GHTKShipFeeResponse> { // Change return type to GHTKShipFeeResponse
    if (!this.defaultPickupConfig) {
      // Attempt to load if not already loaded (e.g., if service was initialized before DB was ready)
      await this.loadDefaultPickupConfig();
      if (!this.defaultPickupConfig) {
        throw new InternalServerErrorException('GHTK default pickup configuration is not available.');
      }
    }

    const params = {
      pick_province: this.defaultPickupConfig.pick_province || '',
      pick_district: this.defaultPickupConfig.pick_district || '',
      pick_ward: this.defaultPickupConfig.pick_ward || '',
      pick_address: this.defaultPickupConfig.pick_address || '',
      province: data.province,
      district: data.district,
      ward: data.ward || '',
      address: data.address || '',
      weight: data.weight,
      value: data.value || 0,
      deliver_option: data.deliver_option === 'xteam' ? 'xteam' : 'none',
      ...(data.transport && { transport: data.transport }),
    };

    try {
      this.logger.log(`Calculating shipping fee for: ${JSON.stringify(params)}`);
      const response = await this.sendGetRequest<GHTKShipFeeResponse>(this.GHTK_FEE_PATH, params);

      if (response.success && response.fee) {
        this.logger.log(`GHTK Fee Calculated: ${response.fee.fee}`);
        return response; // Return the full response as per your OrderService expects GHTKShipFeeResponse
      } else {
        this.logger.warn(`GHTK API returned failure for fee calculation: ${response.message || 'Unknown reason'}`);
        throw new BadRequestException(response.message || 'Không thể tính phí vận chuyển. Vui lòng kiểm tra lại thông tin địa chỉ.');
      }
    } catch (error) {
      throw error;
    }
  }

  // --- 2. Tạo đơn hàng trên GHTK ---
  async createGHTKOrder(orderId: number): Promise<GHTKCreateOrderResponse['order']> { // Removed pickUpAddressId parameter
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        shippingAddress: true,
        items: {
          include: {
            product: true,
            variant: {
              include: {
                product: true, // Ensure include product of variant
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    if (!this.defaultPickupConfig) {
      await this.loadDefaultPickupConfig(); // Attempt to load if not already loaded
      if (!this.defaultPickupConfig) { // Check for essential fields
        throw new InternalServerErrorException('GHTK default pickup configuration is not available or incomplete.');
      }
    }

    // Tính tổng trọng lượng và chuẩn bị sản phẩm
    const productsForGHTK = order.items.map(item => {
      let itemWeightGram: number = 0;
      let itemName: string = 'Unknown Item';
      let itemPrice: number = 0;

      if (item.variant && item.variant.product) {
        itemWeightGram = item.variant.product.weight ?? 0; // Use nullish coalescing
        itemName = item.variant.title || item.variant.product.title; // Use variant name if available, else product title
        itemPrice = item.variant.price;
      } else if (item.product) {
        itemWeightGram = item.product.weight ?? 0;
        itemName = item.product.title;
        itemPrice = item.product.price;
      }

      // GHTK yêu cầu trọng lượng là kg, và không thể là 0
      const weightInKg = itemWeightGram / 1000;
      const finalWeight = weightInKg > 0 ? weightInKg : 0.1; // GHTK might require min weight, e.g., 0.1kg

      return {
        name: itemName,
        weight: finalWeight,
        quantity: item.quantity,
        price: itemPrice,
      };
    });

    const ghtkPayload: { order: CreateOrderGHTKDto } = {
      order: {
        // id: order.id.toString(), // GHTK sẽ tự tạo ID nếu không cung cấp. Nếu bạn muốn GHTK lưu ID nội bộ của mình, uncomment này.
        // Thông tin lấy hàng từ defaultPickupConfig
        pick_province: this.defaultPickupConfig.pick_province || '',
        pick_district: this.defaultPickupConfig.pick_district || '',
        pick_ward: this.defaultPickupConfig.pick_ward || '',
        pick_address: this.defaultPickupConfig.pick_address || '',
        pick_tel: this.defaultPickupConfig.pick_tel || '', // Use from config
        pick_name: this.defaultPickupConfig.pick_name || '', // Use from config

        // Thông tin người nhận từ Order's shippingAddress
        province: order.shippingAddress.province || '', // ⭐ Updated to provinceName
        district: order.shippingAddress.district || '', // ⭐ Updated to districtName
        ward: order.shippingAddress.ward || '',     // ⭐ Updated to wardName
        address: order.shippingAddress.address || '',
        tel: order.shippingAddress.phone || '',
        name: order.shippingAddress.fullName || '',

        note: order.note || `Đơn hàng ${order.id} từ ${order.user.name}`,
        value: order.totalAmount, // Giá trị đơn hàng để GHTK tính bảo hiểm/COD nếu có
        pick_money: order.paymentMethod === 'COD' ? order.finalAmount : 0, // Số tiền thu hộ (COD)
        is_freeship: order.shippingFee === 0 ? 1 : 0, // 1 nếu freeship, 0 nếu không
        products: productsForGHTK,
        // Các trường khác có thể cần thêm tùy thuộc vào yêu cầu của GHTK API
        // ví dụ: email, use_return_address, transport, street, pick_street, etc.
      },
    };

    try {
      this.logger.log(`Creating GHTK order for orderId: ${orderId} with payload (partial): ${JSON.stringify(ghtkPayload.order)}`); // Log partial payload for brevity
      const response = await this.sendPostRequest<GHTKCreateOrderResponse>(this.GHTK_ORDER_PATH, ghtkPayload);

      if (response.success && response.order) {
        this.logger.log(`GHTK Order Created with label: ${response.order.label}`);
        // Cập nhật lại order trong DB với GHTK label và các thông tin khác
        await this.prisma.order.update({
          where: { id: orderId },
          data: {
            ghtkLabel: response.order.label,
            ghtkStatus: response.order.status, // Lưu trạng thái ban đầu từ GHTK
            ghtkTrackingUrl: response.order.tracking_link, // Lưu URL theo dõi
            // ghtkCodAmount: response.order.cod_amount, // Nếu GHTK trả về COD amount đã xác nhận
          },
        });
        return response.order;
      } else {
        throw new BadRequestException(response.message || 'Không thể tạo đơn hàng trên Giao Hàng Tiết Kiệm.');
      }
    } catch (error) {
      throw error;
    }
  }

  // --- 3. Lấy danh sách Tỉnh/Thành ---
  async getProvinces(): Promise<GHTKProvinceResponse['data']> { // Removed | null
    try {
      const response = await this.sendGetRequest<GHTKProvinceResponse>(this.GHTK_PUBLIC_PROVINCE_PATH);
      if (response.success) {
        return response.data;
      }
      // If success is false but no HTTP error, still throw BadRequest
      throw new BadRequestException(response.message || 'Failed to fetch provinces from GHTK.');
    } catch (error) {
      throw error;
    }
  }

  // --- 4. Lấy danh sách Quận/Huyện theo Tỉnh/Thành ---
  async getDistricts(provinceId: number): Promise<GHTKDistrictResponse['data']> { // Removed | null
    try {
      const response = await this.sendGetRequest<GHTKDistrictResponse>(
        this.GHTK_PUBLIC_DISTRICT_PATH,
        { province: provinceId }
      );
      if (response.success) {
        return response.data;
      }
      throw new BadRequestException(response.message || 'Failed to fetch districts from GHTK.');
    } catch (error) {
      throw error;
    }
  }

  // --- 5. Lấy danh sách Phường/Xã theo Quận/Huyện ---
  async getWards(districtId: number): Promise<GHTKWardResponse['data']> { // Removed | null
    try {
      const response = await this.sendGetRequest<GHTKWardResponse>(
        this.GHTK_PUBLIC_WARD_PATH,
        { district: districtId }
      );
      if (response.success) {
        return response.data;
      }
      throw new BadRequestException(response.message || 'Failed to fetch wards from GHTK.');
    } catch (error) {
      throw error;
    }
  }

  // --- 6. Hủy đơn hàng GHTK ---
  async cancelGHTKOrder(ghtkLabel: string): Promise<GHTKCancelOrderResponse> {
    try {
      this.logger.log(`Cancelling GHTK order with label: ${ghtkLabel}`);
      // GHTK yêu cầu body rỗng cho cancel, không phải null
      const response = await this.sendPostRequest<GHTKCancelOrderResponse>(
        `${this.GHTK_CANCEL_ORDER_PATH}/${ghtkLabel}`,
        {} // Ensure it's an empty object, not null/undefined
      );

      if (response.success) {
        this.logger.log(`GHTK Order ${ghtkLabel} cancelled successfully.`);
        return response;
      } else {
        throw new BadRequestException(response.message || 'Không thể hủy đơn hàng trên Giao Hàng Tiết Kiệm.');
      }
    } catch (error) {
      throw error;
    }
  }

  // --- 7. Theo dõi đơn hàng GHTK ---
  async trackGHTKOrder(ghtkLabel: string): Promise<GHTKTrackingResponse> {
    try {
      this.logger.log(`Tracking GHTK order with label: ${ghtkLabel}`);
      const response = await this.sendGetRequest<GHTKTrackingResponse>(
        `${this.GHTK_TRACKING_PATH}/${ghtkLabel}`
      );

      if (response.success) {
        this.logger.log(`GHTK Order ${ghtkLabel} tracking fetched.`);
        return response;
      } else {
        throw new NotFoundException(response.message || 'Không tìm thấy thông tin theo dõi đơn hàng GHTK.');
      }
    } catch (error) {
      throw error;
    }
  }

  // --- 8. Lấy URL in nhãn đơn hàng GHTK ---
  async getPrintLabelUrl(ghtkLabel: string): Promise<string> {
    const url = `${this.GHTK_BASE_API_URL}${this.GHTK_PRINT_LABEL_PATH}/${ghtkLabel}`;
    this.logger.log(`Generated GHTK print label URL: ${url}`);
    return url;
  }
}