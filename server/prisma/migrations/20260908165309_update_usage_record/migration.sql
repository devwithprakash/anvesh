/*
  Warnings:

  - Added the required column `periodEnd` to the `UsageRecords` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodStart` to the `UsageRecords` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UsageRecords_userId_key";

-- AlterTable
ALTER TABLE "UsageRecords" ADD COLUMN     "periodEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "periodStart" TIMESTAMP(3) NOT NULL;
