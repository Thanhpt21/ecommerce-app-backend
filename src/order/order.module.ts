import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { GhtkService } from 'src/ghtk/ghtk.service';

@Module({
  imports: [PrismaModule],
  controllers: [OrderController],
  providers: [OrderService,  GhtkService],
})
export class OrderModule {}

