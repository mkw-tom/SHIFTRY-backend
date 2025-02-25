/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_storeId_fkey";

-- DropIndex
DROP INDEX "Store_ownerId_key";

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "ownerId",
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "StoreShift" ADD COLUMN     "weekEnd" TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "groupId",
DROP COLUMN "storeId",
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "OwnerStore" (
    "ownerId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,

    CONSTRAINT "OwnerStore_pkey" PRIMARY KEY ("ownerId","storeId")
);

-- CreateTable
CREATE TABLE "UserStore" (
    "userId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,

    CONSTRAINT "UserStore_pkey" PRIMARY KEY ("userId","storeId")
);

-- AddForeignKey
ALTER TABLE "OwnerStore" ADD CONSTRAINT "OwnerStore_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerStore" ADD CONSTRAINT "OwnerStore_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStore" ADD CONSTRAINT "UserStore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStore" ADD CONSTRAINT "UserStore_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
