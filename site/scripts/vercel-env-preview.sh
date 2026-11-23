#!/usr/bin/env bash
# Copie les variables renseignées de site/.env dans l'environnement Preview de Vercel.
# Usage (depuis site/) : bash scripts/vercel-env-preview.sh
# NEXT_PUBLIC_SITE_URL n'est pas copiée : en preview, les URL restent relatives.
set -uo pipefail
cd "$(dirname "$0")/.."

for k in DATABASE_URL DATABASE_MIGRATE_URL PAYLOAD_SECRET S3_BUCKET S3_ENDPOINT S3_REGION S3_ACCESS_KEY_ID S3_SECRET_ACCESS_KEY \
         RESEND_API_KEY MAIL_FROM NEXT_PUBLIC_TURNSTILE_SITE_KEY TURNSTILE_SECRET_KEY CRON_SECRET; do
  v=$(grep "^$k=" .env | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//' || true)
  if [ -z "$v" ]; then echo "$k : vide, ignorée"; continue; fi
  # --yes : toutes les branches de preview ; --force : remplace une valeur existante
  if out=$(printf '%s' "$v" | npx vercel@latest env add "$k" preview --yes --force 2>&1); then
    echo "$k : ok"
  else
    echo "$k : ÉCHEC"; echo "$out" | grep -iE 'error|erreur' | head -3
  fi
done
