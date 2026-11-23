import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "solutions_locales" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "barometres" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "_barometres_v" ADD COLUMN "version_meta_title" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "solutions_locales" DROP COLUMN "meta_title";
  ALTER TABLE "barometres" DROP COLUMN "meta_title";
  ALTER TABLE "_barometres_v" DROP COLUMN "version_meta_title";`)
}
