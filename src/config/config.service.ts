import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { omitBy, isUndefined } from 'lodash';
import { UploadService } from 'src/upload/upload.service';
import { extractPublicId } from 'src/utils/file.util';

@Injectable()
export class ConfigService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService
  ) {}


  async create(dto: CreateConfigDto, file?: Express.Multer.File) {
    const existing = await this.prisma.config.findFirst();
    if (existing) throw new BadRequestException('Config already exists');

    let logo = dto.logo;

    if (file) {
      const { secure_url } = await this.uploadService.uploadImage(file, 0, 'config');
      logo = secure_url;
    }

    const data = {
      ...dto,
      logo,
    };

    const config = await this.prisma.config.create({ data });

    return {
      success: true,
      message: 'Config created successfully',
      data: config,
    };
  }

  async findOne(id: number) {
    const config = await this.prisma.config.findUnique({ where: { id } });
    if (!config) throw new NotFoundException('Config not found');

    return {
      success: true,
      message: 'Config found successfully',
      data: config,
    };
  }

  async update(id: number, dto: UpdateConfigDto, file?: Express.Multer.File) {
    const config = await this.prisma.config.findUnique({ where: { id } });
    if (!config) throw new NotFoundException('Config not found');

    const updateData: any = { ...dto };

    if (file) {
      const currentPublicId = extractPublicId(config.logo);
      if (currentPublicId) {
        await this.uploadService.deleteImage(currentPublicId);
      }

      const { secure_url } = await this.uploadService.uploadImage(file, id, 'config');
      updateData.logo = secure_url;
    }

    const updated = await this.prisma.config.update({
      where: { id },
      data: updateData,
    });

    return {
      success: true,
      message: 'Config updated successfully',
      data: updated,
    };
  }

}
