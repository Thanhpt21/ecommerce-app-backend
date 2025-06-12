import { Controller, Post, Body, UseGuards, Req, Put, Param, Get, NotFoundException, Query, Delete } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Request } from 'express';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { UserRole } from 'src/users/enums/user.enums';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateRatingDto,@CurrentUser() user: UserResponseDto) {
    return this.ratingService.create(dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
  @Param('id') id: string,
  @Body() dto: UpdateRatingDto,
 @CurrentUser() user: UserResponseDto,
  ) {
  return this.ratingService.update(Number(id), dto, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string,  @CurrentUser() user: UserResponseDto) {
    return this.ratingService.remove(Number(id), user.id);
  }

  @Get()
  async findAll(
    @Query('productId') productId?: string,
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.ratingService.findAll({
      productId: productId ? Number(productId) : undefined,
      search,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const rating = await this.ratingService.findOne(Number(id));
    if (!rating) throw new NotFoundException('Rating not found');
    return rating;
  }

  
}
