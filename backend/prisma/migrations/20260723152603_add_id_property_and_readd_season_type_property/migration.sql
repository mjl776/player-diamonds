-- AlterTable
ALTER TABLE "player_stats" ADD COLUMN     "id" UUID,
ADD COLUMN     "season_type" TEXT NOT NULL DEFAULT 'Regular Season';
