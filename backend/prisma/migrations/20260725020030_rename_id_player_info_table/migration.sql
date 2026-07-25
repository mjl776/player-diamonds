/*
  Warnings:

  - You are about to drop the column `player_id` on the `player_info` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[person_id]` on the table `player_info` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `person_id` to the `player_info` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "player_info_player_id_key";

-- AlterTable
ALTER TABLE "player_info" DROP COLUMN "player_id",
ADD COLUMN     "person_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "player_info_person_id_key" ON "player_info"("person_id");
