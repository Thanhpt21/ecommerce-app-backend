import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogCategoryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  image?: string;
}
