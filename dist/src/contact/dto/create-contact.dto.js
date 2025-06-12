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
exports.CreateContactDto = void 0;
const class_validator_1 = require("class-validator");
const contact_enums_1 = require("../enums/contact.enums");
class CreateContactDto {
    name;
    email;
    mobile;
    comment;
    status;
    type;
}
exports.CreateContactDto = CreateContactDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Tên phải là chuỗi.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tên không được để trống.' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Tên không được vượt quá 255 ký tự.' }),
    __metadata("design:type", String)
], CreateContactDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Email không hợp lệ.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email không được để trống.' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Email không được vượt quá 255 ký tự.' }),
    __metadata("design:type", String)
], CreateContactDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Số điện thoại phải là chuỗi.' }),
    (0, class_validator_1.MaxLength)(20, { message: 'Số điện thoại không được vượt quá 20 ký tự.' }),
    __metadata("design:type", String)
], CreateContactDto.prototype, "mobile", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Nội dung bình luận phải là chuỗi.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nội dung bình luận không được để trống.' }),
    __metadata("design:type", String)
], CreateContactDto.prototype, "comment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Trạng thái phải là chuỗi.' }),
    __metadata("design:type", String)
], CreateContactDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contact_enums_1.ContactType, { message: 'Loại liên hệ không hợp lệ.' }),
    __metadata("design:type", String)
], CreateContactDto.prototype, "type", void 0);
//# sourceMappingURL=create-contact.dto.js.map