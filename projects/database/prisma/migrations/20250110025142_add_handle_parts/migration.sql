/*
  Warnings:

  - Added the required column `handlePart1` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `handlePart2` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `handlePart3` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "handlePart1" TEXT NOT NULL,
ADD COLUMN     "handlePart2" TEXT NOT NULL,
ADD COLUMN     "handlePart3" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "User_handlePart1_idx" ON "User"("handlePart1");

-- CreateIndex
CREATE INDEX "User_handlePart2_idx" ON "User"("handlePart2");

-- CreateIndex
CREATE INDEX "User_handlePart3_idx" ON "User"("handlePart3");
