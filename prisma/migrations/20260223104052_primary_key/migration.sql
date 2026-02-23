/*
  Warnings:

  - The primary key for the `card_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `event_gallery` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `event_guests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `event_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `events` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `faqs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `refresh_token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."card_types" DROP CONSTRAINT "card_types_event_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."event_gallery" DROP CONSTRAINT "event_gallery_event_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."event_guests" DROP CONSTRAINT "event_guests_card_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."event_guests" DROP CONSTRAINT "event_guests_event_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."events" DROP CONSTRAINT "events_event_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."events" DROP CONSTRAINT "events_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."refresh_token" DROP CONSTRAINT "refresh_token_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."card_types" DROP CONSTRAINT "card_types_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "event_type_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "card_types_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "card_types_id_seq";

-- AlterTable
ALTER TABLE "public"."event_gallery" DROP CONSTRAINT "event_gallery_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "event_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "event_gallery_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "event_gallery_id_seq";

-- AlterTable
ALTER TABLE "public"."event_guests" DROP CONSTRAINT "event_guests_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "card_type_id" SET DATA TYPE TEXT,
ALTER COLUMN "event_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "event_guests_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "event_guests_id_seq";

-- AlterTable
ALTER TABLE "public"."event_types" DROP CONSTRAINT "event_types_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "event_types_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "event_types_id_seq";

-- AlterTable
ALTER TABLE "public"."events" DROP CONSTRAINT "events_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "event_type_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "events_id_seq";

-- AlterTable
ALTER TABLE "public"."faqs" DROP CONSTRAINT "faqs_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "faqs_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "faqs_id_seq";

-- AlterTable
ALTER TABLE "public"."refresh_token" DROP CONSTRAINT "refresh_token_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "refresh_token_id_seq";

-- AlterTable
ALTER TABLE "public"."users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- CreateTable
CREATE TABLE "public"."sms_sent" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "sms" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sms_sent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."refresh_token" ADD CONSTRAINT "refresh_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_guests" ADD CONSTRAINT "event_guests_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_guests" ADD CONSTRAINT "event_guests_card_type_id_fkey" FOREIGN KEY ("card_type_id") REFERENCES "public"."card_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_gallery" ADD CONSTRAINT "event_gallery_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."card_types" ADD CONSTRAINT "card_types_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sms_sent" ADD CONSTRAINT "sms_sent_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sms_sent" ADD CONSTRAINT "sms_sent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
