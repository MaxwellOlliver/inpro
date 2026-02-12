/*
  Warnings:

  - A unique constraint covering the columns `[commentId,mentionedProfileId]` on the table `comment_mentions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "post_likes" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_likes" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_likes_postId_idx" ON "post_likes"("postId");

-- CreateIndex
CREATE INDEX "post_likes_profileId_idx" ON "post_likes"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "post_likes_profileId_postId_key" ON "post_likes"("profileId", "postId");

-- CreateIndex
CREATE INDEX "comment_likes_commentId_idx" ON "comment_likes"("commentId");

-- CreateIndex
CREATE INDEX "comment_likes_profileId_idx" ON "comment_likes"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "comment_likes_profileId_commentId_key" ON "comment_likes"("profileId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "comment_mentions_commentId_mentionedProfileId_key" ON "comment_mentions"("commentId", "mentionedProfileId");

-- AddForeignKey
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
