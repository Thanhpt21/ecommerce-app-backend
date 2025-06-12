import {
  Controller, Get, Post, Body, Param, Delete, Put, Query,
  UseGuards,
} from '@nestjs/common';
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user.enums';

@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateColorDto) {
    return this.colorService.create(dto);
  }

  @Get()
  getAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
  ) {
    return this.colorService.findAll(+page, +limit, search);
  }

  @Get('all')
  async getAllWithoutPagination(@Query('search') search = '') {
    return this.colorService.findAllWithoutPagination(search);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.colorService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateColorDto,
  ) {
    return this.colorService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.colorService.remove(+id);
  }
}
