// src/contact/contact.module.ts

import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { PrismaService } from 'prisma/prisma.service'; // Đảm bảo đường dẫn này đúng

@Module({
  controllers: [ContactController],
  providers: [ContactService, PrismaService],
  exports: [ContactService], // Xuất ContactService nếu các module khác cần sử dụng nó
})
export class ContactModule {}