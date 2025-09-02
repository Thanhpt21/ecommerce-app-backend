/*
  Warnings:

  - You are about to drop the column `districtId` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `provinceId` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `wardId` on the `ShippingAddress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShippingAddress" DROP COLUMN "districtId",
DROP COLUMN "provinceId",
DROP COLUMN "wardId";
