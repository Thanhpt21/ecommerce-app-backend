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
    ghtkToken;
    ghtkShipFeeUrl;
    ghtkCreateOrderUrl;
    ghtkPartnerCode;
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.ghtkToken = this.configService.get('GHTK_API_TOKEN');
        this.ghtkShipFeeUrl = this.configService.get('GHTK_API_URL');
        this.ghtkCreateOrderUrl = this.configService.get('GHTK_REGISTER_SHIPMENT_URL');
        this.ghtkPartnerCode = this.configService.get('GHTK_PARTNER_CODE');
        if (!this.ghtkToken || !this.ghtkShipFeeUrl || !this.ghtkCreateOrderUrl || !this.ghtkPartnerCode) {
            this.logger.error('GHTK API credentials (token, URLs, partner code) are not fully set in environment variables.');
            throw new common_1.InternalServerErrorException('GHTK API is not configured. Please check your .env file.');
        }
        this.ghtkApi = axios_1.default.create({
            baseURL: 'https://services.giaohangtietkiem.vn',
            headers: {
                Token: this.ghtkToken,
                'Content-Type': 'application/json',
                'X-Client-Source': this.ghtkPartnerCode,
            },
            timeout: 30000,
        });
        this.ghtkApi.interceptors.response.use(response => response, error => {
            if (error.response) {
                this.logger.error(`GHTK API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
                throw new common_1.InternalServerErrorException(error.response.data.message || 'Lỗi từ GHTK API');
            }
            else if (error.request) {
                this.logger.error(`GHTK API No Response: ${error.message}`);
                throw new common_1.InternalServerErrorException('Không nhận được phản hồi từ GHTK API.');
            }
            else {
                this.logger.error(`GHTK API Request Error: ${error.message}`);
                throw new common_1.InternalServerErrorException('Lỗi khi gửi yêu cầu đến GHTK API.');
            }
        });
    }
    async calculateShippingFee(data) {
        try {
            this.logger.log(`Calculating shipping fee for: ${JSON.stringify(data)}`);
            const response = await this.ghtkApi.get(this.ghtkShipFeeUrl, {
                params: {
                    pick_province: data.pick_province,
                    pick_district: data.pick_district,
                    pick_ward: data.pick_ward ?? '',
                    pick_address: data.pick_address ?? '',
                    province: data.province,
                    district: data.district,
                    ward: data.ward ?? '',
                    address: data.address ?? '',
                    weight: data.weight,
                    value: data.value ?? 0,
                    deliver_option: data.deliver_option === 'xteam' ? 'xteam' : 'none',
                    ...(data.transport && { transport: data.transport }),
                },
            });
            if (response.data.success && response.data.fee) {
                this.logger.log(`GHTK Fee Calculated: ${response.data.fee.fee}`);
                return response.data.fee.fee;
            }
            else {
                this.logger.warn(`GHTK API returned failure for fee calculation: ${response.data.message || 'Unknown reason'}`);
                throw new common_1.BadRequestException(response.data.message || 'Không thể tính phí vận chuyển. Vui lòng kiểm tra lại thông tin địa chỉ.');
            }
        }
        catch (error) {
            throw error;
        }
    }
    async createGHTKOrder(orderId, pickUpAddressId) {
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
        const pickUpAddress = await this.prisma.shippingAddress.findUnique({
            where: { id: pickUpAddressId },
        });
        if (!pickUpAddress) {
            throw new common_1.NotFoundException('Pickup address not found. Please configure your store/warehouse address.');
        }
        let totalWeightGram = 0;
        const productsForGHTK = order.items.map(item => {
            let itemWeightGram;
            let itemName;
            let itemPrice;
            if (item.variant) {
                itemWeightGram = item.variant.product.weight;
                itemName = item.variant.title;
                itemPrice = item.variant.price;
            }
            else if (item.product) {
                itemWeightGram = item.product.weight;
                itemName = item.product.title;
                itemPrice = item.product.price;
            }
            else {
                itemWeightGram = 0;
                itemName = 'Unknown Item';
                itemPrice = 0;
            }
            totalWeightGram += itemWeightGram * item.quantity;
            return {
                name: itemName,
                weight: itemWeightGram / 1000,
                quantity: item.quantity,
                price: itemPrice,
            };
        });
        const ghtkPayload = {
            pick_province: pickUpAddress.province,
            pick_district: pickUpAddress.district,
            pick_ward: pickUpAddress.ward ?? '',
            pick_address: pickUpAddress.address ?? '',
            pick_tel: pickUpAddress.phone ?? '',
            pick_name: pickUpAddress.fullName ?? '',
            province: order.shippingAddress.province,
            district: order.shippingAddress.district,
            ward: order.shippingAddress.ward ?? '',
            address: order.shippingAddress.address ?? '',
            tel: order.shippingAddress.phone ?? '',
            name: order.shippingAddress.fullName ?? '',
            note: order.note || `Đơn hàng ${order.id} từ ${order.user.name}`,
            value: order.totalAmount,
            pick_money: order.paymentMethod === 'COD' ? order.finalAmount : 0,
            is_freeship: order.shippingFee === 0 ? 1 : 0,
            products: productsForGHTK,
        };
        try {
            this.logger.log(`Creating GHTK order for orderId: ${orderId} with payload: ${JSON.stringify(ghtkPayload)}`);
            const response = await this.ghtkApi.post(this.ghtkCreateOrderUrl, {
                order: {
                    id: order.id.toString(),
                    ...ghtkPayload,
                },
            });
            if (response.data.success && response.data.order) {
                this.logger.log(`GHTK Order Created: ${response.data.order.label}`);
                return response.data.order;
            }
            else {
                this.logger.warn(`GHTK API returned failure for order creation: ${response.data.message || 'Unknown reason'}`);
                throw new common_1.BadRequestException(response.data.message || 'Không thể tạo đơn hàng trên Giao Hàng Tiết Kiệm.');
            }
        }
        catch (error) {
            throw error;
        }
    }
    async getProvinces() {
        try {
            const response = await this.ghtkApi.get('/public/province');
            if (response.data.success) {
                return response.data.data;
            }
            throw new common_1.InternalServerErrorException('Failed to fetch provinces from GHTK.');
        }
        catch (error) {
            this.logger.error(`Error fetching provinces: ${error.response?.data?.message || error.message}`);
            throw new common_1.InternalServerErrorException('Failed to fetch provinces from GHTK.');
        }
    }
    async getDistricts(provinceId) {
        try {
            const response = await this.ghtkApi.get(`/public/district?province=${provinceId}`);
            if (response.data.success) {
                return response.data.data;
            }
            throw new common_1.InternalServerErrorException('Failed to fetch districts from GHTK.');
        }
        catch (error) {
            this.logger.error(`Error fetching districts: ${error.response?.data?.message || error.message}`);
            throw new common_1.InternalServerErrorException('Failed to fetch districts from GHTK.');
        }
    }
    async getWards(districtId) {
        try {
            const response = await this.ghtkApi.get(`/public/ward?district=${districtId}`);
            if (response.data.success) {
                return response.data.data;
            }
            throw new common_1.InternalServerErrorException('Failed to fetch wards from GHTK.');
        }
        catch (error) {
            this.logger.error(`Error fetching wards: ${error.response?.data?.message || error.message}`);
            throw new common_1.InternalServerErrorException('Failed to fetch wards from GHTK.');
        }
    }
};
exports.GhtkService = GhtkService;
exports.GhtkService = GhtkService = GhtkService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], GhtkService);
//# sourceMappingURL=ghtk.service.js.map