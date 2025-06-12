import {
  Controller, Get, Post, Body, Param, Delete, Put, Query,
  UseGuards
} from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user.enums';

@Controller('shippings')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateShippingDto) {
    return this.shippingService.create(dto);
  }

  @Get()
  getAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
  ) {
    return this.shippingService.findAll(+page, +limit, search);
  }

   @Get('all')
  getAllShippings(@Query('search') search = '') {
    return this.shippingService.findAllWithoutPagination(search);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.shippingService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateShippingDto) {
    return this.shippingService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.shippingService.remove(+id);
  }
}
