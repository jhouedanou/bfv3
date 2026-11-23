import { expect, test } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const TRACKERS = /googletagmanager\.com|google-analytics\.com|facebook\.net|facebook\.com/

// Ces tests demandent un build fait avec NEXT_PUBLIC_GA_ID et NEXT_PUBLIC_META_PIXEL_ID.
test.describe('Cookies et mesure d’audience', () => {
  test.beforeEach(async ({ page }) => {
    // Aucune requête ne doit vraiment partir vers Google ou Meta pendant les tests.
    await page.route(TRACKERS, (route) => route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }))
    await page.goto(BASE)
    // Le bandeau s'affiche après l'hydratation de la page.
    await page.locator('.ck').waitFor({ timeout: 4000 }).catch(() => undefined)
    test.skip((await page.locator('.ck').count()) === 0, 'identifiants de mesure absents du build')
  })

  test('aucun script Google ou Meta avant l’accord, ni après un refus', async ({ page }) => {
    const hits: string[] = []
    page.on('request', (r) => TRACKERS.test(r.url()) && hits.push(r.url()))
    await page.reload()
    await expect(page.locator('.ck')).toBeVisible()
    await page.waitForLoadState('networkidle')
    expect(hits).toEqual([])
    await page.locator('.ck button', { hasText: 'Refuser' }).click()
    await expect(page.locator('.ck')).toHaveCount(0)
    await page.reload()
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.ck')).toHaveCount(0)
    expect(hits).toEqual([])
  })

  test('Accepter charge les deux scripts et envoie les signaux Consent Mode v2', async ({ page }) => {
    const hits: string[] = []
    page.on('request', (r) => TRACKERS.test(r.url()) && hits.push(r.url()))
    await page.locator('.ck button', { hasText: 'Accepter' }).click()
    await expect.poll(() => hits.some((u) => u.includes('googletagmanager.com/gtag/js'))).toBe(true)
    await expect.poll(() => hits.some((u) => u.includes('connect.facebook.net'))).toBe(true)
    const update = await page.evaluate(() =>
      (window.dataLayer as ArrayLike<unknown>[]).map((a) => Array.from(a)).find((a) => a[0] === 'consent' && a[1] === 'update'),
    )
    expect(update?.[2]).toEqual({
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    })
  })

  test('Personnaliser : audience seule, sans Meta', async ({ page }) => {
    const hits: string[] = []
    page.on('request', (r) => TRACKERS.test(r.url()) && hits.push(r.url()))
    await page.locator('.ck button', { hasText: 'Personnaliser' }).click()
    await page.locator('.ck__opt', { hasText: 'Google Analytics' }).locator('input').check()
    await page.locator('.ck button', { hasText: 'Enregistrer mes choix' }).click()
    await expect.poll(() => hits.some((u) => u.includes('googletagmanager.com'))).toBe(true)
    expect(hits.some((u) => u.includes('facebook'))).toBe(false)
  })

  test('Refuser et Accepter ont le même style', async ({ page }) => {
    const style = (name: string) =>
      page.locator('.ck button', { hasText: name }).evaluate((el) => {
        const s = getComputedStyle(el)
        return [s.backgroundColor, s.color, s.fontSize, s.fontWeight, s.height].join('|')
      })
    expect(await style('Refuser')).toBe(await style('Accepter'))
  })
})
