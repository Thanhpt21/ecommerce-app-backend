import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user.enums';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumb', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  create(
    @Body() dto: CreateProductDto,
    @UploadedFiles()
    files: {
      thumb?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    return this.productService.create(dto, files);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumb', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFiles()
    files: {
      thumb?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    return this.productService.update(+id, dto, files);
  }

@Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
    @Query('categoryId') categoryId?: string,
    @Query('brandId') brandId?: string, // Thêm brandId query
    @Query('colorId') colorId?: string, // Thêm colorId query
     @Query('sortBy') sortBy?: string,
      @Query('price_gte') price_gte?: string, // Thêm price_gte query
    @Query('price_lte') price_lte?: string, // Thêm price_lte query
  ) {
    const parsedCategoryId = categoryId ? parseInt(categoryId, 10) : undefined;
    const parsedBrandId = brandId ? parseInt(brandId, 10) : undefined;
    const parsedColorId = colorId ? parseInt(colorId, 10) : undefined;
    const parsedPriceGte = price_gte ? parseInt(price_gte, 10) : undefined;
    const parsedPriceLte = price_lte ? parseInt(price_lte, 10) : undefined;
    return this.productService.findAll(
      +page,
      +limit,
      search,
      parsedCategoryId,
      parsedBrandId,
      parsedColorId,
      sortBy,
      parsedPriceGte, 
      parsedPriceLte, 
    );
  }

  @Get('all') // Endpoint mới
  async getAllProductsWithoutPagination(@Query('search') search = '') {
    return this.productService.findAllWithoutPagination(search);
  }

   @Get('id/:id') // Đổi đường dẫn thành 'id/:id' để tránh xung đột với :slug
  @UseGuards(JwtAuthGuard, RolesGuard) // Thêm guards nếu đây là endpoint admin
  @Roles(UserRole.ADMIN) // Thêm roles nếu cần
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Get(':slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  @Get(':id/sizes')
  async getProductSizes(@Param('id') id: string) {
    return this.productService.getSizesByProductId(+id);
  }

  @Get('category/:categorySlug')
  async getProductsByCategorySlug(
    @Param('categorySlug') categorySlug: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
    @Query('sortBy') sortBy: string = 'createdAt_desc',
    @Query('brandId') brandId?: string, // Thêm brandId
    @Query('colorId') colorId?: string, // Thêm colorId
  ) {
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    const parsedBrandId = brandId ? parseInt(brandId, 10) : undefined;   // Chuyển đổi sang số
    const parsedColorId = colorId ? parseInt(colorId, 10) : undefined;   // Chuyển đổi sang số


    return this.productService.findProductsByCategorySlug(
      categorySlug,
      parsedPage,
      parsedLimit,
      search,
      sortBy,
      parsedBrandId,
      parsedColorId
    );
  }

}
