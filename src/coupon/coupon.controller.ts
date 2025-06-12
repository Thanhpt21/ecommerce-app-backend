import {
  Controller, Get, Post, Body, Param, Delete, Put, UseGuards,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user.enums';
import { UseCouponDto } from './dto/use-coupon.dto';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateCouponDto) {
    return this.couponService.create(dto);
  }

    @Get()
    findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
    ) {
    return this.couponService.findAll(+page, +limit, search);
    }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateCouponDto) {
    return this.couponService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.couponService.remove(+id);
  }


  @Post('use-coupon')
  @UseGuards(JwtAuthGuard) // Nếu muốn bảo vệ route bằng auth
  @HttpCode(HttpStatus.OK)  // Trả về 200 ngay cả khi thất bại (success=false)
  async useCoupon(@Body() dto: UseCouponDto) {
    return this.couponService.useCoupon(dto.code, dto.orderValue);
  }
}
