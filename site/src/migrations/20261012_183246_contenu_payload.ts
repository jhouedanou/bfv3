import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_solutions_key" AS ENUM('veille', 'conseil', 'academy', 'digitales');
  CREATE TYPE "public"."enum_solutions_pole" AS ENUM('intel', 'tech');
  CREATE TYPE "public"."enum_offres_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__offres_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__offres_v_published_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum__barometres_v_published_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_accueil_poles_pole" AS ENUM('intel', 'tech');
  CREATE TABLE "solutions_obtenez" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "solutions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" "enum_solutions_key" NOT NULL,
  	"ordre" numeric NOT NULL,
  	"pole" "enum_solutions_pole" NOT NULL,
  	"image_id" integer NOT NULL,
  	"image_pos" varchar DEFAULT 'center',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "solutions_locales" (
  	"nom" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"etape" varchar NOT NULL,
  	"hero_sub" varchar NOT NULL,
  	"tag" varchar NOT NULL,
  	"promesse" varchar NOT NULL,
  	"porteur" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "offres_livrables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "offres_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"reponse" varchar
  );
  
  CREATE TABLE "offres" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"solution_id" integer,
  	"ordre" numeric,
  	"valide" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_offres_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "offres_locales" (
  	"titre" varchar,
  	"slug" varchar,
  	"accroche" varchar,
  	"corps" jsonb,
  	"meta_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_offres_v_version_livrables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_offres_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"reponse" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_offres_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_solution_id" integer,
  	"version_ordre" numeric,
  	"version_valide" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__offres_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__offres_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_offres_v_locales" (
  	"version_titre" varchar,
  	"version_slug" varchar,
  	"version_accroche" varchar,
  	"version_corps" jsonb,
  	"version_meta_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "clients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nom" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"ordre" numeric DEFAULT 100 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "textes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "textes_locales" (
  	"nav_home" varchar,
  	"nav_agence" varchar,
  	"nav_solutions" varchar,
  	"nav_observatoire" varchar,
  	"nav_references" varchar,
  	"contact_us" varchar,
  	"logo_alt" varchar,
  	"h1a" varchar,
  	"h1b" varchar,
  	"h1c" varchar,
  	"h1d" varchar,
  	"m1" varchar,
  	"m2" varchar,
  	"m3" varchar,
  	"m4" varchar,
  	"discover" varchar,
  	"lets_talk" varchar,
  	"slide" varchar,
  	"slideshow" varchar,
  	"ey_firm" varchar,
  	"firm_title_a" varchar,
  	"firm_title_b" varchar,
  	"firm_p1a" varchar,
  	"firm_p1b" varchar,
  	"firm_p2a" varchar,
  	"firm_p2b" varchar,
  	"pole_intel" varchar,
  	"pole_tech" varchar,
  	"ey_sol" varchar,
  	"sol_title" varchar,
  	"we_do" varchar,
  	"you_get" varchar,
  	"led_by" varchar,
  	"other_offers" varchar,
  	"faq_title" varchar,
  	"ey_obs" varchar,
  	"obs_sub" varchar,
  	"latest_baro" varchar,
  	"takeaway" varchar,
  	"dl_baro" varchar,
  	"baro" varchar,
  	"baro_of" varchar,
  	"all_baros" varchar,
  	"prev_baros" varchar,
  	"fr_only" varchar,
  	"zoom_label" varchar,
  	"zoom_cover" varchar,
  	"notify_cta" varchar,
  	"notify_title" varchar,
  	"notify_desc" varchar,
  	"nl_ey" varchar,
  	"nl_title" varchar,
  	"work_email" varchar,
  	"sign_up" varchar,
  	"nl_done" varchar,
  	"order_ey" varchar,
  	"order_title" varchar,
  	"order_desc" varchar,
  	"order_short" varchar,
  	"order_ask" varchar,
  	"order_cta" varchar,
  	"free_access" varchar,
  	"platform" varchar,
  	"laveiye_desc" varchar,
  	"go_laveiye" varchar,
  	"powered_by" varchar,
  	"laveiye_line" varchar,
  	"ey_ref" varchar,
  	"ref_title" varchar,
  	"ref_sub" varchar,
  	"client_logo" varchar,
  	"rights" varchar,
  	"legal" varchar,
  	"privacy" varchar,
  	"privacy_updated" varchar,
  	"privacy_intro" varchar,
  	"privacy_contact" varchar,
  	"contact_title" varchar,
  	"c_intro1" varchar,
  	"c_intro2" varchar,
  	"required" varchar,
  	"origin" varchar,
  	"full_name" varchar,
  	"email_pro" varchar,
  	"phone" varchar,
  	"phone_opt" varchar,
  	"company" varchar,
  	"role" varchar,
  	"job_title" varchar,
  	"sector" varchar,
  	"which" varchar,
  	"need" varchar,
  	"consent" varchar,
  	"optin" varchar,
  	"submit" varchar,
  	"sending" varchar,
  	"invalid" varchar,
  	"ph_name" varchar,
  	"ph_email" varchar,
  	"ph_company" varchar,
  	"ph_role" varchar,
  	"ph_sector" varchar,
  	"ph_need" varchar,
  	"multi" varchar,
  	"unknown" varchar,
  	"ok_t" varchar,
  	"ok_p" varchar,
  	"ok_rec" varchar,
  	"see_baro" varchar,
  	"err_t" varchar,
  	"err_p" varchar,
  	"retry_l" varchar,
  	"gate_intro" varchar,
  	"gate_nl" varchar,
  	"gate_cta" varchar,
  	"gate_done_t" varchar,
  	"gate_done_p" varchar,
  	"sources_observatoire" varchar,
  	"sources_header" varchar,
  	"sources_hero" varchar,
  	"sources_solutions" varchar,
  	"sources_veille" varchar,
  	"sources_conseil" varchar,
  	"sources_academy" varchar,
  	"sources_digitales" varchar,
  	"menu" varchar,
  	"open_menu" varchar,
  	"close_menu" varchar,
  	"lang_group" varchar,
  	"skip" varchar,
  	"back_home" varchar,
  	"home_aria" varchar,
  	"sections_aria" varchar,
  	"crumbs" varchar,
  	"close" varchar,
  	"close_btn" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "accueil_couvertures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "accueil_poles_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "accueil_poles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pole" "enum_accueil_poles_pole" NOT NULL,
  	"responsable" varchar NOT NULL
  );
  
  CREATE TABLE "accueil_poles_locales" (
  	"etape" varchar NOT NULL,
  	"promesse" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "accueil" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"personnage_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "seo" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "seo_locales" (
  	"titre" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "liens_reseaux" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"court" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "liens" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"laveiye" varchar DEFAULT 'https://laveiye.com/' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "politique_sections_paragraphes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texte" varchar NOT NULL
  );
  
  CREATE TABLE "politique_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar NOT NULL
  );
  
  CREATE TABLE "politique" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "_barometres_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_barometres_v" ADD COLUMN "published_locale" "enum__barometres_v_published_locale";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "solutions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "offres_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "clients_id" integer;
  ALTER TABLE "solutions_obtenez" ADD CONSTRAINT "solutions_obtenez_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_locales" ADD CONSTRAINT "solutions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offres_livrables" ADD CONSTRAINT "offres_livrables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offres_faq" ADD CONSTRAINT "offres_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offres" ADD CONSTRAINT "offres_solution_id_solutions_id_fk" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "offres_locales" ADD CONSTRAINT "offres_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_offres_v_version_livrables" ADD CONSTRAINT "_offres_v_version_livrables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_offres_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_offres_v_version_faq" ADD CONSTRAINT "_offres_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_offres_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_offres_v" ADD CONSTRAINT "_offres_v_parent_id_offres_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."offres"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_offres_v" ADD CONSTRAINT "_offres_v_version_solution_id_solutions_id_fk" FOREIGN KEY ("version_solution_id") REFERENCES "public"."solutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_offres_v_locales" ADD CONSTRAINT "_offres_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_offres_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients" ADD CONSTRAINT "clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "textes_locales" ADD CONSTRAINT "textes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."textes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_couvertures" ADD CONSTRAINT "accueil_couvertures_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "accueil_couvertures" ADD CONSTRAINT "accueil_couvertures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_poles_items" ADD CONSTRAINT "accueil_poles_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil_poles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_poles" ADD CONSTRAINT "accueil_poles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_poles_locales" ADD CONSTRAINT "accueil_poles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil_poles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil" ADD CONSTRAINT "accueil_personnage_id_media_id_fk" FOREIGN KEY ("personnage_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo" ADD CONSTRAINT "seo_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo_locales" ADD CONSTRAINT "seo_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seo"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "liens_reseaux" ADD CONSTRAINT "liens_reseaux_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."liens"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "politique_sections_paragraphes" ADD CONSTRAINT "politique_sections_paragraphes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."politique_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "politique_sections" ADD CONSTRAINT "politique_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."politique"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "solutions_obtenez_order_idx" ON "solutions_obtenez" USING btree ("_order");
  CREATE INDEX "solutions_obtenez_parent_id_idx" ON "solutions_obtenez" USING btree ("_parent_id");
  CREATE INDEX "solutions_obtenez_locale_idx" ON "solutions_obtenez" USING btree ("_locale");
  CREATE UNIQUE INDEX "solutions_key_idx" ON "solutions" USING btree ("key");
  CREATE INDEX "solutions_image_idx" ON "solutions" USING btree ("image_id");
  CREATE INDEX "solutions_updated_at_idx" ON "solutions" USING btree ("updated_at");
  CREATE INDEX "solutions_created_at_idx" ON "solutions" USING btree ("created_at");
  CREATE INDEX "solutions_slug_idx" ON "solutions_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "solutions_locales_locale_parent_id_unique" ON "solutions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "offres_livrables_order_idx" ON "offres_livrables" USING btree ("_order");
  CREATE INDEX "offres_livrables_parent_id_idx" ON "offres_livrables" USING btree ("_parent_id");
  CREATE INDEX "offres_livrables_locale_idx" ON "offres_livrables" USING btree ("_locale");
  CREATE INDEX "offres_faq_order_idx" ON "offres_faq" USING btree ("_order");
  CREATE INDEX "offres_faq_parent_id_idx" ON "offres_faq" USING btree ("_parent_id");
  CREATE INDEX "offres_faq_locale_idx" ON "offres_faq" USING btree ("_locale");
  CREATE INDEX "offres_solution_idx" ON "offres" USING btree ("solution_id");
  CREATE INDEX "offres_updated_at_idx" ON "offres" USING btree ("updated_at");
  CREATE INDEX "offres_created_at_idx" ON "offres" USING btree ("created_at");
  CREATE INDEX "offres__status_idx" ON "offres" USING btree ("_status");
  CREATE INDEX "offres_slug_idx" ON "offres_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "offres_locales_locale_parent_id_unique" ON "offres_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_offres_v_version_livrables_order_idx" ON "_offres_v_version_livrables" USING btree ("_order");
  CREATE INDEX "_offres_v_version_livrables_parent_id_idx" ON "_offres_v_version_livrables" USING btree ("_parent_id");
  CREATE INDEX "_offres_v_version_livrables_locale_idx" ON "_offres_v_version_livrables" USING btree ("_locale");
  CREATE INDEX "_offres_v_version_faq_order_idx" ON "_offres_v_version_faq" USING btree ("_order");
  CREATE INDEX "_offres_v_version_faq_parent_id_idx" ON "_offres_v_version_faq" USING btree ("_parent_id");
  CREATE INDEX "_offres_v_version_faq_locale_idx" ON "_offres_v_version_faq" USING btree ("_locale");
  CREATE INDEX "_offres_v_parent_idx" ON "_offres_v" USING btree ("parent_id");
  CREATE INDEX "_offres_v_version_version_solution_idx" ON "_offres_v" USING btree ("version_solution_id");
  CREATE INDEX "_offres_v_version_version_updated_at_idx" ON "_offres_v" USING btree ("version_updated_at");
  CREATE INDEX "_offres_v_version_version_created_at_idx" ON "_offres_v" USING btree ("version_created_at");
  CREATE INDEX "_offres_v_version_version__status_idx" ON "_offres_v" USING btree ("version__status");
  CREATE INDEX "_offres_v_created_at_idx" ON "_offres_v" USING btree ("created_at");
  CREATE INDEX "_offres_v_updated_at_idx" ON "_offres_v" USING btree ("updated_at");
  CREATE INDEX "_offres_v_snapshot_idx" ON "_offres_v" USING btree ("snapshot");
  CREATE INDEX "_offres_v_published_locale_idx" ON "_offres_v" USING btree ("published_locale");
  CREATE INDEX "_offres_v_latest_idx" ON "_offres_v" USING btree ("latest");
  CREATE INDEX "_offres_v_version_version_slug_idx" ON "_offres_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_offres_v_locales_locale_parent_id_unique" ON "_offres_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "clients_logo_idx" ON "clients" USING btree ("logo_id");
  CREATE INDEX "clients_updated_at_idx" ON "clients" USING btree ("updated_at");
  CREATE INDEX "clients_created_at_idx" ON "clients" USING btree ("created_at");
  CREATE UNIQUE INDEX "textes_locales_locale_parent_id_unique" ON "textes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accueil_couvertures_order_idx" ON "accueil_couvertures" USING btree ("_order");
  CREATE INDEX "accueil_couvertures_parent_id_idx" ON "accueil_couvertures" USING btree ("_parent_id");
  CREATE INDEX "accueil_couvertures_image_idx" ON "accueil_couvertures" USING btree ("image_id");
  CREATE INDEX "accueil_poles_items_order_idx" ON "accueil_poles_items" USING btree ("_order");
  CREATE INDEX "accueil_poles_items_parent_id_idx" ON "accueil_poles_items" USING btree ("_parent_id");
  CREATE INDEX "accueil_poles_items_locale_idx" ON "accueil_poles_items" USING btree ("_locale");
  CREATE INDEX "accueil_poles_order_idx" ON "accueil_poles" USING btree ("_order");
  CREATE INDEX "accueil_poles_parent_id_idx" ON "accueil_poles" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "accueil_poles_locales_locale_parent_id_unique" ON "accueil_poles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accueil_personnage_idx" ON "accueil" USING btree ("personnage_id");
  CREATE INDEX "seo_image_idx" ON "seo" USING btree ("image_id");
  CREATE UNIQUE INDEX "seo_locales_locale_parent_id_unique" ON "seo_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "liens_reseaux_order_idx" ON "liens_reseaux" USING btree ("_order");
  CREATE INDEX "liens_reseaux_parent_id_idx" ON "liens_reseaux" USING btree ("_parent_id");
  CREATE INDEX "politique_sections_paragraphes_order_idx" ON "politique_sections_paragraphes" USING btree ("_order");
  CREATE INDEX "politique_sections_paragraphes_parent_id_idx" ON "politique_sections_paragraphes" USING btree ("_parent_id");
  CREATE INDEX "politique_sections_paragraphes_locale_idx" ON "politique_sections_paragraphes" USING btree ("_locale");
  CREATE INDEX "politique_sections_order_idx" ON "politique_sections" USING btree ("_order");
  CREATE INDEX "politique_sections_parent_id_idx" ON "politique_sections" USING btree ("_parent_id");
  CREATE INDEX "politique_sections_locale_idx" ON "politique_sections" USING btree ("_locale");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_offres_fk" FOREIGN KEY ("offres_id") REFERENCES "public"."offres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_barometres_v_snapshot_idx" ON "_barometres_v" USING btree ("snapshot");
  CREATE INDEX "_barometres_v_published_locale_idx" ON "_barometres_v" USING btree ("published_locale");
  CREATE INDEX "payload_locked_documents_rels_solutions_id_idx" ON "payload_locked_documents_rels" USING btree ("solutions_id");
  CREATE INDEX "payload_locked_documents_rels_offres_id_idx" ON "payload_locked_documents_rels" USING btree ("offres_id");
  CREATE INDEX "payload_locked_documents_rels_clients_id_idx" ON "payload_locked_documents_rels" USING btree ("clients_id");`)
  // Nouvelles tables : RLS sans règle, pour fermer l'API REST de Supabase (voir README).
  await db.execute(sql`
   DO $$ DECLARE r record; BEGIN
     FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND NOT rowsecurity AND tablename = lower(tablename) LOOP
       EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
     END LOOP;
   END $$;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "solutions_obtenez" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "offres_livrables" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "offres_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "offres" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "offres_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_offres_v_version_livrables" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_offres_v_version_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_offres_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_offres_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "clients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "textes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "textes_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "accueil_couvertures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "accueil_poles_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "accueil_poles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "accueil_poles_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "accueil" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seo" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seo_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "liens_reseaux" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "liens" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "politique_sections_paragraphes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "politique_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "politique" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "solutions_obtenez" CASCADE;
  DROP TABLE "solutions" CASCADE;
  DROP TABLE "solutions_locales" CASCADE;
  DROP TABLE "offres_livrables" CASCADE;
  DROP TABLE "offres_faq" CASCADE;
  DROP TABLE "offres" CASCADE;
  DROP TABLE "offres_locales" CASCADE;
  DROP TABLE "_offres_v_version_livrables" CASCADE;
  DROP TABLE "_offres_v_version_faq" CASCADE;
  DROP TABLE "_offres_v" CASCADE;
  DROP TABLE "_offres_v_locales" CASCADE;
  DROP TABLE "clients" CASCADE;
  DROP TABLE "textes" CASCADE;
  DROP TABLE "textes_locales" CASCADE;
  DROP TABLE "accueil_couvertures" CASCADE;
  DROP TABLE "accueil_poles_items" CASCADE;
  DROP TABLE "accueil_poles" CASCADE;
  DROP TABLE "accueil_poles_locales" CASCADE;
  DROP TABLE "accueil" CASCADE;
  DROP TABLE "seo" CASCADE;
  DROP TABLE "seo_locales" CASCADE;
  DROP TABLE "liens_reseaux" CASCADE;
  DROP TABLE "liens" CASCADE;
  DROP TABLE "politique_sections_paragraphes" CASCADE;
  DROP TABLE "politique_sections" CASCADE;
  DROP TABLE "politique" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_solutions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_offres_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_clients_fk";
  
  DROP INDEX "_barometres_v_snapshot_idx";
  DROP INDEX "_barometres_v_published_locale_idx";
  DROP INDEX "payload_locked_documents_rels_solutions_id_idx";
  DROP INDEX "payload_locked_documents_rels_offres_id_idx";
  DROP INDEX "payload_locked_documents_rels_clients_id_idx";
  ALTER TABLE "_barometres_v" DROP COLUMN "snapshot";
  ALTER TABLE "_barometres_v" DROP COLUMN "published_locale";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "solutions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "offres_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "clients_id";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_solutions_key";
  DROP TYPE "public"."enum_solutions_pole";
  DROP TYPE "public"."enum_offres_status";
  DROP TYPE "public"."enum__offres_v_version_status";
  DROP TYPE "public"."enum__offres_v_published_locale";
  DROP TYPE "public"."enum__barometres_v_published_locale";
  DROP TYPE "public"."enum_accueil_poles_pole";`)
}
