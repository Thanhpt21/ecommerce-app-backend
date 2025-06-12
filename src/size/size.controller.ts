import {
  Controller, Get, Post, Body, Param, Delete, Put, Query,
  UseGuards
} from '@nestjs/common';
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user.enums';

@Controller('sizes')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateSizeDto) {
    return this.sizeService.create(dto);
  }

  @Get()
  getAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
  ) {
    return this.sizeService.findAll(+page, +limit, search);
  }

  @Get('all')
  async getAllSizesWithoutPagination(@Query('search') search = '') {
    return this.sizeService.findAllWithoutPagination(search);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.sizeService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSizeDto,
  ) {
    return this.sizeService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.sizeService.remove(+id);
  }
}
