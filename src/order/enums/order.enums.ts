// enums.ts
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed', // ⭐ THÊM ĐÂY ⭐
  PAID = 'paid',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered', // ⭐ THÊM ĐÂY ⭐
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RETURNED = 'returned', // ⭐ THÊM ĐÂY ⭐
}

export enum PaymentMethod {
  COD = 'COD',
  VNPAY = 'VNPay',
  MOMO = 'Momo',
}
