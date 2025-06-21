// create-order.dto.ts
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, PaymentMethod } from '../enums/order.enums'; // đường dẫn tùy bạn

export class OrderItemDto {
  @ValidateIf((o) => !o.variantId)
  @IsNumber()
  productId?: number;

  @ValidateIf((o) => !o.productId)
  @IsNumber()
  variantId?: number;

  @IsOptional()
  @IsNumber()
  sizeId?: number;

  @IsOptional()
  @IsNumber()
  colorId?: number;

  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsNumber()
  shippingAddressId: number;
  

  @ValidateIf((o) => o.shippingId === undefined || o.shippingId === null)
  @IsNumber()
  shippingFee?: number; // Đặt là tùy chọn vì có thể không cần nếu có shippingId

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsNumber()
  couponId?: number;

  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
