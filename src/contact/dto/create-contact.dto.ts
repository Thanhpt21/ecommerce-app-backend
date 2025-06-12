// src/contact/dto/create-contact.dto.ts

import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ContactType } from '../enums/contact.enums';

export class CreateContactDto {
  @IsString({ message: 'Tên phải là chuỗi.' })
  @IsNotEmpty({ message: 'Tên không được để trống.' })
  @MaxLength(255, { message: 'Tên không được vượt quá 255 ký tự.' })
  name: string;

  @IsEmail({}, { message: 'Email không hợp lệ.' })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  @MaxLength(255, { message: 'Email không được vượt quá 255 ký tự.' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi.' })
  @MaxLength(20, { message: 'Số điện thoại không được vượt quá 20 ký tự.' })
  mobile?: string; // mobile là tùy chọn

  @IsString({ message: 'Nội dung bình luận phải là chuỗi.' })
  @IsNotEmpty({ message: 'Nội dung bình luận không được để trống.' })
  comment: string;

  @IsOptional()
  @IsString({ message: 'Trạng thái phải là chuỗi.' })
  // Bạn có thể thêm @IsEnum nếu muốn giới hạn các giá trị cho status,
  // ví dụ: @IsEnum(['PENDING', 'RESOLVED', 'SPAM'], { message: 'Trạng thái không hợp lệ.' })
  status?: string; // status có giá trị mặc định trong Prisma, nên là tùy chọn

  @IsOptional()
  @IsEnum(ContactType, { message: 'Loại liên hệ không hợp lệ.' })
  type?: ContactType; // type là tùy chọn, sử dụng enum từ Prisma
}