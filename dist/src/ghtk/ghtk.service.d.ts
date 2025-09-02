import { ConfigService } from '@nestjs/config';
import { CalculateFeeDto } from './dto/calculate-fee.dto';
import { GHTKShipFeeResponse, GHTKCreateOrderResponse, GHTKTrackingResponse, GHTKCancelOrderResponse } from './interfaces/ghtk.interface';
import { PrismaService } from 'prisma/prisma.service';
export interface ProvinceOpenAPI {
    code: string;
    name: string;
    codename: string;
    division_type: string;
    phone_code: number;
    districts?: DistrictOpenAPI[];
}
export interface DistrictOpenAPI {
    code: string;
    name: string;
    codename: string;
    division_type: string;
    short_codename: string;
    province_code: string;
    wards?: WardOpenAPI[];
}
export interface WardOpenAPI {
    code: string;
    name: string;
    codename: string;
    division_type: string;
    short_codename: string;
    district_code: string;
}
export declare class GhtkService {
    private configService;
    private prisma;
    private readonly logger;
    private ghtkApi;
    private readonly GHTK_BASE_API_URL;
    private readonly GHTK_API_TOKEN;
    private readonly GHTK_PARTNER_CODE;
    private openApiProvinces;
    private readonly OPEN_API_PROVINCES_BASE_URL;
    private readonly GHTK_FEE_PATH;
    private readonly GHTK_ORDER_PATH;
    private readonly GHTK_CANCEL_ORDER_PATH;
    private readonly GHTK_TRACKING_PATH;
    private readonly GHTK_PRINT_LABEL_PATH;
    private defaultPickupConfig;
    constructor(configService: ConfigService, prisma: PrismaService);
    private loadDefaultPickupConfig;
    private sendGetRequest;
    private sendPostRequest;
    private sendDeleteRequest;
    calculateShippingFee(data: CalculateFeeDto): Promise<GHTKShipFeeResponse>;
    createGHTKOrder(orderId: number): Promise<GHTKCreateOrderResponse['order']>;
    getProvincesOpenAPI(): Promise<ProvinceOpenAPI[]>;
    getDistrictsOpenAPI(provinceCode: string): Promise<DistrictOpenAPI[]>;
    getWardsOpenAPI(districtCode: string): Promise<WardOpenAPI[]>;
    trackGHTKOrder(ghtkLabel: string): Promise<GHTKTrackingResponse>;
    getPrintLabelUrl(ghtkLabel: string): Promise<string>;
    cancelGHTKOrder(ghtkLabel: string): Promise<GHTKCancelOrderResponse>;
}
