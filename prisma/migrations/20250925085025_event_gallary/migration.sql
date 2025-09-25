-- CreateTable
CREATE TABLE "public"."event_gallery" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "media_url" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "caption" TEXT,
    "is_private" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_gallery_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."event_gallery" ADD CONSTRAINT "event_gallery_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
