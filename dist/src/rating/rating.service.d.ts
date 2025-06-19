import { PrismaService } from 'prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
export declare class RatingService {
    private prisma;
    constructor(prisma: PrismaService);
    private updateProductRatingCount;
    create(dto: CreateRatingDto, userId: number): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            productId: number;
            star: number;
            comment: string;
            postedById: number;
        };
    }>;
    update(ratingId: number, dto: UpdateRatingDto, userId: number): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            productId: number;
            star: number;
            comment: string;
            postedById: number;
        };
    }>;
    findAll(params: {
        productId?: number;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        success: boolean;
        message: string;
        data: ({
            postedBy: {
                name: string;
                email: string;
                profilePicture: string | null;
                id: number;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            productId: number;
            star: number;
            comment: string;
            postedById: number;
        })[];
        total: number;
        page: number;
        pageCount: number;
    }>;
    findOne(id: number): Promise<({
        postedBy: {
            name: string;
            email: string;
            profilePicture: string | null;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        productId: number;
        star: number;
        comment: string;
        postedById: number;
    }) | null>;
    remove(id: number, userId: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
