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
exports.ShippingAddressController = void 0;
const common_1 = require("@nestjs/common");
const shipping_address_service_1 = require("./shipping-address.service");
const create_shipping_address_dto_1 = require("./dto/create-shipping-address.dto");
const update_shipping_address_dto_1 = require("./dto/update-shipping-address.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth/jwt-auth.guard");
let ShippingAddressController = class ShippingAddressController {
    shippingAddressService;
    constructor(shippingAddressService) {
        this.shippingAddressService = shippingAddressService;
    }
    create(dto, req) {
        return this.shippingAddressService.create(req.user.id, dto);
    }
    findAll(req) {
        return this.shippingAddressService.findAll(req.user.id);
    }
    findByUserIdQuery(userId) {
        return this.shippingAddressService.findByUserId(userId);
    }
    update(id, dto, req) {
        return this.shippingAddressService.update(id, req.user.id, dto);
    }
    remove(id, req) {
        return this.shippingAddressService.remove(id, req.user.id);
    }
};
exports.ShippingAddressController = ShippingAddressController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_shipping_address_dto_1.CreateShippingAddressDto, Object]),
    __metadata("design:returntype", void 0)
], ShippingAddressController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShippingAddressController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-user'),
    __param(0, (0, common_1.Query)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ShippingAddressController.prototype, "findByUserIdQuery", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_shipping_address_dto_1.UpdateShippingAddressDto, Object]),
    __metadata("design:returntype", void 0)
], ShippingAddressController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ShippingAddressController.prototype, "remove", null);
exports.ShippingAddressController = ShippingAddressController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('shipping-address'),
    __metadata("design:paramtypes", [shipping_address_service_1.ShippingAddressService])
], ShippingAddressController);
//# sourceMappingURL=shipping-address.controller.js.map