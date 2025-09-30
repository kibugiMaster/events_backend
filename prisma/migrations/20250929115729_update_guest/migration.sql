-- AlterTable
ALTER TABLE "public"."event_guests" ADD COLUMN     "checkin_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_checked" BOOLEAN NOT NULL DEFAULT false;
