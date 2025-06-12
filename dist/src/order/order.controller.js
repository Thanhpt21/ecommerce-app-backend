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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth/jwt-auth.guard");
const cancel_order_dto_1 = require("./dto/cancel-order.dto");
const user_response_dto_1 = require("../users/dto/user-response.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_enums_1 = require("../users/enums/user.enums");
const roles_guard_1 = require("../common/guards/roles/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const self_or_admin_guard_1 = require("../common/guards/self-or-admin/self-or-admin.guard");
let OrderController = class OrderController {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    create(dto, req) {
        return this.orderService.create(dto, req.user.id);
    }
    findAll(page = 1, limit = 10, search = '', user, statusFilter, paymentMethodFilter) {
        const parsedPage = +page;
        const parsedLimit = +limit;
        return this.orderService.findAll(undefined, parsedPage, parsedLimit, search, statusFilter, paymentMethodFilter);
    }
    findOrdersByUser(req, page = 1, limit = 10) {
        return this.orderService.findOrdersByUser(req.user.id, +page, +limit);
    }
    findOne(id, user) {
        return this.orderService.findOne(+id);
    }
    update(id, dto) {
        return this.orderService.update(+id, dto);
    }
    remove(id) {
        return this.orderService.remove(+id);
    }
    cancelOrder(orderId, dto, req) {
        return this.orderService.cancelOrder(orderId, req.user.id, dto);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __param(4, (0, common_1.Query)('status')),
    __param(5, (0, common_1.Query)('paymentMethod')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, user_response_dto_1.UserResponseDto, String, String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findOrdersByUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(self_or_admin_guard_1.SelfOrAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_response_dto_1.UserResponseDto]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_dto_1.UpdateOrderDto]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cancel_order_dto_1.CancelOrderDto, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "cancelOrder", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.Controller)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map