-- AlterTable
ALTER TABLE "player_info" ALTER COLUMN "team_slug" DROP NOT NULL,
ALTER COLUMN "team_slug" SET DEFAULT 'FA';
