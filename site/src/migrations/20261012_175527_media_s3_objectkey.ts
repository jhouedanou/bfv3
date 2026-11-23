import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Colonne ajoutée par le plugin S3 (actif seulement si S3_BUCKET est renseigné).
// Le RLS sans règle ferme l'API REST de Supabase (clé anon) ; Payload se connecte
// en tant que propriétaire des tables et n'est pas concerné.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;`)
  await db.execute(sql`
   DO $$ DECLARE r record; BEGIN
     FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND NOT rowsecurity AND tablename = lower(tablename) LOOP
       EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
     END LOOP;
   END $$;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP COLUMN "_objectkey";`)
}
