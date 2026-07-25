/*
  Warnings:

  - Added the required column `gp` to the `player_league_averages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "player_league_averages" ADD COLUMN     "gp" SMALLINT NOT NULL;
