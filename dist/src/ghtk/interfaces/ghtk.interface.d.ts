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
    };
    reason?: string;
}
export interface GHTKProvinceResponse {
    success: boolean;
    data: {
        ProvinceID: number;
        ProvinceName: string;
    }[];
}
export interface GHTKDistrictResponse {
    success: boolean;
    data: {
        DistrictID: number;
        DistrictName: string;
        ProvinceID: number;
    }[];
}
export interface GHTKWardResponse {
    success: boolean;
    data: {
        WardID: number;
        WardName: string;
        DistrictID: number;
    }[];
}
