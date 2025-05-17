/*
  Warnings:

  - Made the column `number` on table `Issue` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "IssueStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "status" "IssueStatus" NOT NULL DEFAULT 'TODO',
ALTER COLUMN "number" SET NOT NULL;
