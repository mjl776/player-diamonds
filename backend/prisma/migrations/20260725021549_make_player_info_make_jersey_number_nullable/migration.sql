-- AlterTable
ALTER TABLE "player_info" ALTER COLUMN "jersey_number" DROP NOT NULL,
ALTER COLUMN "jersey_number" SET DEFAULT 'No Team';
