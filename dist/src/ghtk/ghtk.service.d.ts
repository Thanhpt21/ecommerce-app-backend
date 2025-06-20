import { ConfigService } from '@nestjs/config';
import { CalculateFeeDto } from './dto/calculate-fee.dto';
import { GHTKCreateOrderResponse } from './interfaces/ghtk.interface';
import { PrismaService } from 'prisma/prisma.service';
export declare class GhtkService {
    private configService;
    private prisma;
    private readonly logger;
    private ghtkApi;
    private ghtkToken;
    private ghtkShipFeeUrl;
    private ghtkCreateOrderUrl;
    private ghtkPartnerCode;
    constructor(configService: ConfigService, prisma: PrismaService);
    calculateShippingFee(data: CalculateFeeDto): Promise<number>;
    createGHTKOrder(orderId: number, pickUpAddressId: number): Promise<GHTKCreateOrderResponse['order']>;
    getProvinces(): Promise<{
        ProvinceID: number;
        ProvinceName: string;
    }[]>;
    getDistricts(provinceId: number): Promise<{
        DistrictID: number;
        DistrictName: string;
        ProvinceID: number;
    }[]>;
    getWards(districtId: number): Promise<{
        WardID: number;
        WardName: string;
        DistrictID: number;
    }[]>;
}
