export declare enum GHTKTransportOption {
    ROAD = "road",
    FLY = "fly"
}
export declare enum GHTKPickOption {
    COD = "cod",
    POST = "post"
}
export declare enum GHTKDeliverOption {
    XTEAM = "xteam",
    NONE = "none"
}
export declare class CalculateFeeDto {
    pick_province: string;
    pick_district: string;
    pick_ward?: string;
    pick_address?: string;
    province: string;
    district: string;
    ward?: string;
    address?: string;
    weight: number;
    value?: number;
    deliver_option: string;
    transport?: GHTKTransportOption;
}
export declare class GHTKProductItemDto {
    name: string;
    weight: number;
    quantity?: number;
    price?: number;
    product_code?: string;
}
export declare class CreateOrderGHTKDto {
    id: string;
    pick_name: string;
    pick_address: string;
    pick_province: string;
    pick_district: string;
    pick_ward?: string;
    pick_street?: string;
    pick_tel: string;
    pick_email?: string;
    name: string;
    address: string;
    province: string;
    district: string;
    ward?: string;
    street?: string;
    hamlet: string;
    tel: string;
    email: string;
    note?: string;
    value: number;
    pick_money: number;
    is_freeship?: 0 | 1;
    pick_option: GHTKPickOption;
    transport?: GHTKTransportOption;
    deliver_option?: GHTKDeliverOption;
    products: GHTKProductItemDto[];
}
