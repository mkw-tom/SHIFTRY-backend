-- This is an empty migration.
-- `NULL` の `storeId` を `UUID` に更新
UPDATE "Store" SET "storeId" = gen_random_uuid() WHERE "storeId" IS NULL;

-- `storeId` を `NOT NULL` に変更
ALTER TABLE "Store" ALTER COLUMN "storeId" SET NOT NULL;
