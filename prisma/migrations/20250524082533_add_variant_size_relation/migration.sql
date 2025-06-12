-- CreateTable
CREATE TABLE "VariantSize" (
    "variantId" INTEGER NOT NULL,
    "sizeId" INTEGER NOT NULL,

    CONSTRAINT "VariantSize_pkey" PRIMARY KEY ("variantId","sizeId")
);

-- AddForeignKey
ALTER TABLE "VariantSize" ADD CONSTRAINT "VariantSize_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantSize" ADD CONSTRAINT "VariantSize_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE CASCADE ON UPDATE CASCADE;
