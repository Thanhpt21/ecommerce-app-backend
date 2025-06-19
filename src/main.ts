import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express'; // ✅ Import đúng interface
import { join } from 'path'; // ✅ Import join từ path
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // ✅ Dùng generic type

  const configService = app.get(ConfigService);
   const port = configService.get<number>('PORT', 4000);

    app.enableCors({
    origin: configService.get('FRONTEND_URL'), // Đặt đúng domain FE
    credentials: true, // Cho phép gửi cookie
  });

   app.useGlobalPipes(new ValidationPipe({
    transform: true, // ⭐ BẬT TÍNH NĂNG TỰ ĐỘNG CHUYỂN ĐỔI KIỂU DỮ LIỆU ⭐
    whitelist: true, // Loại bỏ các trường không định nghĩa trong DTO
    forbidNonWhitelisted: true, // Ném lỗi nếu có trường không được phép
    transformOptions: {
      enableImplicitConversion: true, // Tùy chọn, có thể giúp trong một số trường hợp
    },
  }));

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Truy cập ảnh qua: http://localhost:3000/uploads/...
  });

 app.use(cookieParser()); // 👈 cần có

  await app.listen(port);
}
bootstrap();
