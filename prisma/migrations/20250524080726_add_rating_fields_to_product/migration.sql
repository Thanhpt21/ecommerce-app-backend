/*
  Warnings:

  - You are about to drop the column `totalRatings` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "totalRatings",
ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "ratingCount" INTEGER NOT NULL DEFAULT 0;
