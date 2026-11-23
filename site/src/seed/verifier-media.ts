// Vérifie que chaque fiche Media a son fichier dans le bucket S3, et renvoie l'image d'origine
// (public/images ou seed/files) quand il manque. Usage : pnpm media:verifier
// Le 12/10/2026, 35 envois du seed n'avaient jamais atteint Supabase, sans erreur affichée.
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { createRequire } from 'module'
import config from '@payload-config'
import { getPayload } from 'payload'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const { HeadObjectCommand, S3Client } = createRequire(import.meta.url)(path.resolve(dirname, '../..', 'node_modules/.pnpm/@aws-sdk+client-s3@3.1149.0/node_modules/@aws-sdk/client-s3'))
const PUBLIC = path.resolve(dirname, '../../public/images')
const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  forcePathStyle: true,
  credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID!, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY! },
})
const exists = async (key: string) => s3.send(new HeadObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key })).then(() => true, () => false)

const payload = await getPayload({ config })

// Source d'une fiche : public/images/<nom>, ou clients/<nom> ; « cover-4 » = copie de cover-1 (image de partage)
const source = (filename: string) => {
  const candidates = [filename, filename.replace(/-\d+(\.\w+)$/, '$1')]
  for (const c of candidates) for (const dir of ['', 'clients']) {
    const p = path.join(PUBLIC, dir, c)
    if (fs.existsSync(p)) return p
  }
  return filename.startsWith('cover-') ? path.join(PUBLIC, 'cover-1.jpg') : null
}

const all = await payload.find({ collection: 'media', limit: 200, depth: 0, sort: 'id' })
let repaired = 0
const missing: string[] = []
for (const d of all.docs) {
  const keys = [d.filename, (d.sizes as { card?: { filename?: string | null } } | undefined)?.card?.filename].filter(Boolean) as string[]
  const ok = (await Promise.all(keys.map(exists))).every(Boolean)
  if (ok) continue
  const src = d.filename?.startsWith('baro-') ? path.resolve(dirname, 'files', d.filename) : source(d.filename ?? '')
  if (!src || !fs.existsSync(src)) { missing.push(`${d.id} ${d.filename} (source introuvable)`); continue }
  // Copie sous le nom exact de la fiche, pour que l'adresse de l'image ne change pas.
  const tmp = path.join(fs.mkdtempSync(path.join(process.env.TMPDIR ?? '/tmp', 'media-')), d.filename!)
  fs.copyFileSync(src, tmp)
  const upd = await payload.update({ collection: 'media', id: d.id, data: {}, filePath: tmp, overwriteExistingFiles: true })
  const keys2 = [upd.filename, (upd.sizes as { card?: { filename?: string | null } } | undefined)?.card?.filename].filter(Boolean) as string[]
  const ok2 = (await Promise.all(keys2.map(exists))).every(Boolean)
  if (ok2) repaired++
  else missing.push(`${d.id} ${upd.filename} (toujours absent après envoi)`)
}
console.log(`fiches : ${all.docs.length} | réparées : ${repaired} | problèmes : ${missing.length}`)
missing.forEach((m) => console.log('  -', m))
process.exit(0)
