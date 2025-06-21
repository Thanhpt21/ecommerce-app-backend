import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum GHTKTransportOption {
  ROAD = 'road',
  FLY = 'fly',
}

// Enum cho tùy chọn lấy hàng (pick_option)
export enum GHTKPickOption {
  COD = 'cod',
  POST = 'post', // Shop sẽ gửi tại bưu cục
}

export enum GHTKDeliverOption {
  XTEAM = 'xteam', // Giao hàng xfast
  NONE = 'none',   // Giao hàng tiêu chuẩn
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




export class GHTKProductItemDto {
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống.' })
  @IsString({ message: 'Tên sản phẩm phải là chuỗi.' })
  name: string;

  @IsNotEmpty({ message: 'Trọng lượng sản phẩm không được để trống.' })
  @IsNumber({}, { message: 'Trọng lượng sản phẩm phải là số.' })
  @Min(0.01, { message: 'Trọng lượng sản phẩm tối thiểu là 0.01 kg.' }) // GHTK thường yêu cầu trọng lượng > 0
  @Type(() => Number)
  weight: number; // Đơn vị KG

  @IsOptional()
  @IsNumber({}, { message: 'Số lượng sản phẩm phải là số.' })
  @Min(1, { message: 'Số lượng sản phẩm tối thiểu là 1.' })
  @Type(() => Number)
  quantity?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Giá sản phẩm phải là số.' })
  @Min(0, { message: 'Giá sản phẩm không được âm.' })
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsString({ message: 'Mã sản phẩm phải là chuỗi.' })
  product_code?: string;
}

// --- DTO cho việc tạo đơn hàng GHTK ---
export class CreateOrderGHTKDto {
  // ⭐⭐⭐ Đã thêm trường ID - BẮT BUỘC theo API GHTK ⭐⭐⭐
  @IsNotEmpty({ message: 'Mã đơn hàng không được để trống.' })
  @IsString({ message: 'Mã đơn hàng phải là chuỗi.' })
  id: string; // Mã đơn hàng trong hệ thống của đối tác

  // Thông tin điểm lấy hàng (người gửi)
  @IsNotEmpty({ message: 'Tên người gửi không được để trống.' })
  @IsString({ message: 'Tên người gửi phải là chuỗi.' })
  pick_name: string;

  @IsNotEmpty({ message: 'Địa chỉ lấy hàng không được để trống.' })
  @IsString({ message: 'Địa chỉ lấy hàng phải là chuỗi.' })
  pick_address: string;

  @IsNotEmpty({ message: 'Tỉnh/Thành phố lấy hàng không được để trống.' })
  @IsString({ message: 'Tỉnh/Thành phố lấy hàng phải là chuỗi.' })
  pick_province: string;

  @IsNotEmpty({ message: 'Quận/Huyện lấy hàng không được để trống.' })
  @IsString({ message: 'Quận/Huyện lấy hàng phải là chuỗi.' })
  pick_district: string;

  @IsOptional() // Tài liệu GHTK ghi đây là 'no' (tùy chọn)
  @IsString()
  pick_ward?: string;

  @IsOptional() // Thêm nếu bạn có trường này trong config của mình
  @IsString()
  pick_street?: string;

  @IsNotEmpty({ message: 'Số điện thoại người gửi không được để trống.' })
  @IsString({ message: 'Số điện thoại người gửi phải là chuỗi.' })
  pick_tel: string;

  @IsOptional() // Email người lấy hàng là tùy chọn
  @IsString()
  pick_email?: string;

  // Thông tin điểm giao hàng (người nhận)
  @IsNotEmpty({ message: 'Tên người nhận không được để trống.' })
  @IsString({ message: 'Tên người nhận phải là chuỗi.' })
  name: string;

  @IsNotEmpty({ message: 'Địa chỉ chi tiết người nhận không được để trống.' })
  @IsString({ message: 'Địa chỉ chi tiết người nhận phải là chuỗi.' })
  address: string;

  @IsNotEmpty({ message: 'Tỉnh/Thành phố người nhận không được để trống.' })
  @IsString({ message: 'Tỉnh/Thành phố người nhận phải là chuỗi.' })
  province: string;

  @IsNotEmpty({ message: 'Quận/Huyện người nhận không được để trống.' })
  @IsString({ message: 'Quận/Huyện người nhận phải là chuỗi.' })
  district: string;

  // ward hoặc street là bắt buộc (có ít nhất 1)
  @IsOptional()
  @IsString({ message: 'Phường/Xã người nhận phải là chuỗi.' })
  ward?: string;

  @IsOptional()
  @IsString({ message: 'Tên đường/phố người nhận phải là chuỗi.' })
  street?: string;

  // ⭐⭐⭐ Đã thêm trường HAMLET - BẮT BUỘC theo API GHTK ⭐⭐⭐
  @IsNotEmpty({ message: 'Thông tin thôn/ấp/xóm không được để trống (điền "Khác" nếu không có).' })
  @IsString({ message: 'Thông tin thôn/ấp/xóm phải là chuỗi.' })
  hamlet: string;

  @IsNotEmpty({ message: 'Số điện thoại người nhận không được để trống.' })
  @IsString({ message: 'Số điện thoại người nhận phải là chuỗi.' })
  tel: string;

  // ⭐⭐⭐ Đã thêm trường EMAIL - BẮT BUỘC theo API GHTK ⭐⭐⭐
  @IsNotEmpty({ message: 'Email người nhận không được để trống.' })
  @IsString({ message: 'Email người nhận phải là chuỗi.' })
  email: string;

  // Thông tin đơn hàng chung
  @IsOptional()
  @IsString()
  note?: string; // Ghi chú đơn hàng

  @IsNotEmpty({ message: 'Giá trị đóng khai giá không được để trống.' })
  @IsNumber({}, { message: 'Giá trị đóng khai giá phải là số.' })
  @Min(0, { message: 'Giá trị đóng khai giá không được âm.' })
  @Type(() => Number)
  value: number; // Giá trị đóng khai giá (để tính phí khai giá và bồi thường)

  @IsNotEmpty({ message: 'Số tiền thu hộ không được để trống.' })
  @IsNumber({}, { message: 'Số tiền thu hộ phải là số.' })
  @Min(0, { message: 'Số tiền thu hộ không được âm.' })
  @Type(() => Number)
  pick_money: number; // Số tiền CoD. Nếu bằng 0 thì không thu tiền CoD.

  @IsOptional()
  @IsNumber({}, { message: 'Trạng thái freeship phải là số (0 hoặc 1).' })
  @Min(0)
  @Type(() => Number)
  is_freeship?: 0 | 1; // 1 nếu freeship, 0 nếu không (mặc định 0)

  // ⭐⭐⭐ Đã thêm trường PICK_OPTION - BẮT BUỘC theo API GHTK ⭐⭐⭐
  @IsNotEmpty({ message: 'Tùy chọn lấy hàng không được để trống.' })
  @IsEnum(GHTKPickOption, { message: 'Tùy chọn lấy hàng không hợp lệ (phải là "cod" hoặc "post").' })
  pick_option: GHTKPickOption; // 'cod' hoặc 'post'

  // ⭐⭐⭐ Đã thêm trường TRANSPORT - TÙY CHỌN theo API GHTK ⭐⭐⭐
  @IsOptional()
  @IsEnum(GHTKTransportOption, { message: 'Phương thức vận chuyển không hợp lệ.' })
  transport?: GHTKTransportOption; // 'road' (bộ) , 'fly' (bay)

  // ⭐⭐⭐ Đã thêm trường DELIVER_OPTION - TÙY CHỌN theo API GHTK ⭐⭐⭐
  @IsOptional()
  @IsEnum(GHTKDeliverOption, { message: 'Tùy chọn giao hàng không hợp lệ.' })
  deliver_option?: GHTKDeliverOption; // 'xteam' nếu là xfast

  // Danh sách sản phẩm trong đơn hàng
  @IsNotEmpty({ message: 'Danh sách sản phẩm không được để trống.' })
  @IsArray({ message: 'Sản phẩm phải là một mảng.' })
  @ValidateNested({ each: true }) // Validate từng đối tượng trong mảng
  @Type(() => GHTKProductItemDto) // Chuyển đổi mỗi phần tử sang kiểu GHTKProductItemDto
  products: GHTKProductItemDto[];

  // Các trường khác như use_return_address, return_name, return_address, etc.
  // Bạn có thể thêm vào đây nếu cần thiết cho các luồng trả hàng phức tạp
  // tags?: number[]; // Nhãn đơn hàng
  // sub_tags?: number[]; // Chi tiết nhãn
}