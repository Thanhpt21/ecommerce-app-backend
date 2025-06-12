import { Module } from '@nestjs/common';
import { SizeService } from './size.service';
import { SizeController } from './size.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [SizeService, PrismaService],
  controllers: [SizeController],
})
export class SizeModule {}
