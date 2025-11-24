-- DropIndex
DROP INDEX "profiles_userId_idx";

-- CreateIndex
CREATE INDEX "profiles_userId_userName_idx" ON "profiles"("userId", "userName");
