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
    getProvinces(): Promise<import("./ghtk.service").ProvinceOpenAPI[]>;
    getDistricts(provinceCode: string): Promise<import("./ghtk.service").DistrictOpenAPI[]>;
    getWards(districtCode: string): Promise<import("./ghtk.service").WardOpenAPI[]>;
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
