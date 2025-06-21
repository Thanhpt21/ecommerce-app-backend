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
exports.CreateOrderGHTKDto = exports.GHTKProductItemDto = exports.CalculateFeeDto = exports.GHTKDeliverOption = exports.GHTKPickOption = exports.GHTKTransportOption = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var GHTKTransportOption;
(function (GHTKTransportOption) {
    GHTKTransportOption["ROAD"] = "road";
    GHTKTransportOption["FLY"] = "fly";
})(GHTKTransportOption || (exports.GHTKTransportOption = GHTKTransportOption = {}));
var GHTKPickOption;
(function (GHTKPickOption) {
    GHTKPickOption["COD"] = "cod";
    GHTKPickOption["POST"] = "post";
})(GHTKPickOption || (exports.GHTKPickOption = GHTKPickOption = {}));
var GHTKDeliverOption;
(function (GHTKDeliverOption) {
    GHTKDeliverOption["XTEAM"] = "xteam";
    GHTKDeliverOption["NONE"] = "none";
})(GHTKDeliverOption || (exports.GHTKDeliverOption = GHTKDeliverOption = {}));
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
class GHTKProductItemDto {
    name;
    weight;
    quantity;
    price;
    product_code;
}
exports.GHTKProductItemDto = GHTKProductItemDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Tên sản phẩm không được để trống.' }),
    (0, class_validator_1.IsString)({ message: 'Tên sản phẩm phải là chuỗi.' }),
    __metadata("design:type", String)
], GHTKProductItemDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Trọng lượng sản phẩm không được để trống.' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Trọng lượng sản phẩm phải là số.' }),
    (0, class_validator_1.Min)(0.01, { message: 'Trọng lượng sản phẩm tối thiểu là 0.01 kg.' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GHTKProductItemDto.prototype, "weight", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Số lượng sản phẩm phải là số.' }),
    (0, class_validator_1.Min)(1, { message: 'Số lượng sản phẩm tối thiểu là 1.' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GHTKProductItemDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Giá sản phẩm phải là số.' }),
    (0, class_validator_1.Min)(0, { message: 'Giá sản phẩm không được âm.' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GHTKProductItemDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Mã sản phẩm phải là chuỗi.' }),
    __metadata("design:type", String)
], GHTKProductItemDto.prototype, "product_code", void 0);
class CreateOrderGHTKDto {
    id;
    pick_name;
    pick_address;
    pick_province;
    pick_district;
    pick_ward;
    pick_street;
    pick_tel;
    pick_email;
    name;
    address;
    province;
    district;
    ward;
    street;
    hamlet;
    tel;
    email;
    note;
    value;
    pick_money;
    is_freeship;
    pick_option;
    transport;
    deliver_option;
    products;
}
exports.CreateOrderGHTKDto = CreateOrderGHTKDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Mã đơn hàng không được để trống.' }),
    (0, class_validator_1.IsString)({ message: 'Mã đơn hàng phải là chuỗi.' }),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Tên người gửi không được để trống.' }),
    (0, class_validator_1.IsString)({ message: 'Tên người gửi phải là chuỗi.' }),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "pick_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Địa chỉ lấy hàng không được để trống.' }),
    (0, class_validator_1.IsString)({ message: 'Địa chỉ lấy hàng phải là chuỗi.' }),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "pick_address", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Tỉnh/Thành phố lấy hàng không được để trống.' }),
    (0, class_validator_1.IsString)({ message: 'Tỉnh/Thành phố lấy hàng phải là chuỗi.' }),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "pick_province", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Quận/Huyện lấy hàng không được để trống.' }),
    (0, class_validator_1.IsString)({ message: 'Quận/Huyện lấy hàng phải là chuỗi.' }),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "pick_district", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "pick_ward", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "pick_street", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Số điện thoại người gửi không được để trống.' }),
    (0, class_validator_1.IsString)({ message: 'Số điện thoại người gửi phải là chuỗi.' }),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "pick_tel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "pick_email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Tên người nhận không được để trống.' }),
    (0, class_validator_1.IsString)({ message: 'Tên người nhận phải là chuỗi.' }),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Địa chỉ chi tiết người nhận không được để trống.' }),
    (0, class_validator_1.IsString)({ message: 'Địa chỉ chi tiết người nhận phải là chuỗi.' }),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Tỉnh/Thành phố người nhận không được để trống.' }),
    (0, class_validator_1.IsString)({ message: 'Tỉnh/Thành phố người nhận phải là chuỗi.' }),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "province", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Quận/Huyện người nhận không được để trống.' }),
    (0, class_validator_1.IsString)({ message: 'Quận/Huyện người nhận phải là chuỗi.' }),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "district", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Phường/Xã người nhận phải là chuỗi.' }),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "ward", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Tên đường/phố người nhận phải là chuỗi.' }),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "street", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Thông tin thôn/ấp/xóm không được để trống (điền "Khác" nếu không có).' }),
    (0, class_validator_1.IsString)({ message: 'Thông tin thôn/ấp/xóm phải là chuỗi.' }),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "hamlet", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Số điện thoại người nhận không được để trống.' }),
    (0, class_validator_1.IsString)({ message: 'Số điện thoại người nhận phải là chuỗi.' }),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "tel", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email người nhận không được để trống.' }),
    (0, class_validator_1.IsString)({ message: 'Email người nhận phải là chuỗi.' }),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "note", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Giá trị đóng khai giá không được để trống.' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Giá trị đóng khai giá phải là số.' }),
    (0, class_validator_1.Min)(0, { message: 'Giá trị đóng khai giá không được âm.' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOrderGHTKDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Số tiền thu hộ không được để trống.' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Số tiền thu hộ phải là số.' }),
    (0, class_validator_1.Min)(0, { message: 'Số tiền thu hộ không được âm.' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOrderGHTKDto.prototype, "pick_money", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Trạng thái freeship phải là số (0 hoặc 1).' }),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOrderGHTKDto.prototype, "is_freeship", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Tùy chọn lấy hàng không được để trống.' }),
    (0, class_validator_1.IsEnum)(GHTKPickOption, { message: 'Tùy chọn lấy hàng không hợp lệ (phải là "cod" hoặc "post").' }),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "pick_option", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(GHTKTransportOption, { message: 'Phương thức vận chuyển không hợp lệ.' }),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "transport", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(GHTKDeliverOption, { message: 'Tùy chọn giao hàng không hợp lệ.' }),
    __metadata("design:type", String)
], CreateOrderGHTKDto.prototype, "deliver_option", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Danh sách sản phẩm không được để trống.' }),
    (0, class_validator_1.IsArray)({ message: 'Sản phẩm phải là một mảng.' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => GHTKProductItemDto),
    __metadata("design:type", Array)
], CreateOrderGHTKDto.prototype, "products", void 0);
//# sourceMappingURL=calculate-fee.dto.js.map