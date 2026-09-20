/*
  Warnings:

  - You are about to drop the column `citations` on the `message` table. All the data in the column will be lost.
  - You are about to drop the `learning_artifact` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "learning_artifact" DROP CONSTRAINT "learning_artifact_workspaceId_fkey";

-- AlterTable
ALTER TABLE "message" DROP COLUMN "citations";

-- DropTable
DROP TABLE "learning_artifact";

-- DropEnum
DROP TYPE "ArtifactStatus";

-- DropEnum
DROP TYPE "ArtifactType";
