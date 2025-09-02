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
export interface GHTKBaseResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}
export interface GHTKProvince {
    ProvinceID: number;
    ProvinceName: string;
}
export interface GHTKDistrict {
    DistrictID: number;
    ProvinceID: number;
    DistrictName: string;
}
export interface GHTKWard {
    WardCode: string;
    DistrictID: number;
    WardName: string;
}
export interface GHTKProvinceResponse extends GHTKBaseResponse<GHTKProvince[]> {
}
export interface GHTKDistrictResponse extends GHTKBaseResponse<GHTKDistrict[]> {
}
export interface GHTKWardResponse extends GHTKBaseResponse<GHTKWard[]> {
}
