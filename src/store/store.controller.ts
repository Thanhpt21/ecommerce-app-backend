import {
  Controller, Get, Post, Body, Param, Put, Delete,
  UploadedFile, UseInterceptors, UseGuards, Query
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user.enums';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() dto: CreateStoreDto, @UploadedFile() file: Express.Multer.File) {
    return this.storeService.create(dto, file);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = ''
  ) {
    return this.storeService.findAll(+page, +limit, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  update(@Param('id') id: string, @Body() dto: UpdateStoreDto, @UploadedFile() file: Express.Multer.File) {
    return this.storeService.update(+id, dto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.storeService.remove(+id);
  }
}
