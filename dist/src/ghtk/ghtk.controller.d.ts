import { GhtkService } from './ghtk.service';
import { CalculateFeeDto } from './dto/calculate-fee.dto';
export declare class GhtkController {
    private readonly ghtkService;
    constructor(ghtkService: GhtkService);
    calculateFee(calculateFeeDto: CalculateFeeDto): Promise<{
        success: boolean;
        fee: import("./interfaces/ghtk.interface").GHTKShipFeeResponse;
    }>;
    createOrder(orderId: number): Promise<{
        success: boolean;
        message: string;
        ghtkOrderDetails: {
            label: string;
            partner_id: string;
            area: string;
            fee: number;
            insurance: number;
            estimated_pick_time: string;
            estimated_deliver_time: string;
            status: string;
            tracking_link: string;
        } | undefined;
    }>;
    getProvinces(): Promise<{
        success: boolean;
        message: string;
        data: {
            ProvinceID: number;
            ProvinceName: string;
        }[];
    }>;
    getDistricts(provinceId: number): Promise<{
        success: boolean;
        message: string;
        data: {
            DistrictID: number;
            DistrictName: string;
            ProvinceID: number;
        }[];
    }>;
    getWards(districtId: number): Promise<{
        success: boolean;
        message: string;
        data: {
            WardID: number;
            WardName: string;
            DistrictID: number;
        }[];
    }>;
    cancelOrder(ghtkLabel: string): Promise<{
        success: boolean;
        message: string;
        data: import("./interfaces/ghtk.interface").GHTKCancelOrderResponse;
    }>;
    trackOrder(ghtkLabel: string): Promise<{
        success: boolean;
        message: string;
        data: import("./interfaces/ghtk.interface").GHTKTrackingResponse;
    }>;
    getPrintLabelUrl(ghtkLabel: string): Promise<{
        success: boolean;
        message: string;
        data: {
            url: string;
        };
    }>;
}
