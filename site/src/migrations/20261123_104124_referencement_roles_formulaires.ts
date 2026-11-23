import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  ALTER TABLE "demandes" ADD COLUMN "ip_hash" varchar;
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'editor' NOT NULL;
  -- Les comptes créés avant l'arrivée des rôles avaient tous les droits : ils restent administrateurs.
  UPDATE "users" SET "role" = 'admin';
  ALTER TABLE "textes_observatoire_locales" ADD COLUMN "baros_h1" varchar;
  ALTER TABLE "textes_observatoire_locales" ADD COLUMN "baros_meta_title" varchar;
  ALTER TABLE "textes_contact_locales" ADD COLUMN "err_rate" varchar;
  ALTER TABLE "textes_formulaires_locales" ADD COLUMN "ack_subject" varchar;
  ALTER TABLE "textes_formulaires_locales" ADD COLUMN "ack_body" varchar;
  ALTER TABLE "textes_formulaires_locales" ADD COLUMN "ack_notify_subject" varchar;
  ALTER TABLE "textes_formulaires_locales" ADD COLUMN "ack_notify_body" varchar;
  ALTER TABLE "textes_divers_locales" ADD COLUMN "ck_text" varchar;
  ALTER TABLE "textes_divers_locales" ADD COLUMN "ck_accept" varchar;
  ALTER TABLE "textes_divers_locales" ADD COLUMN "ck_refuse" varchar;
  ALTER TABLE "textes_divers_locales" ADD COLUMN "ck_custom" varchar;
  ALTER TABLE "textes_divers_locales" ADD COLUMN "ck_more" varchar;
  ALTER TABLE "textes_divers_locales" ADD COLUMN "ck_manage" varchar;
  ALTER TABLE "textes_divers_locales" ADD COLUMN "ck_title" varchar;
  ALTER TABLE "textes_divers_locales" ADD COLUMN "ck_needed" varchar;
  ALTER TABLE "textes_divers_locales" ADD COLUMN "ck_needed_desc" varchar;
  ALTER TABLE "textes_divers_locales" ADD COLUMN "ck_audience" varchar;
  ALTER TABLE "textes_divers_locales" ADD COLUMN "ck_audience_desc" varchar;
  ALTER TABLE "textes_divers_locales" ADD COLUMN "ck_ads" varchar;
  ALTER TABLE "textes_divers_locales" ADD COLUMN "ck_ads_desc" varchar;
  ALTER TABLE "textes_divers_locales" ADD COLUMN "ck_save" varchar;
  ALTER TABLE "parametres" ADD COLUMN "telephone" varchar;
  ALTER TABLE "parametres" ADD COLUMN "adresse" varchar;
  CREATE INDEX "demandes_ip_hash_idx" ON "demandes" USING btree ("ip_hash");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "demandes_ip_hash_idx";
  ALTER TABLE "demandes" DROP COLUMN "ip_hash";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "textes_observatoire_locales" DROP COLUMN "baros_h1";
  ALTER TABLE "textes_observatoire_locales" DROP COLUMN "baros_meta_title";
  ALTER TABLE "textes_contact_locales" DROP COLUMN "err_rate";
  ALTER TABLE "textes_formulaires_locales" DROP COLUMN "ack_subject";
  ALTER TABLE "textes_formulaires_locales" DROP COLUMN "ack_body";
  ALTER TABLE "textes_formulaires_locales" DROP COLUMN "ack_notify_subject";
  ALTER TABLE "textes_formulaires_locales" DROP COLUMN "ack_notify_body";
  ALTER TABLE "textes_divers_locales" DROP COLUMN "ck_text";
  ALTER TABLE "textes_divers_locales" DROP COLUMN "ck_accept";
  ALTER TABLE "textes_divers_locales" DROP COLUMN "ck_refuse";
  ALTER TABLE "textes_divers_locales" DROP COLUMN "ck_custom";
  ALTER TABLE "textes_divers_locales" DROP COLUMN "ck_more";
  ALTER TABLE "textes_divers_locales" DROP COLUMN "ck_manage";
  ALTER TABLE "textes_divers_locales" DROP COLUMN "ck_title";
  ALTER TABLE "textes_divers_locales" DROP COLUMN "ck_needed";
  ALTER TABLE "textes_divers_locales" DROP COLUMN "ck_needed_desc";
  ALTER TABLE "textes_divers_locales" DROP COLUMN "ck_audience";
  ALTER TABLE "textes_divers_locales" DROP COLUMN "ck_audience_desc";
  ALTER TABLE "textes_divers_locales" DROP COLUMN "ck_ads";
  ALTER TABLE "textes_divers_locales" DROP COLUMN "ck_ads_desc";
  ALTER TABLE "textes_divers_locales" DROP COLUMN "ck_save";
  ALTER TABLE "parametres" DROP COLUMN "telephone";
  ALTER TABLE "parametres" DROP COLUMN "adresse";
  DROP TYPE "public"."enum_users_role";`)
}
