import {
  Controller, Post, Body, Get, Param, Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ConfigService } from './config.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user.enums';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('configs')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file')) 
  create(
    @Body() dto: CreateConfigDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.configService.create(dto, file);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.configService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  update(@Param('id') id: string, @Body() dto: UpdateConfigDto, @UploadedFile() file: Express.Multer.File,) {
    return this.configService.update(+id, dto, file);
  }
}
