-- CreateEnum
CREATE TYPE "PostVisibility" AS ENUM ('PUBLIC', 'FOLLOWERS_ONLY', 'PRIVATE');

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "text" VARCHAR(255) NOT NULL,
    "visibility" "PostVisibility" NOT NULL DEFAULT 'PUBLIC',
    "parentId" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_media" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "posts_profileId_idx" ON "posts"("profileId");

-- CreateIndex
CREATE INDEX "posts_parentId_idx" ON "posts"("parentId");

-- CreateIndex
CREATE INDEX "posts_createdAt_idx" ON "posts"("createdAt");

-- CreateIndex
CREATE INDEX "post_media_postId_idx" ON "post_media"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "post_media_postId_mediaId_key" ON "post_media"("postId", "mediaId");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_media" ADD CONSTRAINT "post_media_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
