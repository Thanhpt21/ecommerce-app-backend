import { Controller, Post, Body, Get, Query, Param, UseGuards, Put, ParseIntPipe } from '@nestjs/common';
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
async createOrder(@Body('orderId') orderId: number) { // ⭐ Bỏ @Body('pickUpAddressId') ⭐
  // ⭐ Gọi phương thức mà không truyền pickUpAddressId ⭐
  const ghtkOrderDetails = await this.ghtkService.createGHTKOrder(orderId);
  return { success: true, message: 'Đơn hàng đã được tạo trên GHTK.', ghtkOrderDetails };
}

 @Get('provinces')
  async getProvinces() {
    return this.ghtkService.getProvincesOpenAPI();
  }

  @Get('districts/:provinceCode')
  async getDistricts(@Param('provinceCode') provinceCode: string) {
    return this.ghtkService.getDistrictsOpenAPI(provinceCode);
  }

  @Get('wards/:districtCode')
  async getWards(@Param('districtCode') districtCode: string) {
    return this.ghtkService.getWardsOpenAPI(districtCode);
  }


  @Put('cancel-order/:ghtkLabel') // Sử dụng PUT hoặc POST cho thao tác thay đổi trạng thái
  @UseGuards(AuthGuard('jwt')) // Chỉ người dùng được ủy quyền mới có thể hủy đơn
  async cancelOrder(
    @Param('ghtkLabel') ghtkLabel: string,
    // @CurrentUser() user: User // Nếu bạn muốn kiểm tra quyền hủy đơn của user
  ) {
    const result = await this.ghtkService.cancelGHTKOrder(ghtkLabel);
    return {
      success: true,
      message: result.message || `Đơn hàng GHTK với mã ${ghtkLabel} đã được hủy thành công.`,
      data: result
    };
  }

  @Get('track-order/:ghtkLabel')
  // Endpoint này có thể không cần AuthGuard nếu bạn muốn cho phép khách hàng theo dõi đơn hàng của họ
  async trackOrder(@Param('ghtkLabel') ghtkLabel: string) {
    const trackingInfo = await this.ghtkService.trackGHTKOrder(ghtkLabel);
    return {
      success: true,
      message: `Thông tin theo dõi cho đơn hàng GHTK ${ghtkLabel} đã được lấy thành công.`,
      data: trackingInfo
    };
  }

  @Get('print-label/:ghtkLabel')
  // Endpoint này có thể không cần AuthGuard nếu bạn muốn cho phép khách hàng in nhãn của họ
  async getPrintLabelUrl(@Param('ghtkLabel') ghtkLabel: string) {
    const printUrl = await this.ghtkService.getPrintLabelUrl(ghtkLabel);
    return {
      success: true,
      message: `URL in nhãn cho đơn hàng GHTK ${ghtkLabel} đã được tạo thành công.`,
      data: { url: printUrl } // Trả về URL để frontend có thể redirect hoặc mở cửa sổ mới
    };
  }
}