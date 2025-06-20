export declare enum GHTKTransportOption {
    ROAD = "road",
    FLY = "fly"
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
export declare class CreateOrderGHTKDto {
    pick_province: string;
    pick_district: string;
    pick_ward: string;
    pick_address: string;
    pick_tel: string;
    pick_name: string;
    province: string;
    district: string;
    ward: string;
    address: string;
    tel: string;
    name: string;
    note?: string;
    value: number;
    transport_fee?: number;
    is_freeship?: number;
    pick_money?: number;
    products: {
        name: string;
        weight: number;
        product_code?: string;
        quantity: number;
        price?: number;
    }[];
}
