import { ContentItemDto } from './content-item.dto';
export declare class CreateBlogDto {
    title: string;
    slug: string;
    description: string;
    thumb?: string;
    content: ContentItemDto[];
    categoryId: number;
    isPublished?: boolean;
}
