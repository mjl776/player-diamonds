/*
  Warnings:

  - You are about to drop the column `cfid` on the `player_stats` table. All the data in the column will be lost.
  - You are about to drop the column `cfparams` on the `player_stats` table. All the data in the column will be lost.
  - Added the required column `nickname` to the `player_stats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_count` to the `player_stats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wnba_fantasy_pts` to the `player_stats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wnba_fantasy_pts_rank` to the `player_stats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "player_stats" DROP COLUMN "cfid",
DROP COLUMN "cfparams",
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "team_count" SMALLINT NOT NULL,
ADD COLUMN     "wnba_fantasy_pts" DECIMAL(5,1) NOT NULL,
ADD COLUMN     "wnba_fantasy_pts_rank" INTEGER NOT NULL;
