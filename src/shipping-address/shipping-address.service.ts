import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ShippingAddressService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateShippingAddressDto) {
    if (dto.isDefault) {
      // Unset old default
      await this.prisma.shippingAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await this.prisma.shippingAddress.create({
      data: {
        ...dto,
        userId,
      },
    });

    return {
      success: true,
      message: 'Shipping address created successfully',
      data: address,
    };
  }

  async findAll(userId: number) {
    const addresses = await this.prisma.shippingAddress.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });

    return {
      success: true,
      message: 'Shipping addresses fetched successfully',
      data: addresses,
    };
  }
  

  async findByUserId(userId: number) {
    const addresses = await this.prisma.shippingAddress.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });

    return {
      success: true,
      message: `Shipping addresses for user ${userId} fetched successfully`,
      data: addresses,
    };
  }

  async update(id: number, userId: number, dto: UpdateShippingAddressDto) {
    const existing = await this.prisma.shippingAddress.findFirst({
        where: { id, userId },
    });
    if (!existing) throw new NotFoundException('Address not found');

    // Nếu cập nhật isDefault thành true, reset các địa chỉ khác
    if (dto.isDefault === true) {
        await this.prisma.shippingAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
        });
    }

    const updated = await this.prisma.shippingAddress.update({
        where: { id },
        data: dto,
    });

    return {
        success: true,
        message: 'Address updated successfully',
        data: updated,
    };
}


  async remove(id: number, userId: number) {
    const existing = await this.prisma.shippingAddress.findUnique({ where: { id } });

    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('Address not found');
    }

    await this.prisma.shippingAddress.delete({ where: { id } });

    return {
      success: true,
      message: 'Shipping address deleted successfully',
    };
  }
}
