import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { PrismaService } from 'prisma/prisma.service';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [UploadModule],
  providers: [BrandService, PrismaService],
  controllers: [BrandController],
})
export class BrandModule {}
