import {
  Controller, Get, Post, Body, Param, Delete, Put, Query,
  UploadedFile, UseInterceptors, UseGuards
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user.enums';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() dto: CreateBrandDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.brandService.create(dto, file);
  }

  @Get()
  async getBrands(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
  ) {
    return await this.brandService.findAll(+page, +limit, search);
  }

  @Get('all')
  async getAllBrandsWithoutPagination(@Query('search') search = '') {
    return this.brandService.findAllWithoutPagination(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBrandDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.brandService.update(+id, dto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
