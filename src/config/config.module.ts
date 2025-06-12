import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import { PrismaService } from 'prisma/prisma.service';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [ConfigController],
  providers: [ConfigService, PrismaService],
})
export class ConfigsModule {}