"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingController = void 0;
const common_1 = require("@nestjs/common");
const rating_service_1 = require("./rating.service");
const create_rating_dto_1 = require("./dto/create-rating.dto");
const update_rating_dto_1 = require("./dto/update-rating.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth/jwt-auth.guard");
const user_enums_1 = require("../users/enums/user.enums");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles/roles.guard");
const user_response_dto_1 = require("../users/dto/user-response.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let RatingController = class RatingController {
    ratingService;
    constructor(ratingService) {
        this.ratingService = ratingService;
    }
    async create(dto, user) {
        return this.ratingService.create(dto, user.id);
    }
    async update(id, dto, user) {
        return this.ratingService.update(Number(id), dto, user.id);
    }
    async remove(id, user) {
        return this.ratingService.remove(Number(id), user.id);
    }
    async findAll(productId, search, page = 1, limit = 10) {
        return this.ratingService.findAll({
            productId: productId ? Number(productId) : undefined,
            search,
            page: Number(page),
            limit: Number(limit),
        });
    }
    async findOne(id) {
        const rating = await this.ratingService.findOne(Number(id));
        if (!rating)
            throw new common_1.NotFoundException('Rating not found');
        return rating;
    }
};
exports.RatingController = RatingController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_rating_dto_1.CreateRatingDto, user_response_dto_1.UserResponseDto]),
    __metadata("design:returntype", Promise)
], RatingController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_rating_dto_1.UpdateRatingDto,
        user_response_dto_1.UserResponseDto]),
    __metadata("design:returntype", Promise)
], RatingController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRole.ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_response_dto_1.UserResponseDto]),
    __metadata("design:returntype", Promise)
], RatingController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('productId')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], RatingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RatingController.prototype, "findOne", null);
exports.RatingController = RatingController = __decorate([
    (0, common_1.Controller)('ratings'),
    __metadata("design:paramtypes", [rating_service_1.RatingService])
], RatingController);
//# sourceMappingURL=rating.controller.js.map