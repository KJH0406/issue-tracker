/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identifier` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "identifier" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_identifier_key" ON "Workspace"("identifier");
