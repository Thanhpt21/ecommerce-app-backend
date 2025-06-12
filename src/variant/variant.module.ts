import { Module } from '@nestjs/common';
import { VariantController } from './variant.controller';
import { VariantService } from './variant.service';
import { PrismaModule } from 'prisma/prisma.module';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [VariantController],
  providers: [VariantService]
})
export class VariantModule {}
