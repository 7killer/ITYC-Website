# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: help-captures.spec.ts >> la calculatrice conserve la capture à gauche de ses explications
- Location: tests\visual\help-captures.spec.ts:5:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.help-illustrated.side').filter({ has: locator('img[src*="pena_simple_cal"]') })
Timeout: 10000ms
- Expected substring  - 1
+ Received string     + 2

- La partie supérieure
+ Réglez de l'énergie du skipper (stamina) %.Réglez la vitesse du vent (nds).Obtenez les temps de pénalité pour chaque type de manoeuvre (minutes et secondes).
+ Note: Ces données sont identiques à celles fournies pour la courbe.Régler la vitesse de votre bateau (nds).Obtenez pour chaque type de manoeuvre la distance perdue(miles nautiques).

Call log:
  - Expect "toContainText" locator('.help-illustrated.side').filter({ has: locator('img[src*="pena_simple_cal"]') }) with timeout 10000ms
  - waiting for locator('.help-illustrated.side').filter({ has: locator('img[src*="pena_simple_cal"]') })
    23 × locator resolved to <div data-image-position="left" class="help-illustrated side image-left custom-blocks">…</div>
       - unexpected value "Réglez de l'énergie du skipper (stamina) %.Réglez la vitesse du vent (nds).Obtenez les temps de pénalité pour chaque type de manoeuvre (minutes et secondes).
Note: Ces données sont identiques à celles fournies pour la courbe.Régler la vitesse de votre bateau (nds).Obtenez pour chaque type de manoeuvre la distance perdue(miles nautiques)."

```

```yaml
- figure:
  - link "Calculatrice de pénalité simple":
    - /url: /assets/help/penalties/PS/pena_simple_cal_b.png
    - img "Calculatrice de pénalité simple"
- paragraph: Réglez de l'énergie du skipper (stamina) %.
- paragraph: Réglez la vitesse du vent (nds).
- paragraph: Obtenez les temps de pénalité pour chaque type de manoeuvre (minutes et secondes).
- paragraph:
  - emphasis: "Note: Ces données sont identiques à celles fournies pour la courbe."
- paragraph: Régler la vitesse de votre bateau (nds).
- paragraph: Obtenez pour chaque type de manoeuvre la distance perdue(miles nautiques).
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test'
  2  | 
  3  | test.use({ viewport: { width: 1440, height: 1000 } })
  4  | 
  5  | test('la calculatrice conserve la capture à gauche de ses explications', async ({ page }, testInfo) => {
  6  |   await page.addInitScript(() => localStorage.setItem('theme', 'dark'))
  7  |   await page.goto('/#aide?article=tuto_pena')
  8  | 
  9  |   const calculator = page.locator('.help-illustrated.side').filter({
  10 |     has: page.locator('img[src*="pena_simple_cal"]'),
  11 |   })
  12 |   await expect(calculator).toHaveCount(1)
  13 |   await calculator.scrollIntoViewIfNeeded()
> 14 |   await expect(calculator).toContainText('La partie supérieure')
     |                            ^ Error: expect(locator).toContainText(expected) failed
  15 |   await expect(calculator).toContainText('winchs standard ou pro')
  16 | 
  17 |   const image = calculator.locator('figure img')
  18 |   await expect(image).toHaveAttribute('src', /pena_simple_cal_b\.png$/)
  19 |   await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  20 |   const imageLink = calculator.locator('figure a')
  21 |   await expect(imageLink).toHaveAttribute('href', await image.getAttribute('src') as string)
  22 |   await expect(imageLink).toHaveAttribute('target', '_blank')
  23 | 
  24 |   const placement = await calculator.evaluate((element) => {
  25 |     const figure = element.querySelector('figure')!.getBoundingClientRect()
  26 |     const paragraph = element.querySelector('p')!.getBoundingClientRect()
  27 |     return { imageRight: figure.right, textLeft: paragraph.left, imageTop: figure.top, textTop: paragraph.top }
  28 |   })
  29 |   expect(placement.imageRight).toBeLessThanOrEqual(placement.textLeft)
  30 |   expect(Math.abs(placement.imageTop - placement.textTop)).toBeLessThan(50)
  31 |   await calculator.screenshot({ path: testInfo.outputPath('calculatrice-penalite-dark.png'), animations: 'disabled' })
  32 | })
  33 | 
  34 | test('l’entête de flotte conserve la capture au-dessus du détail RT, Skipper et Team', async ({ page }, testInfo) => {
  35 |   await page.addInitScript(() => localStorage.setItem('theme', 'light'))
  36 |   await page.goto('/#aide?article=aide_dash')
  37 | 
  38 |   const fleetHeader = page.locator('.help-illustrated.below').filter({
  39 |     has: page.locator('img[src*="fleet_1."]'),
  40 |   })
  41 |   await expect(fleetHeader).toHaveCount(1)
  42 |   await fleetHeader.scrollIntoViewIfNeeded()
  43 |   await expect(fleetHeader).toContainText('RT : Ouvre un onglet de routage zezo')
  44 |   await expect(fleetHeader).toContainText('Team : Team du joueur.')
  45 |   await expect(fleetHeader).toContainText('Jaune : Top VSR')
  46 | 
  47 |   const image = fleetHeader.locator('figure img')
  48 |   await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  49 |   const placement = await fleetHeader.evaluate((element) => {
  50 |     const figure = element.querySelector('figure')!.getBoundingClientRect()
  51 |     const paragraph = element.querySelector('p')!.getBoundingClientRect()
  52 |     return { imageBottom: figure.bottom, textTop: paragraph.top }
  53 |   })
  54 |   expect(placement.imageBottom).toBeLessThanOrEqual(placement.textTop)
  55 |   await fleetHeader.screenshot({ path: testInfo.outputPath('entete-flotte-light.png'), animations: 'disabled' })
  56 | })
  57 | 
  58 | for (const article of ['tuto_pena', 'aide_energy', 'aide_dash']) {
  59 |   test(`${article} reste lisible sur un écran de 360 pixels`, async ({ page }, testInfo) => {
  60 |     await page.setViewportSize({ width: 360, height: 800 })
  61 |     await page.goto(`/#aide?article=${article}`)
  62 |     await expect(page.locator('.help-article')).toBeVisible()
  63 |     await expect(page.locator('.help-content-section').first()).toBeVisible()
  64 |     await page.evaluate(async () => { await document.fonts.ready })
  65 | 
  66 |     const overflow = await page.evaluate(() => ({
  67 |       viewport: document.documentElement.clientWidth,
  68 |       document: document.documentElement.scrollWidth,
  69 |       article: document.querySelector('.help-article')!.getBoundingClientRect().right,
  70 |     }))
  71 |     expect(overflow.document).toBeLessThanOrEqual(overflow.viewport + 1)
  72 |     expect(overflow.article).toBeLessThanOrEqual(overflow.viewport + 1)
  73 | 
  74 |     if (article === 'tuto_pena') {
  75 |       const calculator = page.locator('.help-illustrated.side').filter({ has: page.locator('img[src*="pena_simple_cal"]') })
  76 |       await calculator.scrollIntoViewIfNeeded()
  77 |       const placement = await calculator.evaluate((element) => {
  78 |         const image = element.querySelector('figure')!.getBoundingClientRect()
  79 |         const paragraph = element.querySelector('p')!.getBoundingClientRect()
  80 |         return { imageBottom: image.bottom, textTop: paragraph.top }
  81 |       })
  82 |       expect(placement.imageBottom).toBeLessThanOrEqual(placement.textTop)
  83 |       await calculator.screenshot({ path: testInfo.outputPath('calculatrice-penalite-mobile.png'), animations: 'disabled' })
  84 |     }
  85 |   })
  86 | }
  87 | 
```