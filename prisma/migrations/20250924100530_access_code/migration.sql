/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `event_types` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[access_code]` on the table `events` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."events" ADD COLUMN     "access_code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "event_types_name_key" ON "public"."event_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "events_access_code_key" ON "public"."events"("access_code");
