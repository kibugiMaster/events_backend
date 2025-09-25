-- CreateTable
CREATE TABLE "public"."event_guests" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "card_type_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "access_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."card_types" (
    "id" SERIAL NOT NULL,
    "event_type_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_types_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."event_guests" ADD CONSTRAINT "event_guests_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_guests" ADD CONSTRAINT "event_guests_card_type_id_fkey" FOREIGN KEY ("card_type_id") REFERENCES "public"."card_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."card_types" ADD CONSTRAINT "card_types_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
