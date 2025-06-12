# -----------------------------------------------------------
# Giai đoạn Build (builder stage) - Tạo bản build sản phẩm
# -----------------------------------------------------------
FROM node:22-alpine AS builder

# Đặt thư mục làm việc bên trong container
WORKDIR /app

# Copy các file cấu hình dependency (package.json và lock file)
COPY package.json package-lock.json ./

# Copy thư mục Prisma (chứa schema.prisma)
COPY prisma ./prisma

# Cài đặt tất cả các dependencies (bao gồm dev dependencies)
RUN npm install

# Copy toàn bộ mã nguồn của dự án NestJS (trừ những gì đã bị .dockerignore loại bỏ)
COPY src ./src
COPY nest-cli.json .
COPY tsconfig.json .


# Biên dịch ứng dụng NestJS từ TypeScript sang JavaScript
RUN npm run build


# -----------------------------------------------------------
# Giai đoạn Production (runner stage) - Tạo image nhẹ để chạy ứng dụng
# -----------------------------------------------------------
FROM node:22-alpine AS runner

# Đặt thư mục làm việc bên trong container
WORKDIR /app

# Tạo thư mục `dist` nếu nó chưa tồn tại (để chứa các file đã build)
RUN mkdir -p dist

# Copy chỉ các file package.json và package-lock.json cần thiết cho runtime (chỉ production deps)
COPY --from=builder /app/package.json /app/package-lock.json ./

# Copy thư mục `prisma` cũng sang giai đoạn runner
COPY --from=builder /app/prisma ./prisma

# Cài đặt chỉ các production dependencies (không cài dev dependencies)
RUN npm install --omit=dev

# Copy thư mục 'dist' (chứa code JS đã biên dịch) từ giai đoạn 'builder'
COPY --from=builder /app/dist ./dist

# Mở cổng mà ứng dụng NestJS của bạn sẽ lắng nghe
EXPOSE 4000

# Lệnh để chạy ứng dụng NestJS khi container khởi động
# ✅ CẬP NHẬT ĐƯỜNG DẪN TẠI ĐÂY
CMD ["node", "dist/src/main"]