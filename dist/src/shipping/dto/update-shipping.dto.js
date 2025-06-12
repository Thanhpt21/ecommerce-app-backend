"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateShippingDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_shipping_dto_1 = require("./create-shipping.dto");
class UpdateShippingDto extends (0, mapped_types_1.PartialType)(create_shipping_dto_1.CreateShippingDto) {
}
exports.UpdateShippingDto = UpdateShippingDto;
//# sourceMappingURL=update-shipping.dto.js.map