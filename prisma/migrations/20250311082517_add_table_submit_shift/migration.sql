/*
  Warnings:

  - You are about to drop the column `shifts` on the `StoreShift` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StoreShift" DROP COLUMN "shifts";

-- CreateTable
CREATE TABLE "SubmittedShift" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "shifts" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubmittedShift_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubmittedShift_userId_storeId_key" ON "SubmittedShift"("userId", "storeId");

-- AddForeignKey
ALTER TABLE "SubmittedShift" ADD CONSTRAINT "SubmittedShift_storeId_store_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedShift" ADD CONSTRAINT "SubmittedShift_storeId_storeShift_fkey" FOREIGN KEY ("storeId") REFERENCES "StoreShift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedShift" ADD CONSTRAINT "SubmittedShift_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
