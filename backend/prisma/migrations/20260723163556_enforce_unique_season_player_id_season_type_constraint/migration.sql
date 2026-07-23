/*
  Warnings:

  - A unique constraint covering the columns `[player_id,season_type,season]` on the table `player_stats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "player_stats_player_id_season_type_season_key" ON "player_stats"("player_id", "season_type", "season");
