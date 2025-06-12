-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "mobile" VARCHAR(20),
    "comment" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "type" TEXT NOT NULL DEFAULT 'CONTACT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);
