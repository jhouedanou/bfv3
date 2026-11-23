import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_barometres_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__barometres_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_demandes_type" AS ENUM('contact', 'barometre', 'etude', 'notify');
  CREATE TYPE "public"."enum_demandes_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_demandes_email_status" AS ENUM('pending', 'sent', 'failed');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TABLE "barometres_scope" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "barometres_kpis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"explanation" varchar
  );
  
  CREATE TABLE "barometres" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"identifiant" varchar,
  	"published_at" timestamp(3) with time zone,
  	"title" varchar,
  	"takeaway" varchar,
  	"cover_id" integer,
  	"ressource_interne" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_barometres_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_barometres_v_version_scope" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_barometres_v_version_kpis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"explanation" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_barometres_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_identifiant" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_title" varchar,
  	"version_takeaway" varchar,
  	"version_cover_id" integer,
  	"version_ressource_interne" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__barometres_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar
  );
  
  CREATE TABLE "demandes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"subject" varchar NOT NULL,
  	"type" "enum_demandes_type" NOT NULL,
  	"source" varchar,
  	"email" varchar NOT NULL,
  	"locale" "enum_demandes_locale",
  	"page" varchar,
  	"fields" jsonb,
  	"email_status" "enum_demandes_email_status" DEFAULT 'pending',
  	"email_error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"barometres_id" integer,
  	"media_id" integer,
  	"demandes_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "parametres" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email_reception" varchar DEFAULT 'contact@bigfiveabidjan.com' NOT NULL,
  	"email_public" varchar DEFAULT 'contact@bigfiveabidjan.com' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "barometres_scope" ADD CONSTRAINT "barometres_scope_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."barometres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "barometres_kpis" ADD CONSTRAINT "barometres_kpis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."barometres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "barometres" ADD CONSTRAINT "barometres_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_barometres_v_version_scope" ADD CONSTRAINT "_barometres_v_version_scope_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_barometres_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_barometres_v_version_kpis" ADD CONSTRAINT "_barometres_v_version_kpis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_barometres_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_barometres_v" ADD CONSTRAINT "_barometres_v_parent_id_barometres_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."barometres"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_barometres_v" ADD CONSTRAINT "_barometres_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_barometres_fk" FOREIGN KEY ("barometres_id") REFERENCES "public"."barometres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_demandes_fk" FOREIGN KEY ("demandes_id") REFERENCES "public"."demandes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "barometres_scope_order_idx" ON "barometres_scope" USING btree ("_order");
  CREATE INDEX "barometres_scope_parent_id_idx" ON "barometres_scope" USING btree ("_parent_id");
  CREATE INDEX "barometres_kpis_order_idx" ON "barometres_kpis" USING btree ("_order");
  CREATE INDEX "barometres_kpis_parent_id_idx" ON "barometres_kpis" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "barometres_identifiant_idx" ON "barometres" USING btree ("identifiant");
  CREATE INDEX "barometres_cover_idx" ON "barometres" USING btree ("cover_id");
  CREATE INDEX "barometres_updated_at_idx" ON "barometres" USING btree ("updated_at");
  CREATE INDEX "barometres_created_at_idx" ON "barometres" USING btree ("created_at");
  CREATE INDEX "barometres__status_idx" ON "barometres" USING btree ("_status");
  CREATE INDEX "_barometres_v_version_scope_order_idx" ON "_barometres_v_version_scope" USING btree ("_order");
  CREATE INDEX "_barometres_v_version_scope_parent_id_idx" ON "_barometres_v_version_scope" USING btree ("_parent_id");
  CREATE INDEX "_barometres_v_version_kpis_order_idx" ON "_barometres_v_version_kpis" USING btree ("_order");
  CREATE INDEX "_barometres_v_version_kpis_parent_id_idx" ON "_barometres_v_version_kpis" USING btree ("_parent_id");
  CREATE INDEX "_barometres_v_parent_idx" ON "_barometres_v" USING btree ("parent_id");
  CREATE INDEX "_barometres_v_version_version_identifiant_idx" ON "_barometres_v" USING btree ("version_identifiant");
  CREATE INDEX "_barometres_v_version_version_cover_idx" ON "_barometres_v" USING btree ("version_cover_id");
  CREATE INDEX "_barometres_v_version_version_updated_at_idx" ON "_barometres_v" USING btree ("version_updated_at");
  CREATE INDEX "_barometres_v_version_version_created_at_idx" ON "_barometres_v" USING btree ("version_created_at");
  CREATE INDEX "_barometres_v_version_version__status_idx" ON "_barometres_v" USING btree ("version__status");
  CREATE INDEX "_barometres_v_created_at_idx" ON "_barometres_v" USING btree ("created_at");
  CREATE INDEX "_barometres_v_updated_at_idx" ON "_barometres_v" USING btree ("updated_at");
  CREATE INDEX "_barometres_v_latest_idx" ON "_barometres_v" USING btree ("latest");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "demandes_updated_at_idx" ON "demandes" USING btree ("updated_at");
  CREATE INDEX "demandes_created_at_idx" ON "demandes" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_barometres_id_idx" ON "payload_locked_documents_rels" USING btree ("barometres_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_demandes_id_idx" ON "payload_locked_documents_rels" USING btree ("demandes_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "barometres_scope" CASCADE;
  DROP TABLE "barometres_kpis" CASCADE;
  DROP TABLE "barometres" CASCADE;
  DROP TABLE "_barometres_v_version_scope" CASCADE;
  DROP TABLE "_barometres_v_version_kpis" CASCADE;
  DROP TABLE "_barometres_v" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "demandes" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "parametres" CASCADE;
  DROP TYPE "public"."enum_barometres_status";
  DROP TYPE "public"."enum__barometres_v_version_status";
  DROP TYPE "public"."enum_demandes_type";
  DROP TYPE "public"."enum_demandes_locale";
  DROP TYPE "public"."enum_demandes_email_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
