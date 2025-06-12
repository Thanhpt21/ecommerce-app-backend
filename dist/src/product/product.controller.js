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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("./product.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_enums_1 = require("../users/enums/user.enums");
let ProductController = class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    create(dto, files) {
        return this.productService.create(dto, files);
    }
    update(id, dto, files) {
        return this.productService.update(+id, dto, files);
    }
    findAll(page = 1, limit = 10, search = '', categoryId, brandId, colorId, sortBy, price_gte, price_lte) {
        const parsedCategoryId = categoryId ? parseInt(categoryId, 10) : undefined;
        const parsedBrandId = brandId ? parseInt(brandId, 10) : undefined;
        const parsedColorId = colorId ? parseInt(colorId, 10) : undefined;
        const parsedPriceGte = price_gte ? parseInt(price_gte, 10) : undefined;
        const parsedPriceLte = price_lte ? parseInt(price_lte, 10) : undefined;
        return this.productService.findAll(+page, +limit, search, parsedCategoryId, parsedBrandId, parsedColorId, sortBy, parsedPriceGte, parsedPriceLte);
    }
    async getAllProductsWithoutPagination(search = '') {
        return this.productService.findAllWithoutPagination(search);
    }
    findOne(id) {
        return this.productService.findOne(id);
    }
    findOneBySlug(slug) {
        return this.productService.findBySlug(slug);
    }
    remove(id) {
        return this.productService.remove(+id);
    }
    async getProductSizes(id) {
        return this.productService.getSizesByProductId(+id);
    }
    async getProductsByCategorySlug(categorySlug, page = '1', limit = '10', search = '', sortBy = 'createdAt_desc', brandId, colorId) {
        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);
        const parsedBrandId = brandId ? parseInt(brandId, 10) : undefined;
        const parsedColorId = colorId ? parseInt(colorId, 10) : undefined;
        return this.productService.findProductsByCategorySlug(categorySlug, parsedPage, parsedLimit, search, sortBy, parsedBrandId, parsedColorId);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRole.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'thumb', maxCount: 1 },
        { name: 'images', maxCount: 10 },
    ])),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRole.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'thumb', maxCount: 1 },
        { name: 'images', maxCount: 10 },
    ])),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('categoryId')),
    __param(4, (0, common_1.Query)('brandId')),
    __param(5, (0, common_1.Query)('colorId')),
    __param(6, (0, common_1.Query)('sortBy')),
    __param(7, (0, common_1.Query)('price_gte')),
    __param(8, (0, common_1.Query)('price_lte')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllProductsWithoutPagination", null);
__decorate([
    (0, common_1.Get)('id/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findOneBySlug", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/sizes'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductSizes", null);
__decorate([
    (0, common_1.Get)('category/:categorySlug'),
    __param(0, (0, common_1.Param)('categorySlug')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('sortBy')),
    __param(5, (0, common_1.Query)('brandId')),
    __param(6, (0, common_1.Query)('colorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductsByCategorySlug", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map