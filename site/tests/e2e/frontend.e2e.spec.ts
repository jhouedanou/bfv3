import { expect, test } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'

test.describe('Site public', () => {
  test('accueil FR : title, H1, hreflang', async ({ page }) => {
    await page.goto(BASE)
    await expect(page).toHaveTitle(/Big Five — Conseil en Marketing/)
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
    for (const path of ['/', '/en', '/observatoire/telecoms-ci-2026-08', '/api/barometres?depth=1']) {
      const body = await (await request.get(`${BASE}${path}`)).text()
      expect(body, path).not.toContain('cutt.ly')
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
