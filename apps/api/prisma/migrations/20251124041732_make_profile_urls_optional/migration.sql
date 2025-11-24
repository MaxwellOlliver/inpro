/*
  Warnings:

  - You are about to drop the column `about` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "about",
ALTER COLUMN "avatarUrl" DROP NOT NULL,
ALTER COLUMN "bannerUrl" DROP NOT NULL;
