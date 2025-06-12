import { AccountType } from '../enums/user.enums';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role?: string;
    phoneNumber?: string;
    gender?: string;
    type_account?: AccountType;
}
