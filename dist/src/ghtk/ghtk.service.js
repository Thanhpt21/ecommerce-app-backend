"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GhtkService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GhtkService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const prisma_service_1 = require("../../prisma/prisma.service");
let GhtkService = GhtkService_1 = class GhtkService {
    configService;
    prisma;
    logger = new common_1.Logger(GhtkService_1.name);
    ghtkApi;
    GHTK_BASE_API_URL;
    GHTK_API_TOKEN;
    GHTK_PARTNER_CODE;
    GHTK_FEE_PATH = '/services/shipment/fee';
    GHTK_ORDER_PATH = '/services/shipment/order';
    GHTK_CANCEL_ORDER_PATH = '/services/shipment/cancel';
    GHTK_TRACKING_PATH = '/services/shipment/detail';
    GHTK_PRINT_LABEL_PATH = '/services/label';
    GHTK_PUBLIC_PROVINCE_PATH = '/public/province';
    GHTK_PUBLIC_DISTRICT_PATH = '/public/district';
    GHTK_PUBLIC_WARD_PATH = '/public/ward';
    defaultPickupConfig = undefined;
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.GHTK_BASE_API_URL = this.configService.get('GHTK_BASE_API_URL') || 'https://services.giaohangtietkiem.vn';
        this.GHTK_API_TOKEN = this.configService.get('GHTK_API_TOKEN');
        this.GHTK_PARTNER_CODE = this.configService.get('GHTK_PARTNER_CODE');
        if (!this.GHTK_API_TOKEN || !this.GHTK_PARTNER_CODE || !this.GHTK_BASE_API_URL) {
            this.logger.error('GHTK API credentials (token, base URL, partner code) are not fully set in environment variables.');
            throw new common_1.InternalServerErrorException('GHTK API is not configured. Please check your .env file.');
        }
        this.ghtkApi = axios_1.default.create({
            baseURL: this.GHTK_BASE_API_URL,
            headers: {
                Token: this.GHTK_API_TOKEN,
                'Content-Type': 'application/json',
                'X-Client-Source': this.GHTK_PARTNER_CODE,
            },
            timeout: 30000,
        });
        this.ghtkApi.interceptors.response.use((response) => response, (error) => {
            if (axios_1.default.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data?.message || `GHTK API returned status ${error.response.status}`;
                this.logger.error(`GHTK API Error [${error.response.status}]: ${JSON.stringify(error.response.data)}`);
                throw new common_1.BadRequestException(errorMessage);
            }
            else if (axios_1.default.isAxiosError(error) && error.request) {
                this.logger.error(`GHTK API No Response: ${error.message}`);
                throw new common_1.InternalServerErrorException('Không nhận được phản hồi từ GHTK API. Vui lòng thử lại sau.');
            }
            else {
                this.logger.error(`GHTK API Request Error: ${error.message}`);
                throw new common_1.InternalServerErrorException('Lỗi không xác định khi gửi yêu cầu đến GHTK API.');
            }
        });
        this.loadDefaultPickupConfig();
    }
    async loadDefaultPickupConfig() {
        try {
            const config = await this.prisma.config.findFirst({
                select: {
                    pick_province: true,
                    pick_district: true,
                    pick_ward: true,
                    pick_address: true,
                    pick_tel: true,
                    pick_name: true,
                },
            });
            if (config) {
                this.defaultPickupConfig = config;
                this.logger.log('Default pickup configuration loaded successfully from Config model.');
            }
            else {
                this.logger.warn('No default pickup configuration found in Config model. GHTK orders may fail without it.');
            }
        }
        catch (error) {
            this.logger.error(`Failed to load default pickup configuration: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Failed to load GHTK default pickup configuration.');
        }
    }
    async sendGetRequest(path, params) {
        try {
            this.logger.debug(`Sending GET request to GHTK: ${path} with params: ${JSON.stringify(params)}`);
            const response = await this.ghtkApi.get(path, { params });
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }
    async sendPostRequest(path, data) {
        try {
            this.logger.debug(`Sending POST request to GHTK: ${path} with data: ${JSON.stringify(data)}`);
            const response = await this.ghtkApi.post(path, data);
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }
    async calculateShippingFee(data) {
        if (!this.defaultPickupConfig) {
            await this.loadDefaultPickupConfig();
            if (!this.defaultPickupConfig) {
                throw new common_1.InternalServerErrorException('GHTK default pickup configuration is not available.');
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
            const response = await this.sendGetRequest(this.GHTK_FEE_PATH, params);
            if (response.success && response.fee) {
                this.logger.log(`GHTK Fee Calculated: ${response.fee.fee}`);
                return response;
            }
            else {
                this.logger.warn(`GHTK API returned failure for fee calculation: ${response.message || 'Unknown reason'}`);
                throw new common_1.BadRequestException(response.message || 'Không thể tính phí vận chuyển. Vui lòng kiểm tra lại thông tin địa chỉ.');
            }
        }
        catch (error) {
            throw error;
        }
    }
    async createGHTKOrder(orderId) {
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
                                product: true,
                            },
                        },
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found.');
        }
        if (!this.defaultPickupConfig) {
            await this.loadDefaultPickupConfig();
            if (!this.defaultPickupConfig) {
                throw new common_1.InternalServerErrorException('GHTK default pickup configuration is not available or incomplete.');
            }
        }
        const productsForGHTK = order.items.map(item => {
            let itemWeightGram = 0;
            let itemName = 'Unknown Item';
            let itemPrice = 0;
            if (item.variant && item.variant.product) {
                itemWeightGram = item.variant.product.weight ?? 0;
                itemName = item.variant.title || item.variant.product.title;
                itemPrice = item.variant.price;
            }
            else if (item.product) {
                itemWeightGram = item.product.weight ?? 0;
                itemName = item.product.title;
                itemPrice = item.product.price;
            }
            const weightInKg = itemWeightGram / 1000;
            const finalWeight = weightInKg > 0 ? weightInKg : 0.1;
            return {
                name: itemName,
                weight: finalWeight,
                quantity: item.quantity,
                price: itemPrice,
            };
        });
        const ghtkPayload = {
            order: {
                pick_province: this.defaultPickupConfig.pick_province || '',
                pick_district: this.defaultPickupConfig.pick_district || '',
                pick_ward: this.defaultPickupConfig.pick_ward || '',
                pick_address: this.defaultPickupConfig.pick_address || '',
                pick_tel: this.defaultPickupConfig.pick_tel || '',
                pick_name: this.defaultPickupConfig.pick_name || '',
                province: order.shippingAddress.province || '',
                district: order.shippingAddress.district || '',
                ward: order.shippingAddress.ward || '',
                address: order.shippingAddress.address || '',
                tel: order.shippingAddress.phone || '',
                name: order.shippingAddress.fullName || '',
                note: order.note || `Đơn hàng ${order.id} từ ${order.user.name}`,
                value: order.totalAmount,
                pick_money: order.paymentMethod === 'COD' ? order.finalAmount : 0,
                is_freeship: order.shippingFee === 0 ? 1 : 0,
                products: productsForGHTK,
            },
        };
        try {
            this.logger.log(`Creating GHTK order for orderId: ${orderId} with payload (partial): ${JSON.stringify(ghtkPayload.order)}`);
            const response = await this.sendPostRequest(this.GHTK_ORDER_PATH, ghtkPayload);
            if (response.success && response.order) {
                this.logger.log(`GHTK Order Created with label: ${response.order.label}`);
                await this.prisma.order.update({
                    where: { id: orderId },
                    data: {
                        ghtkLabel: response.order.label,
                        ghtkStatus: response.order.status,
                        ghtkTrackingUrl: response.order.tracking_link,
                    },
                });
                return response.order;
            }
            else {
                throw new common_1.BadRequestException(response.message || 'Không thể tạo đơn hàng trên Giao Hàng Tiết Kiệm.');
            }
        }
        catch (error) {
            throw error;
        }
    }
    async getProvinces() {
        try {
            const response = await this.sendGetRequest(this.GHTK_PUBLIC_PROVINCE_PATH);
            if (response.success) {
                return response.data;
            }
            throw new common_1.BadRequestException(response.message || 'Failed to fetch provinces from GHTK.');
        }
        catch (error) {
            throw error;
        }
    }
    async getDistricts(provinceId) {
        try {
            const response = await this.sendGetRequest(this.GHTK_PUBLIC_DISTRICT_PATH, { province: provinceId });
            if (response.success) {
                return response.data;
            }
            throw new common_1.BadRequestException(response.message || 'Failed to fetch districts from GHTK.');
        }
        catch (error) {
            throw error;
        }
    }
    async getWards(districtId) {
        try {
            const response = await this.sendGetRequest(this.GHTK_PUBLIC_WARD_PATH, { district: districtId });
            if (response.success) {
                return response.data;
            }
            throw new common_1.BadRequestException(response.message || 'Failed to fetch wards from GHTK.');
        }
        catch (error) {
            throw error;
        }
    }
    async cancelGHTKOrder(ghtkLabel) {
        try {
            this.logger.log(`Cancelling GHTK order with label: ${ghtkLabel}`);
            const response = await this.sendPostRequest(`${this.GHTK_CANCEL_ORDER_PATH}/${ghtkLabel}`, {});
            if (response.success) {
                this.logger.log(`GHTK Order ${ghtkLabel} cancelled successfully.`);
                return response;
            }
            else {
                throw new common_1.BadRequestException(response.message || 'Không thể hủy đơn hàng trên Giao Hàng Tiết Kiệm.');
            }
        }
        catch (error) {
            throw error;
        }
    }
    async trackGHTKOrder(ghtkLabel) {
        try {
            this.logger.log(`Tracking GHTK order with label: ${ghtkLabel}`);
            const response = await this.sendGetRequest(`${this.GHTK_TRACKING_PATH}/${ghtkLabel}`);
            if (response.success) {
                this.logger.log(`GHTK Order ${ghtkLabel} tracking fetched.`);
                return response;
            }
            else {
                throw new common_1.NotFoundException(response.message || 'Không tìm thấy thông tin theo dõi đơn hàng GHTK.');
            }
        }
        catch (error) {
            throw error;
        }
    }
    async getPrintLabelUrl(ghtkLabel) {
        const url = `${this.GHTK_BASE_API_URL}${this.GHTK_PRINT_LABEL_PATH}/${ghtkLabel}`;
        this.logger.log(`Generated GHTK print label URL: ${url}`);
        return url;
    }
};
exports.GhtkService = GhtkService;
exports.GhtkService = GhtkService = GhtkService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], GhtkService);
//# sourceMappingURL=ghtk.service.js.map