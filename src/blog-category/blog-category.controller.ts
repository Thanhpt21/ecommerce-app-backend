import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BlogCategoryService } from './blog-category.service';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';  // JWT Guard
import { RolesGuard } from 'src/common/guards/roles/roles.guard';  // Roles Guard
import { Roles } from 'src/common/decorators/roles.decorator';  // Roles Decorator
import { UserRole } from 'src/users/enums/user.enums';  // UserRole Enum
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('blog-categories')
export class BlogCategoryController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}

  // Route tạo blog category, chỉ dành cho admin
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)  // Bảo vệ với JwtAuthGuard và RolesGuard
  @Roles(UserRole.ADMIN)  // Chỉ cho phép admin
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() dto: CreateBlogCategoryDto, 
    @UploadedFile() file: Express.Multer.File,) {
    return this.blogCategoryService.create(dto, file);
  }

  // Route lấy tất cả blog categories
  @Get()
  async findAll(
    @Query('page') page: number = 1,  // Trang hiện tại (mặc định là trang 1)
    @Query('limit') limit: number = 10,  // Số mục trên mỗi trang (mặc định là 10)
    @Query('search') search: string = '',  // Từ khóa tìm kiếm
  ) {
    return this.blogCategoryService.findAll(+page, +limit, search);  // Gọi service để lấy dữ liệu với phân trang và tìm kiếm
  }

  @Get('all')
  async getAllBlogCategoriesWithoutPagination(@Query('search') search = '') {
    return this.blogCategoryService.findAllWithoutPagination(search);
  }

  // Route lấy blog category theo id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogCategoryService.findOne(+id);
  }

  // Route cập nhật blog category, chỉ dành cho admin
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)  // Bảo vệ với JwtAuthGuard và RolesGuard
  @Roles(UserRole.ADMIN)  // Chỉ cho phép admin
  @UseInterceptors(FileInterceptor('file'))
  update(@Param('id') id: string, @Body() dto: UpdateBlogCategoryDto,  @UploadedFile() file: Express.Multer.File) {
    return this.blogCategoryService.update(+id, dto, file);
  }

  // Route xóa blog category, chỉ dành cho admin
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)  // Bảo vệ với JwtAuthGuard và RolesGuard
  @Roles(UserRole.ADMIN)  // Chỉ cho phép admin
  remove(@Param('id') id: string) {
    return this.blogCategoryService.remove(+id);
  }
}
