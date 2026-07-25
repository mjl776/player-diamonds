/*
  Warnings:

  - You are about to drop the column `postion` on the `player_league_averages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "player_league_averages" DROP COLUMN "postion",
ADD COLUMN     "position" TEXT NOT NULL DEFAULT 'all';
