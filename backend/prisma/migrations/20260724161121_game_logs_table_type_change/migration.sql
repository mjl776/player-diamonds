/*
  Warnings:

  - Changed the type of `video_available` on the `player_game_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "player_game_logs" DROP COLUMN "video_available",
ADD COLUMN     "video_available" INTEGER NOT NULL;
