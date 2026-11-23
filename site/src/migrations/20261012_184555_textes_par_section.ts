import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "textes_accueil" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "textes_accueil_locales" (
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
  	"ey_ref" varchar,
  	"ref_title" varchar,
  	"ref_sub" varchar,
  	"client_logo" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "textes_observatoire" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "textes_observatoire_locales" (
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
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "textes_contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "textes_contact_locales" (
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
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "textes_formulaires" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "textes_formulaires_locales" (
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
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "textes_divers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "textes_divers_locales" (
  	"rights" varchar,
  	"legal" varchar,
  	"privacy" varchar,
  	"privacy_updated" varchar,
  	"privacy_intro" varchar,
  	"privacy_contact" varchar,
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
  
  ALTER TABLE "textes_accueil_locales" ADD CONSTRAINT "textes_accueil_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."textes_accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "textes_observatoire_locales" ADD CONSTRAINT "textes_observatoire_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."textes_observatoire"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "textes_contact_locales" ADD CONSTRAINT "textes_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."textes_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "textes_formulaires_locales" ADD CONSTRAINT "textes_formulaires_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."textes_formulaires"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "textes_divers_locales" ADD CONSTRAINT "textes_divers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."textes_divers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "textes_accueil_locales_locale_parent_id_unique" ON "textes_accueil_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "textes_observatoire_locales_locale_parent_id_unique" ON "textes_observatoire_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "textes_contact_locales_locale_parent_id_unique" ON "textes_contact_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "textes_formulaires_locales_locale_parent_id_unique" ON "textes_formulaires_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "textes_divers_locales_locale_parent_id_unique" ON "textes_divers_locales" USING btree ("_locale","_parent_id");`)
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
   DROP TABLE "textes_accueil" CASCADE;
  DROP TABLE "textes_accueil_locales" CASCADE;
  DROP TABLE "textes_observatoire" CASCADE;
  DROP TABLE "textes_observatoire_locales" CASCADE;
  DROP TABLE "textes_contact" CASCADE;
  DROP TABLE "textes_contact_locales" CASCADE;
  DROP TABLE "textes_formulaires" CASCADE;
  DROP TABLE "textes_formulaires_locales" CASCADE;
  DROP TABLE "textes_divers" CASCADE;
  DROP TABLE "textes_divers_locales" CASCADE;`)
}
