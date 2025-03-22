/*
  Warnings:

  - You are about to drop the column `Requests` on the `ShiftRequest` table. All the data in the column will be lost.
  - Added the required column `requests` to the `ShiftRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'MANAGER';

-- AlterTable
ALTER TABLE "ShiftRequest" DROP COLUMN "Requests",
ADD COLUMN     "requests" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "priceId" TEXT NOT NULL,
    "subscription_status" TEXT NOT NULL,
    "next_billing_date" TIMESTAMP(3) NOT NULL,
    "trial_end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_storeId_key" ON "Payment"("storeId");

-- RenameForeignKey
ALTER TABLE "SubmittedShift" RENAME CONSTRAINT "SubmittedShift_storeId_store_fkey" TO "SubmittedShift_storeId_fkey";

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
