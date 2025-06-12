"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["PAID"] = "paid";
    OrderStatus["SHIPPING"] = "shipping";
    OrderStatus["COMPLETED"] = "completed";
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["COD"] = "COD";
    PaymentMethod["VNPAY"] = "VNPay";
    PaymentMethod["MOMO"] = "Momo";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
//# sourceMappingURL=order.enums.js.map