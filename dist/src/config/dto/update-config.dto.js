"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateConfigDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_config_dto_1 = require("./create-config.dto");
class UpdateConfigDto extends (0, mapped_types_1.PartialType)(create_config_dto_1.CreateConfigDto) {
}
exports.UpdateConfigDto = UpdateConfigDto;
//# sourceMappingURL=update-config.dto.js.map