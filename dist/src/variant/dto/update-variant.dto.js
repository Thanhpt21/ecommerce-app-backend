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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVariantDto = exports.VariantSizeUpdateItemDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class VariantSizeUpdateItemDto {
    sizeId;
    quantity;
}
exports.VariantSizeUpdateItemDto = VariantSizeUpdateItemDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], VariantSizeUpdateItemDto.prototype, "sizeId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], VariantSizeUpdateItemDto.prototype, "quantity", void 0);
class UpdateVariantDto {
    title;
    price;
    discount;
    thumb;
    images;
    colorId;
    variantSizes;
}
exports.UpdateVariantDto = UpdateVariantDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVariantDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateVariantDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateVariantDto.prototype, "discount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVariantDto.prototype, "thumb", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateVariantDto.prototype, "images", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateVariantDto.prototype, "colorId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'variantSizes phải là một mảng.' }),
    (0, class_validator_1.ValidateNested)({ each: true, message: 'Mỗi phần tử trong variantSizes phải là một đối tượng hợp lệ.' }),
    (0, class_transformer_1.Type)(() => VariantSizeUpdateItemDto),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string' && value.length > 0) {
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    return parsed.map(item => (0, class_transformer_1.plainToInstance)(VariantSizeUpdateItemDto, item));
                }
                return value;
            }
            catch (e) {
                console.error('Lỗi khi parse chuỗi variantSizes JSON:', e);
                return value;
            }
        }
        if (Array.isArray(value)) {
            return value.map(item => (0, class_transformer_1.plainToInstance)(VariantSizeUpdateItemDto, item));
        }
        return value;
    }),
    __metadata("design:type", Array)
], UpdateVariantDto.prototype, "variantSizes", void 0);
//# sourceMappingURL=update-variant.dto.js.map