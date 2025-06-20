import { GhtkService } from './ghtk.service';
import { CalculateFeeDto } from './dto/calculate-fee.dto';
export declare class GhtkController {
    private readonly ghtkService;
    constructor(ghtkService: GhtkService);
    calculateFee(calculateFeeDto: CalculateFeeDto): Promise<{
        success: boolean;
        fee: number;
    }>;
    createOrder(orderId: number, pickUpAddressId: number): Promise<{
        success: boolean;
        message: string;
        ghtkOrderDetails: {
            partner_id: string;
            label: string;
            area: string;
            fee: number;
            insurance_fee: number;
            created: string;
        } | undefined;
    }>;
    getProvinces(): Promise<{
        success: boolean;
        data: {
            ProvinceID: number;
            ProvinceName: string;
        }[];
    }>;
    getDistricts(provinceId: number): Promise<{
        success: boolean;
        data: {
            DistrictID: number;
            DistrictName: string;
            ProvinceID: number;
        }[];
    }>;
    getWards(districtId: number): Promise<{
        success: boolean;
        data: {
            WardID: number;
            WardName: string;
            DistrictID: number;
        }[];
    }>;
}
