export declare class UserResponseDto {
    id: number;
    name: string;
    email: string;
    phoneNumber: number | null;
    profilePicture: string | null;
    gender: string | null;
    role: string;
    type_account: string;
    isActive: boolean;
    constructor(user: any);
}
