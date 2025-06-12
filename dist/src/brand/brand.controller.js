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
exports.BrandController = void 0;
const common_1 = require("@nestjs/common");
const brand_service_1 = require("./brand.service");
const create_brand_dto_1 = require("./dto/create-brand.dto");
const update_brand_dto_1 = require("./dto/update-brand.dto");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_enums_1 = require("../users/enums/user.enums");
let BrandController = class BrandController {
    brandService;
    constructor(brandService) {
        this.brandService = brandService;
    }
    create(dto, file) {
        return this.brandService.create(dto, file);
    }
    async getBrands(page = 1, limit = 10, search = '') {
        return await this.brandService.findAll(+page, +limit, search);
    }
    async getAllBrandsWithoutPagination(search = '') {
        return this.brandService.findAllWithoutPagination(search);
    }
    findOne(id) {
        return this.brandService.findOne(+id);
    }
    update(id, dto, file) {
        return this.brandService.update(+id, dto, file);
    }
    remove(id) {
        return this.brandService.remove(+id);
    }
};
exports.BrandController = BrandController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRole.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_brand_dto_1.CreateBrandDto, Object]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "getBrands", null);
__decorate([
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "getAllBrandsWithoutPagination", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRole.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_brand_dto_1.UpdateBrandDto, Object]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "remove", null);
exports.BrandController = BrandController = __decorate([
    (0, common_1.Controller)('brands'),
    __metadata("design:paramtypes", [brand_service_1.BrandService])
], BrandController);
//# sourceMappingURL=brand.controller.js.map