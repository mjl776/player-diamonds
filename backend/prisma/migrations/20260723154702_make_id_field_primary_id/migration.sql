/*
  Warnings:

  - The primary key for the `player_stats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `id` on table `player_stats` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "player_stats" DROP CONSTRAINT "player_stats_pkey",
ALTER COLUMN "id" SET NOT NULL,
ADD CONSTRAINT "player_stats_pkey" PRIMARY KEY ("id");
