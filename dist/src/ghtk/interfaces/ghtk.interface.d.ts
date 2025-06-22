import { GHTKDeliverOption, GHTKPickOption, GHTKTransportOption } from "../dto/calculate-fee.dto";
export interface DefaultPickupConfig {
    pick_name: string;
    pick_address: string;
    pick_province: string;
    pick_district: string;
    pick_ward?: string;
    pick_tel: string;
}
export interface GHTKProduct {
    name: string;
    weight: number;
    quantity: number;
    price: number;
    product_code?: string | number;
}
export interface GHTKOrderRequestData {
    id: string;
    pick_name: string;
    pick_address: string;
    pick_province: string;
    pick_district: string;
    pick_ward?: string;
    pick_tel: string;
    pick_money: number;
    name: string;
    address: string;
    province: string;
    district: string;
    ward?: string;
    hamlet: string;
    tel: string;
    email?: string;
    note?: string;
    value: number;
    is_freeship: '0' | '1';
    pick_option: GHTKPickOption;
    transport: GHTKTransportOption;
    deliver_option: GHTKDeliverOption;
    pick_date?: string;
}
export interface GHTKCreateOrderPayload {
    order: GHTKOrderRequestData;
    products: GHTKProduct[];
}
export interface GHTKCreateOrderResponse {
    success: boolean;
    message?: string;
    order?: {
        label: string;
        partner_id: string;
        area: string;
        fee: number;
        insurance: number;
        estimated_pick_time: string;
        estimated_deliver_time: string;
        status: string;
        tracking_link: string;
    };
}
export interface GHTKCancelOrderResponse {
    success: boolean;
    message?: string;
    reason?: string;
}
export interface GHTKShipFeeResponse {
    success: boolean;
    message?: string;
    fee?: {
        name: string;
        fee: number;
        insurance_fee: number;
        extra_fee: {
            pickup_fee: number;
            return_fee: number;
        };
    };
    reason?: string;
}
export interface GHTKProvinceResponse {
    success: boolean;
    message?: string;
    data: {
        ProvinceID: number;
        ProvinceName: string;
    }[];
}
export interface GHTKDistrictResponse {
    success: boolean;
    message?: string;
    data: {
        DistrictID: number;
        DistrictName: string;
        ProvinceID: number;
    }[];
}
export interface GHTKWardResponse {
    success: boolean;
    message?: string;
    data: {
        WardID: number;
        WardName: string;
        DistrictID: number;
    }[];
}
export interface GHTKTrackingResponse {
    success: boolean;
    message?: string;
    order?: {
        label: string;
        partner_id: string;
        status: number;
        status_text: string;
    };
    reason?: string;
}
