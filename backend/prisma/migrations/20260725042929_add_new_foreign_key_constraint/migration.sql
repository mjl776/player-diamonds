/*
  Warnings:

  - A unique constraint covering the columns `[season,season_type,position]` on the table `player_league_averages` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "player_league_averages_season_season_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "player_league_averages_season_season_type_position_key" ON "player_league_averages"("season", "season_type", "position");
