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
export interface GHTKCreateOrderResponse {
    success: boolean;
    message?: string;
    order?: {
        partner_id: string;
        label: string;
        area: string;
        fee: number;
        insurance_fee: number;
        created: string;
        status?: string;
        tracking_link?: string;
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
export interface GHTKCancelOrderResponse {
    success: boolean;
    message?: string;
    reason?: string;
}
