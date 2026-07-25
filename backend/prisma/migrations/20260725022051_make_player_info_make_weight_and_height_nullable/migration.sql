-- AlterTable
ALTER TABLE "player_info" ALTER COLUMN "height" DROP NOT NULL,
ALTER COLUMN "height" SET DEFAULT 'Not Available',
ALTER COLUMN "weight" DROP NOT NULL,
ALTER COLUMN "weight" SET DEFAULT 'Not Available';
