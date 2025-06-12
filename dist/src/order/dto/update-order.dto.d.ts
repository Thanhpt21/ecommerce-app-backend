import { OrderStatus, PaymentMethod } from '../enums/order.enums';
export declare class UpdateOrderDto {
    status?: OrderStatus;
    note?: string;
    paymentMethod?: PaymentMethod;
    shippingAddressId?: number;
}
