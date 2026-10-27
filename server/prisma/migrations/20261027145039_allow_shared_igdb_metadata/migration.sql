-- DropIndex
DROP INDEX "Game_igdbId_key";

-- CreateIndex
CREATE INDEX "Game_igdbId_idx" ON "Game"("igdbId");
