-- CreateTable
CREATE TABLE "Shipping" (
    "id" SERIAL NOT NULL,
    "provinceName" TEXT NOT NULL,
    "fee" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shipping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shipping_provinceName_key" ON "Shipping"("provinceName");
