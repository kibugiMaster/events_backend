/*
  Warnings:

  - A unique constraint covering the columns `[access_code]` on the table `event_guests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "event_guests_access_code_key" ON "public"."event_guests"("access_code");
