-- AlterTable
ALTER TABLE "player_info" ALTER COLUMN "roster_status" DROP NOT NULL,
ALTER COLUMN "roster_status" SET DEFAULT 0;
