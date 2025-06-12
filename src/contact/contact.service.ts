// src/contact/contact.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service'; // Đảm bảo đường dẫn này đúng
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Prisma } from '@prisma/client'; // Import Prisma namespace

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  /**
   * Tạo một bản ghi liên hệ mới từ dữ liệu DTO.
   */
  async create(dto: CreateContactDto) {
    const contact = await this.prisma.contact.create({
      data: {
        name: dto.name,
        email: dto.email,
        mobile: dto.mobile,
        comment: dto.comment,
        // status và type có giá trị mặc định trong Prisma schema,
        // nhưng nếu được cung cấp trong DTO thì sẽ sử dụng giá trị đó.
        status: dto.status,
        type: dto.type,
      },
    });

    return {
      success: true,
      message: 'Contact created successfully',
      data: contact,
    };
  }

  /**
   * Lấy tất cả các liên hệ có phân trang và tùy chọn tìm kiếm.
   * Tìm kiếm dựa trên 'name', 'email', 'comment' (không phân biệt chữ hoa/thường).
   */
  async findAll(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;
    const where: Prisma.ContactWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { comment: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    const [contacts, total] = await this.prisma.$transaction([
      this.prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contact.count({ where }),
    ]);

    return {
      success: true,
      message: total > 0 ? 'Contacts found successfully' : 'No contacts found',
      data: contacts,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

  /**
   * Lấy tất cả các liên hệ không phân trang, có tùy chọn tìm kiếm.
   * Tìm kiếm dựa trên 'name', 'email', 'comment' (không phân biệt chữ hoa/thường).
   */
  async findAllWithoutPagination(search = '') {
    const where: Prisma.ContactWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { comment: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    const contacts = await this.prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message: contacts.length > 0 ? 'Contacts found successfully' : 'No contacts found',
      data: contacts,
      total: contacts.length,
    };
  }

  /**
   * Tìm một liên hệ duy nhất theo ID.
   * @throws {NotFoundException} Nếu không tìm thấy liên hệ.
   */
  async findOne(id: number) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return {
      success: true,
      message: 'Contact found successfully',
      data: contact,
    };
  }

  /**
   * Cập nhật một liên hệ theo ID.
   * @throws {NotFoundException} Nếu không tìm thấy liên hệ.
   */
  async update(id: number, dto: UpdateContactDto) {
    const existingContact = await this.prisma.contact.findUnique({ where: { id } });
    if (!existingContact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    const updatedContact = await this.prisma.contact.update({
      where: { id },
      data: dto, // DTO PartialType sẽ chỉ cập nhật các trường được cung cấp
    });

    return {
      success: true,
      message: 'Contact updated successfully',
      data: updatedContact,
    };
  }

  /**
   * Xóa một liên hệ theo ID.
   * @throws {NotFoundException} Nếu không tìm thấy liên hệ.
   */
  async remove(id: number) {
    const existingContact = await this.prisma.contact.findUnique({ where: { id } });
    if (!existingContact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    await this.prisma.contact.delete({ where: { id } });

    return {
      success: true,
      message: 'Contact removed successfully',
    };
  }
}