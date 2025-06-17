import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
export declare class RatingController {
    private readonly ratingService;
    constructor(ratingService: RatingService);
    create(dto: CreateRatingDto, user: UserResponseDto): Promise<{
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
    update(id: string, dto: UpdateRatingDto, user: UserResponseDto): Promise<{
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
    remove(id: string, user: UserResponseDto): Promise<{
        success: boolean;
        message: string;
    }>;
    findAll(productId?: string, search?: string, page?: number, limit?: number): Promise<{
        success: boolean;
        message: string;
        data: ({
            postedBy: {
                id: number;
                name: string;
                email: string;
                profilePicture: string | null;
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
    findOne(id: string): Promise<{
        postedBy: {
            id: number;
            name: string;
            email: string;
            profilePicture: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        productId: number;
        star: number;
        comment: string;
        postedById: number;
    }>;
}
