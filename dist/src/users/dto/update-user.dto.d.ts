import { AccountType, UserRole } from '../enums/user.enums';
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    profilePicture?: string;
    phoneNumber?: string;
    gender?: string;
    isActive?: boolean;
    type_account?: AccountType;
}
