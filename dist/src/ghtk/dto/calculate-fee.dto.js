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
exports.CreateOrderGHTKDto = exports.CalculateFeeDto = exports.GHTKTransportOption = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var GHTKTransportOption;
(function (GHTKTransportOption) {
    GHTKTransportOption["ROAD"] = "road";
    GHTKTransportOption["FLY"] = "fly";
})(GHTKTransportOption || (exports.GHTKTransportOption = GHTKTransportOption = {}));
class CalculateFeeDto {
    pick_province;
    pick_district;
    pick_ward;
    pick_address;
    province;
    district;
    ward;
    address;
    weight;
    value;
    deliver_option;
    transport;
}
exports.CalculateFeeDto = CalculateFeeDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Tỉnh/Thành phố gửi không được để trống.' }),
    (0, class_validator_1.IsString)({ message: 'Tỉnh/Thành phố gửi phải là chuỗi.' }),
    __metadata("design:type", String)
], CalculateFeeDto.prototype, "pick_province", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Quận/Huyện gửi không được để trống.' }),
    (0, class_validator_1.IsString)({ message: 'Quận/Huyện gửi phải là chuỗi.' }),
    __metadata("design:type", String)
], CalculateFeeDto.prototype, "pick_district", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CalculateFeeDto.prototype, "pick_ward", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CalculateFeeDto.prototype, "pick_address", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Tỉnh/Thành phố nhận không được để trống.' }),
    (0, class_validator_1.IsString)({ message: 'Tỉnh/Thành phố nhận phải là chuỗi.' }),
    __metadata("design:type", String)
], CalculateFeeDto.prototype, "province", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Quận/Huyện nhận không được để trống.' }),
    (0, class_validator_1.IsString)({ message: 'Quận/Huyện nhận phải là chuỗi.' }),
    __metadata("design:type", String)
], CalculateFeeDto.prototype, "district", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Phường/Xã nhận phải là chuỗi.' }),
    __metadata("design:type", String)
], CalculateFeeDto.prototype, "ward", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Địa chỉ cụ thể nhận phải là chuỗi.' }),
    __metadata("design:type", String)
], CalculateFeeDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Trọng lượng không được để trống.' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Trọng lượng phải là số.' }),
    (0, class_validator_1.Min)(0.1, { message: 'Trọng lượng phải lớn hơn 0.' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CalculateFeeDto.prototype, "weight", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Giá trị đơn hàng phải là số.' }),
    (0, class_validator_1.Min)(0, { message: 'Giá trị đơn hàng không được âm.' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CalculateFeeDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CalculateFeeDto.prototype, "deliver_option", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(GHTKTransportOption),
    __metadata("design:type", String)
], CalculateFeeDto.prototype, "transport", void 0);
class CreateOrderGHTKDto {
    pick_province;
    pick_district;
    pick_ward;
    pick_address;
    pick_tel;
    pick_name;
    province;
    district;
    ward;
    address;
    tel;
    name;
    note;
    value;
    transport_fee;
    is_freeship;
    pick_money;
    products;
}
exports.CreateOrderGHTKDto = CreateOrderGHTKDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "pick_province", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "pick_district", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "pick_ward", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "pick_address", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "pick_tel", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "pick_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "province", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "district", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "ward", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "tel", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "note", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOrderGHTKDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOrderGHTKDto.prototype, "transport_fee", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOrderGHTKDto.prototype, "is_freeship", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOrderGHTKDto.prototype, "pick_money", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Array),
    __metadata("design:type", Array)
], CreateOrderGHTKDto.prototype, "products", void 0);
//# sourceMappingURL=calculate-fee.dto.js.map