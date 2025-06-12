// dto/create-blog.dto.ts
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsJSON, ValidateNested } from 'class-validator';
import { ContentItemDto } from './content-item.dto';
import { Type } from 'class-transformer';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  thumb?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentItemDto)
  content: ContentItemDto[];

  @IsInt()
  categoryId: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
