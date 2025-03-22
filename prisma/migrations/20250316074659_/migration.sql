/*
  Warnings:

  - You are about to drop the column `assignShiftId` on the `SubmittedShift` table. All the data in the column will be lost.
  - Added the required column `shiftRequestId` to the `SubmittedShift` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SubmittedShift" DROP CONSTRAINT "SubmittedShift_assignShiftId_fkey";

-- DropIndex
DROP INDEX "SubmittedShift_assignShiftId_key";

-- AlterTable
ALTER TABLE "SubmittedShift" DROP COLUMN "assignShiftId",
ADD COLUMN     "shiftRequestId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SubmittedShift" ADD CONSTRAINT "SubmittedShift_shiftRequestId_fkey" FOREIGN KEY ("shiftRequestId") REFERENCES "ShiftRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
