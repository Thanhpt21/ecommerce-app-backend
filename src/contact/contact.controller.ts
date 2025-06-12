// src/contact/contact.controller.ts

import {
  Controller, Get, Post, Body, Param, Delete, Put, Query,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user.enums'; // Đảm bảo đường dẫn này đúng

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  /**
   * Tạo một liên hệ mới (gửi form liên hệ).
   * Không yêu cầu xác thực để người dùng có thể gửi yêu cầu.
   */
  @Post()
  create(@Body() dto: CreateContactDto) {
    return this.contactService.create(dto);
  }

  /**
   * Lấy tất cả các liên hệ có phân trang.
   * Chỉ ADMIN mới có quyền truy cập.
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
  ) {
    return this.contactService.findAll(+page, +limit, search);
  }

  /**
   * Lấy tất cả các liên hệ không phân trang.
   * Chỉ ADMIN mới có quyền truy cập.
   */
  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllWithoutPagination(@Query('search') search = '') {
    return this.contactService.findAllWithoutPagination(search);
  }

  /**
   * Lấy một liên hệ theo ID.
   * Chỉ ADMIN mới có quyền truy cập.
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getOne(@Param('id') id: string) {
    return this.contactService.findOne(+id);
  }

  /**
   * Cập nhật một liên hệ theo ID.
   * Chỉ ADMIN mới có quyền truy cập.
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
  ) {
    return this.contactService.update(+id, dto);
  }

  /**
   * Xóa một liên hệ theo ID.
   * Chỉ ADMIN mới có quyền truy cập.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.contactService.remove(+id);
  }
}