import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { UploadModule } from 'src/upload/upload.module';
import { PrismaModule } from 'prisma/prisma.module';
import { AdminPreviewMiddleware } from 'src/common/middlewares/admin-preview.middleware';

@Module({
  imports: [UploadModule, PrismaModule],
  controllers: [BlogController],
  providers: [BlogService]
})
export class BlogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminPreviewMiddleware)
      .forRoutes('blogs/:slug'); // hoặc bất kỳ route nào cần
  }
}
