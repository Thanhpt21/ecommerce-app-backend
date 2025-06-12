import { OrderStatus, PaymentMethod } from '../enums/order.enums';
export declare class OrderItemDto {
    productId?: number;
    variantId?: number;
    sizeId?: number;
    colorId?: number;
    quantity: number;
}
export declare class CreateOrderDto {
    status?: OrderStatus;
    paymentMethod?: PaymentMethod;
    shippingAddressId: number;
    shippingId?: number;
    shippingFee?: number;
    note?: string;
    couponId?: number;
    items: OrderItemDto[];
}
