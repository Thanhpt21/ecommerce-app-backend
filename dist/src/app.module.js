"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("../prisma/prisma.module");
const users_module_1 = require("./users/users.module");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const upload_module_1 = require("./upload/upload.module");
const category_module_1 = require("./category/category.module");
const blog_category_module_1 = require("./blog-category/blog-category.module");
const brand_module_1 = require("./brand/brand.module");
const size_module_1 = require("./size/size.module");
const color_module_1 = require("./color/color.module");
const coupon_module_1 = require("./coupon/coupon.module");
const shipping_module_1 = require("./shipping/shipping.module");
const config_module_1 = require("./config/config.module");
const store_module_1 = require("./store/store.module");
const product_module_1 = require("./product/product.module");
const variant_module_1 = require("./variant/variant.module");
const rating_module_1 = require("./rating/rating.module");
const jwt_strategy_1 = require("./auth/jwt.strategy");
const blog_module_1 = require("./blog/blog.module");
const shipping_address_module_1 = require("./shipping-address/shipping-address.module");
const order_module_1 = require("./order/order.module");
const contact_module_1 = require("./contact/contact.module");
const ghtk_module_1 = require("./ghtk/ghtk.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            upload_module_1.UploadModule,
            category_module_1.CategoryModule,
            blog_category_module_1.BlogCategoryModule,
            brand_module_1.BrandModule,
            size_module_1.SizeModule,
            color_module_1.ColorModule,
            coupon_module_1.CouponModule,
            shipping_module_1.ShippingModule,
            config_1.ConfigModule,
            config_module_1.ConfigsModule,
            store_module_1.StoreModule,
            product_module_1.ProductModule,
            variant_module_1.VariantModule,
            rating_module_1.RatingModule,
            blog_module_1.BlogModule,
            shipping_address_module_1.ShippingAddressModule,
            order_module_1.OrderModule,
            contact_module_1.ContactModule,
            ghtk_module_1.GhtkModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, prisma_service_1.PrismaService, jwt_strategy_1.JwtStrategy],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map