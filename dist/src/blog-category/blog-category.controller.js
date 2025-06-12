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
exports.BlogCategoryController = void 0;
const common_1 = require("@nestjs/common");
const blog_category_service_1 = require("./blog-category.service");
const create_blog_category_dto_1 = require("./dto/create-blog-category.dto");
const update_blog_category_dto_1 = require("./dto/update-blog-category.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_enums_1 = require("../users/enums/user.enums");
const platform_express_1 = require("@nestjs/platform-express");
let BlogCategoryController = class BlogCategoryController {
    blogCategoryService;
    constructor(blogCategoryService) {
        this.blogCategoryService = blogCategoryService;
    }
    create(dto, file) {
        return this.blogCategoryService.create(dto, file);
    }
    async findAll(page = 1, limit = 10, search = '') {
        return this.blogCategoryService.findAll(+page, +limit, search);
    }
    async getAllBlogCategoriesWithoutPagination(search = '') {
        return this.blogCategoryService.findAllWithoutPagination(search);
    }
    findOne(id) {
        return this.blogCategoryService.findOne(+id);
    }
    update(id, dto, file) {
        return this.blogCategoryService.update(+id, dto, file);
    }
    remove(id) {
        return this.blogCategoryService.remove(+id);
    }
};
exports.BlogCategoryController = BlogCategoryController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRole.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blog_category_dto_1.CreateBlogCategoryDto, Object]),
    __metadata("design:returntype", void 0)
], BlogCategoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], BlogCategoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlogCategoryController.prototype, "getAllBlogCategoriesWithoutPagination", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogCategoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRole.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_blog_category_dto_1.UpdateBlogCategoryDto, Object]),
    __metadata("design:returntype", void 0)
], BlogCategoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogCategoryController.prototype, "remove", null);
exports.BlogCategoryController = BlogCategoryController = __decorate([
    (0, common_1.Controller)('blog-categories'),
    __metadata("design:paramtypes", [blog_category_service_1.BlogCategoryService])
], BlogCategoryController);
//# sourceMappingURL=blog-category.controller.js.map