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
exports.VariantController = void 0;
const common_1 = require("@nestjs/common");
const variant_service_1 = require("./variant.service");
const create_variant_dto_1 = require("./dto/create-variant.dto");
const update_variant_dto_1 = require("./dto/update-variant.dto");
const platform_express_1 = require("@nestjs/platform-express");
let VariantController = class VariantController {
    variantService;
    constructor(variantService) {
        this.variantService = variantService;
    }
    create(dto, files) {
        return this.variantService.create(dto, files);
    }
    findAll(productId, page = 1, limit = 10, search = '') {
        return this.variantService.findAll(+productId, +page, +limit, search);
    }
    findOne(id) {
        return this.variantService.findOne(id);
    }
    update(id, dto, files) {
        return this.variantService.update(id, dto, files);
    }
    remove(id) {
        return this.variantService.remove(id);
    }
    async getVariantSizes(id) {
        return this.variantService.getSizesByVariantId(+id);
    }
};
exports.VariantController = VariantController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'thumb', maxCount: 1 },
        { name: 'images', maxCount: 10 },
    ])),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_variant_dto_1.CreateVariantDto, Object]),
    __metadata("design:returntype", void 0)
], VariantController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('productId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], VariantController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VariantController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'thumb', maxCount: 1 },
        { name: 'images', maxCount: 10 },
    ])),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_variant_dto_1.UpdateVariantDto, Object]),
    __metadata("design:returntype", void 0)
], VariantController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VariantController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/sizes'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VariantController.prototype, "getVariantSizes", null);
exports.VariantController = VariantController = __decorate([
    (0, common_1.Controller)('variants'),
    __metadata("design:paramtypes", [variant_service_1.VariantService])
], VariantController);
//# sourceMappingURL=variant.controller.js.map