/*
  Warnings:

  - A unique constraint covering the columns `[projectId,number]` on the table `Issue` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "number" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Issue_projectId_number_key" ON "Issue"("projectId", "number");
