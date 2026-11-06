import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 1440, height: 1000 } })

// Keep the original migration case from tuto_pena.html independent of later
// editorial changes. The live calculator is also exercised below, unmodified.
const legacyCalculatorMarkdown = `# Tutoriel pénalités

## Calculatrice de pénalité simple

Elle est composé de 2 fonctions :

:::figure side
![Calculatrice de pénalité simple](/assets/help/penalties/PS/pena_simple_cal.png)

La partie supérieure vous permet de connaître le temps de pénalité pour une vitesse de vent donnée.

Cette vitesse peut être réglée à l'aide de l'ascenseur, des flèches de votre clavier ou vous pouvez la saisir directement (séparateur des décimales ',' ou '.').

En dessous vous obtiendrez le temps de pénalité pour chaque type de manoeuvre en secondes et en minutes.

Notez que ces données sont identiques à celles fournies pour la courbe, elles sont donc données pour la valeur d'energie entrée.

---

La partie inférieure est une extension de la partie supérieure permettant d'approximer la distance perdues lors d'une manoeuvre à une vitesse de bateau donnée à une vitesse de vents données.

Tout comme la vitesse du vent, cette valeur peut être réglée à l'aide de l'ascenseur, des flèches de votre clavier ou vous pouvez la saisir directement (séparateur des décimales ',' ou '.').

En dessous vous obtiendrez la distance pour chaque type de manoeuvre la distance perdue ( miles nautiques ) suivant si vous êtes équipés des winchs standard ou pro.
:::
`

test('la calculatrice conserve la capture à gauche de ses explications', async ({ page }, testInfo) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'))
  await page.route('**/content/fr/tuto_pena.md?*', async route => {
    if (!new URL(route.request().url()).searchParams.has('raw')) return route.continue()
    const response = await route.fetch()
    await route.fulfill({ response, body: `export default ${JSON.stringify(legacyCalculatorMarkdown)}` })
  })
  await page.goto('/#aide?article=tuto_pena')

  const calculator = page.locator('.help-illustrated.side').filter({
    has: page.locator('img[src*="pena_simple_cal"]'),
  })
  await expect(calculator).toHaveCount(1)
  await calculator.scrollIntoViewIfNeeded()
  await expect(calculator).toContainText('La partie supérieure')
  await expect(calculator).toContainText('winchs standard ou pro')

  const image = calculator.locator('figure img')
  await expect(image).toHaveAttribute('src', /pena_simple_cal_b\.png$/)
  await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  const imageLink = calculator.locator('figure a')
  await expect(imageLink).toHaveAttribute('href', await image.getAttribute('src') as string)
  await expect(imageLink).toHaveAttribute('target', '_blank')

  const placement = await calculator.evaluate((element) => {
    const figure = element.querySelector('figure')!.getBoundingClientRect()
    const paragraph = element.querySelector('p')!.getBoundingClientRect()
    return { imageRight: figure.right, textLeft: paragraph.left, imageTop: figure.top, textTop: paragraph.top }
  })
  expect(placement.imageRight).toBeLessThanOrEqual(placement.textLeft)
  expect(Math.abs(placement.imageTop - placement.textTop)).toBeLessThan(50)
  await calculator.screenshot({ path: testInfo.outputPath('calculatrice-penalite-dark.png'), animations: 'disabled' })
})

test('la calculatrice du document courant conserve ses cinq parties à droite de la capture', async ({ page }, testInfo) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'))
  await page.goto('/#aide?article=tuto_pena')

  const calculator = page.locator('.help-illustrated.side').filter({
    has: page.locator('img[src*="/penalties/PS/pena_simple_cal"]'),
  })
  await expect(calculator).toHaveCount(1)
  await expect(calculator).toHaveClass(/custom-blocks/)
  await calculator.scrollIntoViewIfNeeded()

  const image = calculator.locator('figure img')
  await expect(image).toHaveAttribute('src', /\/penalties\/PS\/pena_simple_cal_b\.png$/)
  await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  await image.evaluate(element => (element as HTMLImageElement).decode())
  await page.evaluate(async () => { await document.fonts.ready })

  const imageLink = calculator.locator('figure a')
  await expect(imageLink).toHaveAttribute('href', await image.getAttribute('src') as string)
  await expect(imageLink).toHaveAttribute('target', '_blank')

  const parts = calculator.locator('.help-explanation-part')
  await expect(parts).toHaveCount(5)
  for (const part of await parts.all()) {
    await expect(part).toBeVisible()
    await expect(part).toHaveText(/\S/)
  }

  const placement = await calculator.evaluate(element => {
    const figure = element.querySelector('figure')!.getBoundingClientRect()
    const explanation = element.querySelector('.help-figure-explanation')!.getBoundingClientRect()
    return { imageRight: figure.right, textLeft: explanation.left, imageTop: figure.top, textTop: explanation.top }
  })
  expect(placement.imageRight).toBeLessThanOrEqual(placement.textLeft)
  expect(Math.abs(placement.imageTop - placement.textTop)).toBeLessThan(50)
  await calculator.screenshot({ path: testInfo.outputPath('calculatrice-penalite-document-courant.png'), animations: 'disabled' })
})

test('l’entête de flotte conserve la capture au-dessus du détail RT, Skipper et Team', async ({ page }, testInfo) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'light'))
  await page.goto('/#aide?article=aide_dash')

  const fleetHeader = page.locator('.help-illustrated.below').filter({
    has: page.locator('img[src*="fleet_1."]'),
  })
  await expect(fleetHeader).toHaveCount(1)
  await fleetHeader.scrollIntoViewIfNeeded()
  const fleetDetails = fleetHeader.locator('xpath=following-sibling::*[1]')
  await expect(fleetDetails).toHaveClass(/\bhelp-illustrated\b.*\brows\b/)
  for (const text of [
    'RT : Ouvre un onglet de routage avec les coordonnées et les options pré remplies.',
    'Skipper : Puce Nom du bateau.',
    'Team : Team du joueur.',
    'Jaune : Top VSR',
  ]) {
    await expect(fleetDetails.getByText(text, { exact: true })).toBeVisible()
  }

  const image = fleetHeader.locator('figure img')
  await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  const imageBottom = await fleetHeader.locator('figure').evaluate(element => element.getBoundingClientRect().bottom)
  const textTop = await fleetDetails.locator('.help-figure-explanation').evaluate(element => element.getBoundingClientRect().top)
  expect(imageBottom).toBeLessThanOrEqual(textTop)
  await fleetHeader.screenshot({ path: testInfo.outputPath('entete-flotte-light.png'), animations: 'disabled' })
})

for (const article of ['tuto_pena', 'aide_energy', 'aide_dash']) {
  test(`${article} reste lisible sur un écran de 360 pixels`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await page.goto(`/#aide?article=${article}`)
    await expect(page.locator('.help-article')).toBeVisible()
    await expect(page.locator('.help-content-section').first()).toBeVisible()
    await page.evaluate(async () => { await document.fonts.ready })

    const overflow = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      article: document.querySelector('.help-article')!.getBoundingClientRect().right,
    }))
    expect(overflow.document).toBeLessThanOrEqual(overflow.viewport + 1)
    expect(overflow.article).toBeLessThanOrEqual(overflow.viewport + 1)

    if (article === 'tuto_pena') {
      const calculator = page.locator('.help-illustrated.side').filter({ has: page.locator('img[src*="pena_simple_cal"]') })
      await calculator.scrollIntoViewIfNeeded()
      const placement = await calculator.evaluate((element) => {
        const image = element.querySelector('figure')!.getBoundingClientRect()
        const paragraph = element.querySelector('p')!.getBoundingClientRect()
        return { imageBottom: image.bottom, textTop: paragraph.top }
      })
      expect(placement.imageBottom).toBeLessThanOrEqual(placement.textTop)
      await calculator.screenshot({ path: testInfo.outputPath('calculatrice-penalite-mobile.png'), animations: 'disabled' })
    }
  })
}
