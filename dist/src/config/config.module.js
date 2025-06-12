"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigsModule = void 0;
const common_1 = require("@nestjs/common");
const config_controller_1 = require("./config.controller");
const config_service_1 = require("./config.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const upload_module_1 = require("../upload/upload.module");
let ConfigsModule = class ConfigsModule {
};
exports.ConfigsModule = ConfigsModule;
exports.ConfigsModule = ConfigsModule = __decorate([
    (0, common_1.Module)({
        imports: [upload_module_1.UploadModule],
        controllers: [config_controller_1.ConfigController],
        providers: [config_service_1.ConfigService, prisma_service_1.PrismaService],
    })
], ConfigsModule);
//# sourceMappingURL=config.module.js.map