import { Module } from '@nestjs/common';
import { GhtkService } from './ghtk.service';
import { GhtkController } from './ghtk.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Thêm PrismaModule vào đây để GhtkService có thể sử dụng PrismaService
  controllers: [GhtkController],
  providers: [GhtkService],
  exports: [GhtkService], // Export GhtkService nếu các module khác cần inject nó
})
export class GhtkModule {}