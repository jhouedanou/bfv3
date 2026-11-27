// Publication programmée des baromètres. Les pages sont générées au build : un baromètre daté
// du jour n'apparaît qu'après un nouveau build. Vercel Cron appelle cette route chaque matin
// (vercel.json) et elle déclenche le Deploy Hook du projet.
export default defineEventHandler(async (event) => {
  const { cronSecret, vercelDeployHook } = useRuntimeConfig(event)
  if (!cronSecret || getHeader(event, 'authorization') !== `Bearer ${cronSecret}`) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  const today = new Date().toISOString().slice(0, 10)
  const due = await queryCollection(event, 'barometres').where('published', '=', true).where('publishedAt', '=', today).all()
  if (!due.length) return { rebuilt: false, reason: 'aucune parution datée du jour' }
  if (!vercelDeployHook) throw createError({ statusCode: 500, statusMessage: 'NUXT_VERCEL_DEPLOY_HOOK manquant' })
  await $fetch(vercelDeployHook, { method: 'POST' })
  return { rebuilt: true, barometres: due.map((b) => b.identifiant) }
})
