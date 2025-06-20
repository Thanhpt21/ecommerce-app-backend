import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum GHTKTransportOption {
  ROAD = 'road',
  FLY = 'fly',
}

export class CalculateFeeDto {
  // Thông tin địa điểm gửi hàng (Pick-up location)
  @IsNotEmpty({ message: 'Tỉnh/Thành phố gửi không được để trống.' }) // Đảm bảo trường này không rỗng
  @IsString({ message: 'Tỉnh/Thành phố gửi phải là chuỗi.' }) // Đảm bảo trường này là chuỗi
  pick_province: string; // Tỉnh/Thành phố của địa điểm gửi hàng

  @IsNotEmpty({ message: 'Quận/Huyện gửi không được để trống.' }) // Đảm bảo trường này không rỗng
  @IsString({ message: 'Quận/Huyện gửi phải là chuỗi.' }) // Đảm bảo trường này là chuỗi
  pick_district: string; // Quận/Huyện của địa điểm gửi hàng

    @IsOptional()
  @IsString()
  pick_ward?: string; // ADDED: Phường/xã nơi lấy hàng

  
  @IsOptional() // Trường này là tùy chọn, có thể không có
  @IsString() // Đảm bảo nếu có thì là chuỗi
  pick_address?: string; // Địa chỉ cụ thể của địa điểm gửi hàng (ví dụ: số nhà, tên đường)

  // Thông tin địa điểm nhận hàng (Delivery location)
  @IsNotEmpty({ message: 'Tỉnh/Thành phố nhận không được để trống.' }) // Đảm bảo trường này không rỗng
  @IsString({ message: 'Tỉnh/Thành phố nhận phải là chuỗi.' }) // Đảm bảo trường này là chuỗi
  province: string; // Tỉnh/Thành phố của địa điểm nhận hàng

  @IsNotEmpty({ message: 'Quận/Huyện nhận không được để trống.' }) // Đảm bảo trường này không rỗng
  @IsString({ message: 'Quận/Huyện nhận phải là chuỗi.' }) // Đảm bảo trường này là chuỗi
  district: string; // Quận/Huyện của địa điểm nhận hàng

  @IsOptional() // Trường này là tùy chọn
  @IsString({ message: 'Phường/Xã nhận phải là chuỗi.' }) // Đảm bảo nếu có thì là chuỗi
  ward?: string; // Phường/Xã của địa điểm nhận hàng

  @IsOptional() // Trường này là tùy chọn
  @IsString({ message: 'Địa chỉ cụ thể nhận phải là chuỗi.' }) // Đảm bảo nếu có thì là chuỗi
  address?: string; // Địa chỉ cụ thể của địa điểm nhận hàng

  // Thông tin về kiện hàng
  @IsNotEmpty({ message: 'Trọng lượng không được để trống.' }) // Đảm bảo trường này không rỗng
  @IsNumber({}, { message: 'Trọng lượng phải là số.' }) // Đảm bảo trường này là số
  @Min(0.1, { message: 'Trọng lượng phải lớn hơn 0.' }) // Giá trị tối thiểu phải lớn hơn 0 (0.1 kg)
  @Type(() => Number) // Chuyển đổi giá trị nhận được sang kiểu Number
  weight: number; // Trọng lượng của kiện hàng (đơn vị có thể là gram hoặc kg, tùy theo API GHTK)

  @IsOptional() // Trường này là tùy chọn
  @IsNumber({}, { message: 'Giá trị đơn hàng phải là số.' }) // Đảm bảo nếu có thì là số
  @Min(0, { message: 'Giá trị đơn hàng không được âm.' }) // Giá trị tối thiểu không được âm
  @Type(() => Number) // Chuyển đổi giá trị nhận được sang kiểu Number
  value?: number; // Giá trị khai báo của đơn hàng (dùng để tính bảo hiểm hoặc COD)


   @IsString()
  // @IsEnum(['xteam', 'none']) // Bạn có thể sử dụng @IsEnum nếu muốn validate chặt chẽ
  deliver_option: string; // Đã là 'xteam' hoặc 'none' từ các trao đổi trước

  @IsOptional()
  @IsEnum(GHTKTransportOption) // THÊM DÒNG NÀY ĐỂ VALIDATE TRANSPORT OPTION
  transport?: GHTKTransportOption; // THÊM TRƯỜNG NÀY
}

export class CreateOrderGHTKDto {
  // Thông tin địa điểm lấy hàng (người gửi)
  @IsNotEmpty() // Đảm bảo trường này không rỗng
  @IsString() // Đảm bảo trường này là chuỗi
  pick_province: string; // Tỉnh/Thành phố của địa điểm lấy hàng

  @IsNotEmpty() // Đảm bảo trường này không rỗng
  @IsString() // Đảm bảo trường này là chuỗi
  pick_district: string; // Quận/Huyện của địa điểm lấy hàng

  @IsNotEmpty() // Đảm bảo trường này không rỗng
  @IsString() // Đảm bảo trường này là chuỗi
  pick_ward: string; // Phường/Xã của địa điểm lấy hàng

  @IsNotEmpty() // Đảm bảo trường này không rỗng
  @IsString() // Đảm bảo trường này là chuỗi
  pick_address: string; // Địa chỉ cụ thể của địa điểm lấy hàng

  @IsNotEmpty() // Đảm bảo trường này không rỗng
  @IsString() // Đảm bảo trường này là chuỗi
  pick_tel: string; // Số điện thoại người gửi

  @IsNotEmpty() // Đảm bảo trường này không rỗng
  @IsString() // Đảm bảo trường này là chuỗi
  pick_name: string; // Tên người gửi

  // Thông tin địa điểm giao hàng (người nhận)
  @IsNotEmpty() // Đảm bảo trường này không rỗng
  @IsString() // Đảm bảo trường này là chuỗi
  province: string; // Tỉnh/Thành phố của địa điểm nhận hàng

  @IsNotEmpty() // Đảm bảo trường này không rỗng
  @IsString() // Đảm bảo trường này là chuỗi
  district: string; // Quận/Huyện của địa điểm nhận hàng

  @IsNotEmpty() // Đảm bảo trường này không rỗng
  @IsString() // Đảm bảo trường này là chuỗi
  ward: string; // Phường/Xã của địa điểm nhận hàng

  @IsNotEmpty() // Đảm bảo trường này không rỗng
  @IsString() // Đảm bảo trường này là chuỗi
  address: string; // Địa chỉ cụ thể của địa điểm nhận hàng

  @IsNotEmpty() // Đảm bảo trường này không rỗng
  @IsString() // Đảm bảo trường này là chuỗi
  tel: string; // Số điện thoại người nhận

  @IsNotEmpty() // Đảm bảo trường này không rỗng
  @IsString() // Đảm bảo trường này là chuỗi
  name: string; // Tên người nhận

  @IsOptional() // Trường này là tùy chọn
  @IsString() // Đảm bảo nếu có thì là chuỗi
  note?: string; // Ghi chú cho đơn hàng

  // Thông tin tài chính và trạng thái đơn hàng
  @IsNotEmpty() // Đảm bảo trường này không rỗng
  @IsNumber() // Đảm bảo trường này là số
  @Min(0) // Giá trị tối thiểu là 0
  @Type(() => Number) // Chuyển đổi giá trị nhận được sang kiểu Number
  value: number; // Tổng giá trị của đơn hàng (thường là tổng giá các sản phẩm)

  @IsOptional() // Trường này là tùy chọn
  @IsNumber() // Đảm bảo nếu có thì là số
  @Min(0) // Giá trị tối thiểu là 0
  @Type(() => Number) // Chuyển đổi giá trị nhận được sang kiểu Number
  transport_fee?: number; // Phí vận chuyển (nếu có, có thể do người bán tự điền hoặc GHTK tính)

  @IsOptional() // Trường này là tùy chọn
  @IsNumber() // Đảm bảo nếu có thì là số
  @Min(0) // Giá trị tối thiểu là 0
  @Type(() => Number) // Chuyển đổi giá trị nhận được sang kiểu Number
  is_freeship?: number; // Cờ báo hiệu có miễn phí vận chuyển hay không (thường là 0 hoặc 1)

  @IsOptional() // Trường này là tùy chọn
  @IsNumber() // Đảm bảo nếu có thì là số
  @Min(0) // Giá trị tối thiểu là 0
  @Type(() => Number) // Chuyển đổi giá trị nhận được sang kiểu Number
  pick_money?: number; // Số tiền cần thu hộ (COD - Cash On Delivery)

  // Danh sách sản phẩm trong đơn hàng
  @IsNotEmpty() // Đảm bảo danh sách này không rỗng
  @Type(() => Array) // Chuyển đổi giá trị nhận được sang kiểu Array
  products: { // Một mảng các đối tượng, mỗi đối tượng đại diện cho một sản phẩm
    name: string; // Tên sản phẩm
    weight: number; // Trọng lượng của một đơn vị sản phẩm
    product_code?: string; // Mã sản phẩm (tùy chọn)
    quantity: number; // Số lượng sản phẩm này
    price?: number; // Giá của một đơn vị sản phẩm (tùy chọn)
  }[];
}