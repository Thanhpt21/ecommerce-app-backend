import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CouponService } from 'src/coupon/coupon.service';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/users/enums/user.enums';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { SelfOrAdminGuard } from 'src/common/guards/self-or-admin/self-or-admin.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto, @Request() req) {
    return this.orderService.create(dto, req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard) // <--- THÊM RolesGuard Ở ĐÂY
  @Roles(UserRole.ADMIN) // <--- CHỈ ADMIN MỚI ĐƯỢC GỌI ENDPOINT NÀY
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
    @CurrentUser() user: UserResponseDto, // user.role sẽ luôn là ADMIN ở đây
    @Query('status') statusFilter?: string,
    @Query('paymentMethod') paymentMethodFilter?: string,
  ) {
    const parsedPage = +page;
    const parsedLimit = +limit;

    // Vì endpoint này chỉ dành cho ADMIN, chúng ta luôn truyền 'undefined' cho userId
    // để lấy tất cả đơn hàng.
    return this.orderService.findAll(
      undefined, // Truyền undefined vì Admin lấy tất cả
      parsedPage,
      parsedLimit,
      search,
      statusFilter,
      paymentMethodFilter,
    );
  }

  @Get('user') // Đường dẫn sẽ là /orders/user
  findOrdersByUser(
    @Request() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.orderService.findOrdersByUser(req.user.id, +page, +limit);
  }


  @Get(':id')
  @UseGuards(SelfOrAdminGuard) 
  findOne(@Param('id') id: string,@CurrentUser() user: UserResponseDto) {
    return this.orderService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.orderService.update(+id, dto);
  }



  @Delete(':id')
  @UseGuards(RolesGuard) // <--- THÊM RolesGuard VÀO ĐÂY
  @Roles(UserRole.ADMIN) // <--- CHỈ ADMIN MỚI CÓ THỂ XÓA
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }

  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard) // nếu cần auth
  cancelOrder(
    @Param('id') orderId: string,
    @Body() dto: CancelOrderDto,
   @Request() req,
  ) {
    return this.orderService.cancelOrder(orderId, req.user.id, dto);
  }

}
