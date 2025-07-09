ALTER TABLE "rooms" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "rooms" DROP COLUMN "deleted_at";