import { Injectable, InternalServerErrorException, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { CalculateFeeDto, CreateOrderGHTKDto } from './dto/calculate-fee.dto';
import {
  GHTKShipFeeResponse,
  GHTKCreateOrderResponse,
  GHTKProvinceResponse,
  GHTKDistrictResponse,
  GHTKWardResponse
} from './interfaces/ghtk.interface';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GhtkService {
  private readonly logger = new Logger(GhtkService.name);
  private ghtkApi: AxiosInstance;
  private ghtkToken: string | undefined;
  private ghtkShipFeeUrl: string | undefined;
  private ghtkCreateOrderUrl: string | undefined;
  private ghtkPartnerCode: string | undefined; // KHAI BÁO BIẾN MỚI CHO PARTNER CODE

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.ghtkToken = this.configService.get<string>('GHTK_API_TOKEN');
    this.ghtkShipFeeUrl = this.configService.get<string>('GHTK_API_URL');
    this.ghtkCreateOrderUrl = this.configService.get<string>('GHTK_REGISTER_SHIPMENT_URL');
    this.ghtkPartnerCode = this.configService.get<string>('GHTK_PARTNER_CODE'); // LẤY GIÁ TRỊ TỪ .ENV

    // CẬP NHẬT ĐIỀU KIỆN KIỂM TRA ĐỂ BAO GỒM ghtkPartnerCode
    if (!this.ghtkToken || !this.ghtkShipFeeUrl || !this.ghtkCreateOrderUrl || !this.ghtkPartnerCode) {
      this.logger.error('GHTK API credentials (token, URLs, partner code) are not fully set in environment variables.');
      throw new InternalServerErrorException('GHTK API is not configured. Please check your .env file.');
    }

    this.ghtkApi = axios.create({
      baseURL: 'https://services.giaohangtietkiem.vn', // baseURL này vẫn đúng theo tài liệu GHTK mới
      headers: {
        Token: this.ghtkToken!, // SỬ DỤNG NON-NULL ASSERTION ĐỂ TRÁNH LỖI TYPESCRIPT
        'Content-Type': 'application/json',
        'X-Client-Source': this.ghtkPartnerCode!, // THÊM HEADER X-Client-Source
      },
      timeout: 30000, // Tăng timeout lên 30 giây để tránh lỗi "No Response" do mạng chậm
    });

    this.ghtkApi.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          this.logger.error(`GHTK API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
          throw new InternalServerErrorException(
            error.response.data.message || 'Lỗi từ GHTK API'
          );
        } else if (error.request) {
          this.logger.error(`GHTK API No Response: ${error.message}`);
          throw new InternalServerErrorException('Không nhận được phản hồi từ GHTK API.');
        } else {
          this.logger.error(`GHTK API Request Error: ${error.message}`);
          throw new InternalServerErrorException('Lỗi khi gửi yêu cầu đến GHTK API.');
        }
      }
    );
  }

  async calculateShippingFee(data: CalculateFeeDto): Promise<number> {
    try {
      this.logger.log(`Calculating shipping fee for: ${JSON.stringify(data)}`);
      const response = await this.ghtkApi.get<GHTKShipFeeResponse>(this.ghtkShipFeeUrl!, {
       params: {
          pick_province: data.pick_province,
          pick_district: data.pick_district,
           pick_ward: data.pick_ward ?? '',   // ENSURE THIS LINE IS PRESENT
          pick_address: data.pick_address ?? '', // ENSURE THIS LINE IS PRESENT
          province: data.province,
          district: data.district,
          ward: data.ward ?? '',
          address: data.address ?? '',
          weight: data.weight,
          value: data.value ?? 0,
          deliver_option: data.deliver_option === 'xteam' ? 'xteam' : 'none',
          // THÊM DÒNG NÀY ĐỂ TRUYỀN GIÁ TRỊ TRANSPORT
          ...(data.transport && { transport: data.transport }), // Chỉ thêm transport nếu nó tồn tại
          // Cách khác: transport: data.transport ?? GHTKTransportOption.ROAD, // Nếu bạn muốn luôn có giá trị mặc định là 'road'
        },
      });

      if (response.data.success && response.data.fee) {
        this.logger.log(`GHTK Fee Calculated: ${response.data.fee.fee}`);
        return response.data.fee.fee;
      } else {
        this.logger.warn(`GHTK API returned failure for fee calculation: ${response.data.message || 'Unknown reason'}`);
        throw new BadRequestException(response.data.message || 'Không thể tính phí vận chuyển. Vui lòng kiểm tra lại thông tin địa chỉ.');
      }
    } catch (error) {
      throw error;
    }
  }

  async createGHTKOrder(orderId: number, pickUpAddressId: number): Promise<GHTKCreateOrderResponse['order']> {
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
                product: true, // Đảm bảo include product của variant
                },
            },
            },
        },
        },
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    const pickUpAddress = await this.prisma.shippingAddress.findUnique({
        where: { id: pickUpAddressId },
    });

    if (!pickUpAddress) {
        throw new NotFoundException('Pickup address not found. Please configure your store/warehouse address.');
    }

    let totalWeightGram = 0;
    const productsForGHTK = order.items.map(item => {
        let itemWeightGram: number;
        let itemName: string;
        let itemPrice: number;

        if (item.variant) {
        itemWeightGram = item.variant.product.weight; // Lấy weight từ product của variant
        itemName = item.variant.title;
        itemPrice = item.variant.price;
        } else if (item.product) {
        itemWeightGram = item.product.weight;
        itemName = item.product.title;
        itemPrice = item.product.price;
        } else {
        itemWeightGram = 0;
        itemName = 'Unknown Item';
        itemPrice = 0;
        }

        totalWeightGram += itemWeightGram * item.quantity;

        return {
        name: itemName,
        weight: itemWeightGram / 1000, // GHTK yêu cầu trọng lượng là kg
        quantity: item.quantity,
        price: itemPrice,
        };
    });


    const ghtkPayload: CreateOrderGHTKDto = {
        // Đảm bảo các trường này không null, sử dụng ?? '' hoặc ! tùy thuộc vào validation của bạn
        pick_province: pickUpAddress.province!,
        pick_district: pickUpAddress.district!,
        pick_ward: pickUpAddress.ward ?? '',
        pick_address: pickUpAddress.address ?? '',
        pick_tel: pickUpAddress.phone ?? '',
        pick_name: pickUpAddress.fullName ?? '',

        province: order.shippingAddress.province!,
        district: order.shippingAddress.district!,
        ward: order.shippingAddress.ward ?? '',
        address: order.shippingAddress.address ?? '',
        tel: order.shippingAddress.phone ?? '',
        name: order.shippingAddress.fullName ?? '',

        note: order.note || `Đơn hàng ${order.id} từ ${order.user.name}`,
        value: order.totalAmount,
        pick_money: order.paymentMethod === 'COD' ? order.finalAmount : 0,
        is_freeship: order.shippingFee === 0 ? 1 : 0,
        products: productsForGHTK,
        // Có thể cần thêm các trường khác như transport, pick_street, street theo tài liệu GHTK
    };

    try {
      this.logger.log(`Creating GHTK order for orderId: ${orderId} with payload: ${JSON.stringify(ghtkPayload)}`);
      const response = await this.ghtkApi.post<GHTKCreateOrderResponse>(this.ghtkCreateOrderUrl!, {
        order: {
          id: order.id.toString(),
          ...ghtkPayload,
        },
      });

      if (response.data.success && response.data.order) {
        this.logger.log(`GHTK Order Created: ${response.data.order.label}`);
        return response.data.order;
      } else {
        this.logger.warn(`GHTK API returned failure for order creation: ${response.data.message || 'Unknown reason'}`);
        throw new BadRequestException(response.data.message || 'Không thể tạo đơn hàng trên Giao Hàng Tiết Kiệm.');
      }
    } catch (error) {
      throw error;
    }
  }

async getProvinces() {
    try {
      // Thay từ '/services/address/provinces' thành '/public/province'
      const response = await this.ghtkApi.get<GHTKProvinceResponse>('/public/province');
      if (response.data.success) {
        return response.data.data;
      }
      throw new InternalServerErrorException('Failed to fetch provinces from GHTK.');
    } catch (error) {
      this.logger.error(`Error fetching provinces: ${error.response?.data?.message || error.message}`);
      throw new InternalServerErrorException('Failed to fetch provinces from GHTK.');
    }
  }

  async getDistricts(provinceId: number) {
    try {
      // Thay từ `/services/address/districts?province=${provinceId}` thành `/public/district?province=${provinceId}`
      const response = await this.ghtkApi.get<GHTKDistrictResponse>(`/public/district?province=${provinceId}`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new InternalServerErrorException('Failed to fetch districts from GHTK.');
    } catch (error) {
      this.logger.error(`Error fetching districts: ${error.response?.data?.message || error.message}`);
      throw new InternalServerErrorException('Failed to fetch districts from GHTK.');
    }
  }

  async getWards(districtId: number) {
    try {
      // Thay từ `/services/address/wards?district=${districtId}` thành `/public/ward?district=${districtId}`
      const response = await this.ghtkApi.get<GHTKWardResponse>(`/public/ward?district=${districtId}`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new InternalServerErrorException('Failed to fetch wards from GHTK.');
    } catch (error) {
      this.logger.error(`Error fetching wards: ${error.response?.data?.message || error.message}`);
      throw new InternalServerErrorException('Failed to fetch wards from GHTK.');
    }
  }
}