/*
  Warnings:

  - You are about to drop the column `playerInfoId` on the `player_game_logs` table. All the data in the column will be lost.
  - You are about to drop the column `playerInfoId` on the `player_stats` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "player_game_logs" DROP CONSTRAINT "player_game_logs_playerInfoId_fkey";

-- DropForeignKey
ALTER TABLE "player_stats" DROP CONSTRAINT "player_stats_playerInfoId_fkey";

-- AlterTable
ALTER TABLE "player_game_logs" DROP COLUMN "playerInfoId";

-- AlterTable
ALTER TABLE "player_stats" DROP COLUMN "playerInfoId";

-- AddForeignKey
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player_info"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_game_logs" ADD CONSTRAINT "player_game_logs_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player_info"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;
