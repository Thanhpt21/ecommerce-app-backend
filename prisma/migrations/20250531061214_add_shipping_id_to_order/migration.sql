-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingId" INTEGER;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingId_fkey" FOREIGN KEY ("shippingId") REFERENCES "Shipping"("id") ON DELETE SET NULL ON UPDATE CASCADE;
