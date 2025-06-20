"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GhtkModule = void 0;
const common_1 = require("@nestjs/common");
const ghtk_service_1 = require("./ghtk.service");
const ghtk_controller_1 = require("./ghtk.controller");
const prisma_module_1 = require("../../prisma/prisma.module");
let GhtkModule = class GhtkModule {
};
exports.GhtkModule = GhtkModule;
exports.GhtkModule = GhtkModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [ghtk_controller_1.GhtkController],
        providers: [ghtk_service_1.GhtkService],
        exports: [ghtk_service_1.GhtkService],
    })
], GhtkModule);
//# sourceMappingURL=ghtk.module.js.map