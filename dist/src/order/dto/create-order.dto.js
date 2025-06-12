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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderDto = exports.OrderItemDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const order_enums_1 = require("../enums/order.enums");
class OrderItemDto {
    productId;
    variantId;
    sizeId;
    colorId;
    quantity;
}
exports.OrderItemDto = OrderItemDto;
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.variantId),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.productId),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "variantId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "sizeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "colorId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "quantity", void 0);
class CreateOrderDto {
    status;
    paymentMethod;
    shippingAddressId;
    shippingId;
    shippingFee;
    note;
    couponId;
    items;
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, class_validator_1.IsEnum)(order_enums_1.OrderStatus),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(order_enums_1.PaymentMethod),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "shippingAddressId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "shippingId", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.shippingId === undefined || o.shippingId === null),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "shippingFee", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "note", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "couponId", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OrderItemDto),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "items", void 0);
//# sourceMappingURL=create-order.dto.js.map