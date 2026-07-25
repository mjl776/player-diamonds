-- AlterTable
ALTER TABLE "player_info" ALTER COLUMN "team_city" DROP NOT NULL,
ALTER COLUMN "team_city" SET DEFAULT 'FA',
ALTER COLUMN "team_name" DROP NOT NULL,
ALTER COLUMN "team_name" SET DEFAULT 'FA',
ALTER COLUMN "team_abbreviation" DROP NOT NULL,
ALTER COLUMN "team_abbreviation" SET DEFAULT 'FA';
