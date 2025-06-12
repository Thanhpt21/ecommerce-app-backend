import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  Query,
  ParseIntPipe,
  UploadedFiles,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { VariantService } from './variant.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('variants')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumb', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  create(
    @Body() dto: CreateVariantDto,
    @UploadedFiles()
    files: { 
      thumb?: Express.Multer.File[]; 
      images?: Express.Multer.File[] 
    },
  ) {
    return this.variantService.create(dto, files);
  }

  @Get()
  findAll(
    @Query('productId') productId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
  ) {
    return this.variantService.findAll(+productId, +page, +limit, search);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.variantService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumb', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVariantDto,
    @UploadedFiles()
    files: { 
      thumb?: Express.Multer.File[]; 
      images?: Express.Multer.File[] 
    },
  ) {
    return this.variantService.update(id, dto, files);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.variantService.remove(id);
  }

   @Get(':id/sizes')
  async getVariantSizes(@Param('id') id: string) {
    return this.variantService.getSizesByVariantId(+id);
  }
  
}
