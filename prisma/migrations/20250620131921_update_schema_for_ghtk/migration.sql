/*
  Warnings:

  - You are about to drop the column `district` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `isPickup` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `ward` on the `ShippingAddress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShippingAddress" DROP COLUMN "district",
DROP COLUMN "isPickup",
DROP COLUMN "province",
DROP COLUMN "ward",
ADD COLUMN     "districtId" INTEGER,
ADD COLUMN     "districtName" TEXT,
ADD COLUMN     "provinceId" INTEGER,
ADD COLUMN     "provinceName" TEXT,
ADD COLUMN     "wardId" INTEGER,
ADD COLUMN     "wardName" TEXT;
