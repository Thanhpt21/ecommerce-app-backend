import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { ShippingAddressService } from './shipping-address.service';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('shipping-address')
export class ShippingAddressController {
  constructor(private readonly shippingAddressService: ShippingAddressService) {}

  @Post()
  create(@Body() dto: CreateShippingAddressDto, @Request() req) {
    return this.shippingAddressService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.shippingAddressService.findAll(req.user.id);
  }

  @Get('by-user')
  findByUserIdQuery(@Query('userId', ParseIntPipe) userId: number) {
    return this.shippingAddressService.findByUserId(userId);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateShippingAddressDto,
    @Request() req,
  ) {
    return this.shippingAddressService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.shippingAddressService.remove(id, req.user.id);
  }
}
