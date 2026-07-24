-- CreateTable
CREATE TABLE "PlayerLeagueAverages" (
    "id" UUID NOT NULL,
    "season" TEXT NOT NULL,
    "season_type" TEXT NOT NULL DEFAULT 'Regular Season',
    "min" DECIMAL(4,1) NOT NULL,
    "fgm" DECIMAL(4,1) NOT NULL,
    "fga" DECIMAL(4,1) NOT NULL,
    "fg_pct" DECIMAL(4,3) NOT NULL,
    "fg3m" DECIMAL(4,1) NOT NULL,
    "fg3a" DECIMAL(4,1) NOT NULL,
    "fg3_pct" DECIMAL(4,3) NOT NULL,
    "ftm" DECIMAL(4,1) NOT NULL,
    "fta" DECIMAL(4,1) NOT NULL,
    "ft_pct" DECIMAL(4,3) NOT NULL,
    "oreb" DECIMAL(4,1) NOT NULL,
    "dreb" DECIMAL(4,1) NOT NULL,
    "reb" DECIMAL(4,1) NOT NULL,
    "ast" DECIMAL(4,1) NOT NULL,
    "tov" DECIMAL(4,1) NOT NULL,
    "stl" DECIMAL(4,1) NOT NULL,
    "blk" DECIMAL(4,1) NOT NULL,
    "blka" DECIMAL(4,1) NOT NULL,
    "pf" DECIMAL(4,1) NOT NULL,
    "pfd" DECIMAL(4,1) NOT NULL,
    "pts" DECIMAL(4,1) NOT NULL,
    "plus_minus" DECIMAL(5,1) NOT NULL,

    CONSTRAINT "PlayerLeagueAverages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlayerLeagueAverages_season_idx" ON "PlayerLeagueAverages"("season");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerLeagueAverages_season_season_type_key" ON "PlayerLeagueAverages"("season", "season_type");
