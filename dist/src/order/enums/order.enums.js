"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Pending"] = "pending";
    OrderStatus["Confirmed"] = "confirmed";
    OrderStatus["Preparing"] = "preparing";
    OrderStatus["Shipped"] = "shipped";
    OrderStatus["Delivered"] = "delivered";
    OrderStatus["Completed"] = "completed";
    OrderStatus["Cancelled"] = "cancelled";
    OrderStatus["Returned"] = "returned";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["COD"] = "COD";
    PaymentMethod["VNPAY"] = "VNPay";
    PaymentMethod["MOMO"] = "Momo";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
//# sourceMappingURL=order.enums.js.map