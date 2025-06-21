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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GhtkController = void 0;
const common_1 = require("@nestjs/common");
const ghtk_service_1 = require("./ghtk.service");
const calculate_fee_dto_1 = require("./dto/calculate-fee.dto");
const passport_1 = require("@nestjs/passport");
let GhtkController = class GhtkController {
    ghtkService;
    constructor(ghtkService) {
        this.ghtkService = ghtkService;
    }
    async calculateFee(calculateFeeDto) {
        const fee = await this.ghtkService.calculateShippingFee(calculateFeeDto);
        return { success: true, fee };
    }
    async createOrder(orderId) {
        const ghtkOrderDetails = await this.ghtkService.createGHTKOrder(orderId);
        return { success: true, message: 'Đơn hàng đã được tạo trên GHTK.', ghtkOrderDetails };
    }
    async getProvinces() {
        const provinces = await this.ghtkService.getProvinces();
        return {
            success: true,
            message: 'Lấy danh sách tỉnh/thành công.',
            data: provinces
        };
    }
    async getDistricts(provinceId) {
        const districts = await this.ghtkService.getDistricts(provinceId);
        return {
            success: true,
            message: `Lấy danh sách quận/huyện cho tỉnh/thành ID ${provinceId} thành công.`,
            data: districts
        };
    }
    async getWards(districtId) {
        const wards = await this.ghtkService.getWards(districtId);
        return {
            success: true,
            message: `Lấy danh sách phường/xã cho quận/huyện ID ${districtId} thành công.`,
            data: wards
        };
    }
    async cancelOrder(ghtkLabel) {
        const result = await this.ghtkService.cancelGHTKOrder(ghtkLabel);
        return {
            success: true,
            message: result.message || `Đơn hàng GHTK với mã ${ghtkLabel} đã được hủy thành công.`,
            data: result
        };
    }
    async trackOrder(ghtkLabel) {
        const trackingInfo = await this.ghtkService.trackGHTKOrder(ghtkLabel);
        return {
            success: true,
            message: `Thông tin theo dõi cho đơn hàng GHTK ${ghtkLabel} đã được lấy thành công.`,
            data: trackingInfo
        };
    }
    async getPrintLabelUrl(ghtkLabel) {
        const printUrl = await this.ghtkService.getPrintLabelUrl(ghtkLabel);
        return {
            success: true,
            message: `URL in nhãn cho đơn hàng GHTK ${ghtkLabel} đã được tạo thành công.`,
            data: { url: printUrl }
        };
    }
};
exports.GhtkController = GhtkController;
__decorate([
    (0, common_1.Post)('calculate-fee'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_fee_dto_1.CalculateFeeDto]),
    __metadata("design:returntype", Promise)
], GhtkController.prototype, "calculateFee", null);
__decorate([
    (0, common_1.Post)('create-order'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GhtkController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('provinces'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GhtkController.prototype, "getProvinces", null);
__decorate([
    (0, common_1.Get)('districts'),
    __param(0, (0, common_1.Query)('provinceId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GhtkController.prototype, "getDistricts", null);
__decorate([
    (0, common_1.Get)('wards'),
    __param(0, (0, common_1.Query)('districtId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GhtkController.prototype, "getWards", null);
__decorate([
    (0, common_1.Put)('cancel-order/:ghtkLabel'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('ghtkLabel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GhtkController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Get)('track-order/:ghtkLabel'),
    __param(0, (0, common_1.Param)('ghtkLabel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GhtkController.prototype, "trackOrder", null);
__decorate([
    (0, common_1.Get)('print-label/:ghtkLabel'),
    __param(0, (0, common_1.Param)('ghtkLabel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GhtkController.prototype, "getPrintLabelUrl", null);
exports.GhtkController = GhtkController = __decorate([
    (0, common_1.Controller)('ghtk'),
    __metadata("design:paramtypes", [ghtk_service_1.GhtkService])
], GhtkController);
//# sourceMappingURL=ghtk.controller.js.map