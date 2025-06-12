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
exports.CouponController = void 0;
const common_1 = require("@nestjs/common");
const coupon_service_1 = require("./coupon.service");
const create_coupon_dto_1 = require("./dto/create-coupon.dto");
const update_coupon_dto_1 = require("./dto/update-coupon.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_enums_1 = require("../users/enums/user.enums");
const use_coupon_dto_1 = require("./dto/use-coupon.dto");
let CouponController = class CouponController {
    couponService;
    constructor(couponService) {
        this.couponService = couponService;
    }
    create(dto) {
        return this.couponService.create(dto);
    }
    findAll(page = 1, limit = 10, search = '') {
        return this.couponService.findAll(+page, +limit, search);
    }
    findOne(id) {
        return this.couponService.findOne(+id);
    }
    update(id, dto) {
        return this.couponService.update(+id, dto);
    }
    remove(id) {
        return this.couponService.remove(+id);
    }
    async useCoupon(dto) {
        return this.couponService.useCoupon(dto.code, dto.orderValue);
    }
};
exports.CouponController = CouponController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_coupon_dto_1.CreateCouponDto]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_coupon_dto_1.UpdateCouponDto]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('use-coupon'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [use_coupon_dto_1.UseCouponDto]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "useCoupon", null);
exports.CouponController = CouponController = __decorate([
    (0, common_1.Controller)('coupons'),
    __metadata("design:paramtypes", [coupon_service_1.CouponService])
], CouponController);
//# sourceMappingURL=coupon.controller.js.map