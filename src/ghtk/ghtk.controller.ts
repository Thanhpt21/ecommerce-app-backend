import { Controller, Post, Body, Get, Query, Param, UseGuards } from '@nestjs/common';
import { GhtkService } from './ghtk.service';
import { CalculateFeeDto, CreateOrderGHTKDto } from './dto/calculate-fee.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('ghtk') // Base route cho các API của GHTK
export class GhtkController {
  constructor(private readonly ghtkService: GhtkService) {}

  @Post('calculate-fee')
  async calculateFee(@Body() calculateFeeDto: CalculateFeeDto) {
    const fee = await this.ghtkService.calculateShippingFee(calculateFeeDto);
    return { success: true, fee };
  }

  @Post('create-order')
  @UseGuards(AuthGuard('jwt')) // Yêu cầu xác thực JWT cho API này
  async createOrder(@Body('orderId') orderId: number, @Body('pickUpAddressId') pickUpAddressId: number) {
    const ghtkOrderDetails = await this.ghtkService.createGHTKOrder(orderId, pickUpAddressId);
    return { success: true, message: 'Đơn hàng đã được tạo trên GHTK.', ghtkOrderDetails };
  }

  @Get('provinces')
  async getProvinces() {
    const provinces = await this.ghtkService.getProvinces();
    return { success: true, data: provinces };
  }

  @Get('districts')
  async getDistricts(@Query('provinceId') provinceId: number) {
    const districts = await this.ghtkService.getDistricts(+provinceId);
    return { success: true, data: districts };
  }

  @Get('wards')
  async getWards(@Query('districtId') districtId: number) {
    const wards = await this.ghtkService.getWards(+districtId);
    return { success: true, data: wards };
  }
}