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
    async createOrder(orderId, pickUpAddressId) {
        const ghtkOrderDetails = await this.ghtkService.createGHTKOrder(orderId, pickUpAddressId);
        return { success: true, message: 'Đơn hàng đã được tạo trên GHTK.', ghtkOrderDetails };
    }
    async getProvinces() {
        const provinces = await this.ghtkService.getProvinces();
        return { success: true, data: provinces };
    }
    async getDistricts(provinceId) {
        const districts = await this.ghtkService.getDistricts(+provinceId);
        return { success: true, data: districts };
    }
    async getWards(districtId) {
        const wards = await this.ghtkService.getWards(+districtId);
        return { success: true, data: wards };
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
    __param(1, (0, common_1.Body)('pickUpAddressId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
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
    __param(0, (0, common_1.Query)('provinceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GhtkController.prototype, "getDistricts", null);
__decorate([
    (0, common_1.Get)('wards'),
    __param(0, (0, common_1.Query)('districtId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GhtkController.prototype, "getWards", null);
exports.GhtkController = GhtkController = __decorate([
    (0, common_1.Controller)('ghtk'),
    __metadata("design:paramtypes", [ghtk_service_1.GhtkService])
], GhtkController);
//# sourceMappingURL=ghtk.controller.js.map