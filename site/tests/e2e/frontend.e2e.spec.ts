import { expect, test } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'

test.describe('Site public', () => {
  test('accueil FR : title, H1, hreflang', async ({ page }) => {
    await page.goto(BASE)
    await expect(page).toHaveTitle('BIG FIVE | Cabinet de conseil en marketing digital à Abidjan')
    await expect(page.locator('h1')).toContainText('Maîtriser le digital')
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1)
  })

  test('accueil EN', async ({ page }) => {
    await page.goto(`${BASE}/en`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('h1')).toContainText('Mastering digital')
  })

  test('le lien interne du baromètre ne fuit jamais (CDC § 6.2)', async ({ request }) => {
    for (const path of ['/', '/en', '/barometres', '/barometres/telecoms-ci-2026-08', '/api/barometres?depth=1']) {
      const body = await (await request.get(`${BASE}${path}`)).text()
      expect(body, path).not.toContain('ressourceInterne')
    }
  })

  test('aucun texte sous 13 px à 1366 px', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 })
    await page.goto(BASE)
    const min = await page.evaluate(() => {
      let m = Infinity
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      let n: Node | null
      while ((n = w.nextNode())) {
        const el = n.parentElement
        if (!n.textContent?.trim() || !el || el.closest('.sr-only,.hp,[aria-hidden="true"]')) continue
        if (el.getBoundingClientRect().width === 0) continue
        m = Math.min(m, parseFloat(getComputedStyle(el).fontSize))
      }
      return m
    })
    expect(min).toBeGreaterThanOrEqual(13)
  })

  test('à 375 px : aucun débordement horizontal, aucun texte sous 13 px, un seul H1', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 740 })
    for (const path of [
      '/',
      '/solutions/solutions-digitales',
      '/solutions/solutions-digitales/creation-de-site-web',
      '/barometres',
      '/barometres/telecoms-ci-2026-08',
    ]) {
      await page.goto(`${BASE}${path}`)
      const r = await page.evaluate(() => {
        let min = Infinity
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
        let n: Node | null
        while ((n = w.nextNode())) {
          const el = n.parentElement
          if (!n.textContent?.trim() || !el || el.closest('.sr-only,.hp,[aria-hidden="true"]')) continue
          if (el.getBoundingClientRect().width === 0) continue
          min = Math.min(min, parseFloat(getComputedStyle(el).fontSize))
        }
        const root = document.documentElement
        return { min, overflow: root.scrollWidth - root.clientWidth, h1: document.querySelectorAll('h1').length }
      })
      expect(r.overflow, path).toBe(0)
      expect(r.min, path).toBeGreaterThanOrEqual(13)
      expect(r.h1, path).toBe(1)
    }
  })

  test('adresses traduites et anciennes adresses', async ({ request }) => {
    const get = (p: string) => request.get(`${BASE}${p}`, { maxRedirects: 0 })
    expect((await get('/en/barometers')).status()).toBe(200)
    expect((await get('/en/privacy-policy')).status()).toBe(200)
    const old = await get('/en/barometres')
    expect(old.status()).toBe(301)
    expect(old.headers().location).toContain('/en/barometers')
    const obs = await get('/observatoire/telecoms-ci-2026-08')
    expect(obs.status()).toBe(301)
    expect(obs.headers().location).toContain('/barometres/telecoms-ci-2026-08')
    expect((await get('/adresse-inconnue')).status()).toBe(404)
  })

  test('sitemap : XML, liste des baromètres, aucune offre non validée', async ({ request }) => {
    const r = await request.get(`${BASE}/sitemap.xml`)
    expect(r.headers()['content-type']).toContain('xml')
    const xml = await r.text()
    expect(xml).toContain('/barometres</loc>')
    expect(xml).toContain('/en/privacy-policy</loc>')
    expect(xml).not.toContain('/creation-de-site-web')
    const robots = await (await request.get(`${BASE}/robots.txt`)).text()
    expect(robots).toContain('Sitemap: ')
  })

  test('redirections', async ({ request }) => {
    const r = await request.get(`${BASE}/thank-you`, { maxRedirects: 0 })
    expect(r.status()).toBe(301)
    const fr = await request.get(`${BASE}/fr`, { maxRedirects: 0 })
    expect(fr.status()).toBe(301)
  })
  test('page d’offre : texte rendu par le serveur, hreflang, hors index tant que non validée', async ({ request }) => {
    const r = await request.get(`${BASE}/solutions/solutions-digitales/creation-de-site-web`)
    expect(r.status()).toBe(200)
    const html = await r.text()
    expect(html).toContain('<h1 class="h2 offre__title">Création de sites web</h1>')
    expect(html).toContain('hrefLang="en" href="')
    expect(html).toContain('/en/solutions/digital-solutions/website-creation')
    expect(html).toContain('"@type":"FAQPage"')
    expect(html).toMatch(/<meta name="robots" content="noindex/)
  })

  test('la fiche d’une solution a son adresse, et Retour la ferme', async ({ page }) => {
    await page.goto(`${BASE}/`)
    await page.locator('a.pave').nth(3).click()
    await expect(page.locator('.dlg--solution')).toBeVisible()
    await expect(page).toHaveURL(/\/solutions\/solutions-digitales$/)
    await page.goBack()
    await expect(page.locator('.dlg--solution')).toHaveCount(0)
    await expect(page).toHaveURL(`${BASE}/`)
  })
})
