-- Assign a UUID to existing rows with NULL IDs
UPDATE "player_stats"
SET "id" = gen_random_uuid()
WHERE "id" IS NULL;