import { Module } from '@nestjs/common';
import { BlogCategoryService } from './blog-category.service';
import { BlogCategoryController } from './blog-category.controller';
import { PrismaService } from 'prisma/prisma.service';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [BlogCategoryController],
  providers: [BlogCategoryService, PrismaService],
})
export class BlogCategoryModule {}
