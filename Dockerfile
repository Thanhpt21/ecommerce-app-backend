# backend/Dockerfile
FROM node:22 AS builder

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm install

# CHỈ GIỮ LẠI LỆNH `prisma generate` Ở ĐÂY
RUN npx prisma generate

COPY src ./src
COPY nest-cli.json .
COPY tsconfig.json .

RUN npm run build

# Giai đoạn Production (runner stage) - Không thay đổi
FROM node:22 AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

RUN mkdir -p dist
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/prisma ./prisma
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 4000
# Dòng CMD này sẽ được thay thế trong docker-compose.yml
# CMD ["node", "dist/src/main"]