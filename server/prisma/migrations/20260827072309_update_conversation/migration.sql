/*
  Warnings:

  - Made the column `title` on table `conversation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "conversation" ALTER COLUMN "title" SET NOT NULL;
