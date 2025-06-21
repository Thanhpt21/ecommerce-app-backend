-- AlterTable
ALTER TABLE "Config" ADD COLUMN     "pick_name" TEXT,
ADD COLUMN     "pick_tel" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "ghtkCodAmount" DECIMAL(65,30),
ADD COLUMN     "pickupAddressId" INTEGER;

-- AlterTable
ALTER TABLE "ShippingAddress" ADD COLUMN     "isPickup" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pickupAddressId_fkey" FOREIGN KEY ("pickupAddressId") REFERENCES "ShippingAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;
