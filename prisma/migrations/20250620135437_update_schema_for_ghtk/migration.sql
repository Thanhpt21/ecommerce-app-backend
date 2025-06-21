/*
  Warnings:

  - You are about to drop the column `districtName` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `provinceName` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `wardName` on the `ShippingAddress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShippingAddress" DROP COLUMN "districtName",
DROP COLUMN "provinceName",
DROP COLUMN "wardName",
ADD COLUMN     "district" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "ward" TEXT;
