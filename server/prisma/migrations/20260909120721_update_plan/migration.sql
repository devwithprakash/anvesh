/*
  Warnings:

  - You are about to drop the column `maxSourcesPerNotebook` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `sources` on the `UsageRecords` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `UsageRecords` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "maxSourcesPerNotebook",
ADD COLUMN     "maxSourcesPerWorkspace" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "maxWorkspaces" SET DEFAULT 0,
ALTER COLUMN "maxAiQueries" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "UsageRecords" DROP COLUMN "sources",
ALTER COLUMN "workspaces" SET DEFAULT 0,
ALTER COLUMN "AiQueries" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Plan_name_key" ON "Plan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UsageRecords_userId_key" ON "UsageRecords"("userId");
