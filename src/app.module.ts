import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { CategoryModule } from './category/category.module';
import { BlogCategoryModule } from './blog-category/blog-category.module';
import { BrandModule } from './brand/brand.module';
import { SizeModule } from './size/size.module';
import { ColorModule } from './color/color.module';
import { CouponModule } from './coupon/coupon.module';
import { ShippingModule } from './shipping/shipping.module';
import { ConfigsModule } from './config/config.module';
import { StoreModule } from './store/store.module';
import { ProductModule } from './product/product.module';
import { VariantModule } from './variant/variant.module';
import { RatingModule } from './rating/rating.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { BlogModule } from './blog/blog.module';
import { ShippingAddressModule } from './shipping-address/shipping-address.module';
import { OrderModule } from './order/order.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Đảm bảo biến môi trường có thể sử dụng toàn bộ ứng dụng
    }),
    PrismaModule, 
    UsersModule, 
    AuthModule, 
    UploadModule, 
    CategoryModule, 
    BlogCategoryModule,
    BrandModule,
    SizeModule,
    ColorModule,
    CouponModule,
    ShippingModule,
    ConfigModule,
    ConfigsModule,
    StoreModule,
    ProductModule,
    VariantModule,
    RatingModule,
    BlogModule,
    ShippingAddressModule,
    OrderModule,
    ContactModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtStrategy],
})
export class AppModule {}

