/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `bannerUrl` on the `profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[avatarId]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bannerId]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER');

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "avatarUrl",
DROP COLUMN "bannerUrl",
ADD COLUMN     "avatarId" TEXT,
ADD COLUMN     "bannerId" TEXT;

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "size" INTEGER NOT NULL,
    "purpose" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_avatarId_key" ON "profiles"("avatarId");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_bannerId_key" ON "profiles"("bannerId");
