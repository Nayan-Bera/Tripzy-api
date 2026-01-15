CREATE TABLE "hotel_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" uuid NOT NULL,
	"type" varchar NOT NULL,
	"file_url" varchar NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotel_policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" uuid NOT NULL,
	"check_in_time" varchar,
	"check_out_time" varchar,
	"cancellation_policy" varchar,
	"refund_policy" varchar
);
--> statement-breakpoint
ALTER TABLE "hotel_documents" ADD CONSTRAINT "hotel_documents_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_documents" ADD CONSTRAINT "hotel_documents_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_policies" ADD CONSTRAINT "hotel_policies_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE no action ON UPDATE no action;