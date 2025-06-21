export declare class CreateShippingAddressDto {
    userId: number;
    fullName: string;
    phone: string;
    address: string;
    ward?: string;
    district?: string;
    province?: string;
    wardId?: number;
    districtId?: number;
    provinceId?: number;
    isDefault?: boolean;
}
