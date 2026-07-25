-- CreateTable
CREATE TABLE "player_info" (
    "id" UUID NOT NULL,
    "player_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "player_slug" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "team_slug" TEXT NOT NULL,
    "is_defunct" SMALLINT NOT NULL,
    "team_city" TEXT NOT NULL,
    "team_name" TEXT NOT NULL,
    "team_abbreviation" TEXT NOT NULL,
    "jersey_number" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "college" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "draft_year" INTEGER,
    "draft_round" SMALLINT,
    "draft_number" SMALLINT,
    "roster_status" SMALLINT NOT NULL,
    "from_year" TEXT NOT NULL,
    "to_year" TEXT NOT NULL,
    "stats_timeframe" TEXT NOT NULL,
    "supplemental_status" SMALLINT NOT NULL,

    CONSTRAINT "player_info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "player_info_player_id_key" ON "player_info"("player_id");

-- CreateIndex
CREATE INDEX "player_info_position_idx" ON "player_info"("position");
