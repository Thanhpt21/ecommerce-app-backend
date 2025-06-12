import { IsString } from 'class-validator';

export class CancelOrderDto {
  @IsString()
  reason: string; // lý do hủy đơn hàng
}
