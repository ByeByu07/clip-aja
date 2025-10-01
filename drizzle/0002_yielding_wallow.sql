ALTER TABLE "contests" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."contest_type";--> statement-breakpoint
CREATE TYPE "public"."contest_type" AS ENUM('clip', 'ugc', 'soft-aware', 'testimonial');--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "type" SET DATA TYPE "public"."contest_type" USING "type"::"public"."contest_type";