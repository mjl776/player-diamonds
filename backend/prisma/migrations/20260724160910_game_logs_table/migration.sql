-- CreateTable
CREATE TABLE "player_game_logs" (
    "id" UUID NOT NULL,
    "season_id" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "season_type" TEXT NOT NULL DEFAULT 'Regular Season',
    "player_id" TEXT NOT NULL,
    "player_name" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "team_abbreviation" TEXT NOT NULL,
    "team_name" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "game_date" DATE NOT NULL,
    "matchup" TEXT NOT NULL,
    "wl" CHAR(1) NOT NULL,
    "min" SMALLINT NOT NULL,
    "fgm" SMALLINT NOT NULL,
    "fga" SMALLINT NOT NULL,
    "fg_pct" DECIMAL(4,3) NOT NULL,
    "fg3m" SMALLINT NOT NULL,
    "fg3a" SMALLINT NOT NULL,
    "fg3_pct" DECIMAL(4,3) NOT NULL,
    "ftm" SMALLINT NOT NULL,
    "fta" SMALLINT NOT NULL,
    "ft_pct" DECIMAL(4,3) NOT NULL,
    "oreb" SMALLINT NOT NULL,
    "dreb" SMALLINT NOT NULL,
    "reb" SMALLINT NOT NULL,
    "ast" SMALLINT NOT NULL,
    "stl" SMALLINT NOT NULL,
    "blk" SMALLINT NOT NULL,
    "tov" SMALLINT NOT NULL,
    "pf" SMALLINT NOT NULL,
    "pts" SMALLINT NOT NULL,
    "plus_minus" DECIMAL(5,1) NOT NULL,
    "fantasy_pts" DECIMAL(5,1) NOT NULL,
    "video_available" BOOLEAN NOT NULL,

    CONSTRAINT "player_game_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "player_game_logs_player_id_idx" ON "player_game_logs"("player_id");

-- CreateIndex
CREATE INDEX "player_game_logs_game_id_idx" ON "player_game_logs"("game_id");

-- CreateIndex
CREATE INDEX "player_game_logs_season_id_idx" ON "player_game_logs"("season_id");

-- CreateIndex
CREATE UNIQUE INDEX "player_game_logs_player_id_game_id_key" ON "player_game_logs"("player_id", "game_id");
