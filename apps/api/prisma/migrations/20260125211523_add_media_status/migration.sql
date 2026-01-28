-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'FAILED');

-- AlterTable
ALTER TABLE "media" ADD COLUMN     "status" "MediaStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "media_status_idx" ON "media"("status");
