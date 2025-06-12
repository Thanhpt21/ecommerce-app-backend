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
  Req,
  Request,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user.enums';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('thumb'))
  async create(
    @Body() dto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any, // lấy user từ token
  ) {
    const userId = req.user.id;
    return this.blogService.create(dto,userId, file );
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
    @Query('categoryId') categoryId?: string, // THÊM DÒNG NÀY
  ) {
    const parsedCategoryId = categoryId ? parseInt(categoryId, 10) : undefined;
    return this.blogService.findAll(+page, +limit, search, parsedCategoryId); // TRUYỀN parsedCategoryId VÀO ĐÂY
  }


  @Get('all')
  async getAllBlogsWithoutPagination(@Query('search') search = '',   @Query('sortBy') sortBy?: string,) {
    return this.blogService.findAllWithoutPagination(search, sortBy);
    
  }

  @Get(':slug')
  async findBySlug(
    @Param('slug') slug: string,
    @Request() req,
    @Query('isPreview') isPreview?: string,
  ) {
    const previewMode = isPreview === 'true';
    const userId = req.user?.id;
    return this.blogService.findBySlug(slug, previewMode, userId);
  }


  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('thumb'))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.blogService.update(+id, dto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async likeBlog(@Param('id') id: string, @Req() req: any) {
    return this.blogService.likeBlog(+id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/dislike')
  async dislikeBlog(@Param('id') id: string, @Req() req: any) {
    return this.blogService.dislikeBlog(+id, req.user.id);
  }


}
