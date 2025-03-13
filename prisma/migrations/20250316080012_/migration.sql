/*
  Warnings:

  - Added the required column `status` to the `SubmittedShift` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubmittedShift" ADD COLUMN     "status" "ShiftStatus" NOT NULL;
