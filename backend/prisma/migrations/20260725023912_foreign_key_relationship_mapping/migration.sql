-- AlterTable
ALTER TABLE "player_game_logs" ADD COLUMN     "playerInfoId" UUID;

-- AlterTable
ALTER TABLE "player_stats" ADD COLUMN     "playerInfoId" UUID;

-- AddForeignKey
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_playerInfoId_fkey" FOREIGN KEY ("playerInfoId") REFERENCES "player_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_game_logs" ADD CONSTRAINT "player_game_logs_playerInfoId_fkey" FOREIGN KEY ("playerInfoId") REFERENCES "player_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;
