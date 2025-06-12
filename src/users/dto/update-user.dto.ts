import { IsString, IsOptional, IsEmail, IsEnum, IsPhoneNumber } from 'class-validator';
import { AccountType, UserRole } from '../enums/user.enums';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  @IsEnum(AccountType)
  type_account?: AccountType;
}
