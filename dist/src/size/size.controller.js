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
exports.SizeController = void 0;
const common_1 = require("@nestjs/common");
const size_service_1 = require("./size.service");
const create_size_dto_1 = require("./dto/create-size.dto");
const update_size_dto_1 = require("./dto/update-size.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_enums_1 = require("../users/enums/user.enums");
let SizeController = class SizeController {
    sizeService;
    constructor(sizeService) {
        this.sizeService = sizeService;
    }
    create(dto) {
        return this.sizeService.create(dto);
    }
    getAll(page = 1, limit = 10, search = '') {
        return this.sizeService.findAll(+page, +limit, search);
    }
    async getAllSizesWithoutPagination(search = '') {
        return this.sizeService.findAllWithoutPagination(search);
    }
    getOne(id) {
        return this.sizeService.findOne(+id);
    }
    update(id, dto) {
        return this.sizeService.update(+id, dto);
    }
    remove(id) {
        return this.sizeService.remove(+id);
    }
};
exports.SizeController = SizeController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_size_dto_1.CreateSizeDto]),
    __metadata("design:returntype", void 0)
], SizeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], SizeController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SizeController.prototype, "getAllSizesWithoutPagination", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SizeController.prototype, "getOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_size_dto_1.UpdateSizeDto]),
    __metadata("design:returntype", void 0)
], SizeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SizeController.prototype, "remove", null);
exports.SizeController = SizeController = __decorate([
    (0, common_1.Controller)('sizes'),
    __metadata("design:paramtypes", [size_service_1.SizeService])
], SizeController);
//# sourceMappingURL=size.controller.js.map