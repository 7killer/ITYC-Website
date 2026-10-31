import { expect, test, type Locator, type Page } from '@playwright/test'

type FigureFixture = { directive: string; image: string; parts: string[] }
const fourBlocks: FigureFixture = {
  directive: 'side image=left width=75% blocks=10%,30%,30%,30%',
  image: '/assets/help/penalties/pena_vueensemble.png',
  parts: ['Sélection du bateau.', 'Pénalités simples.', "Rentabilité d'une manoeuvre.", 'Pénalités doubles.'],
}
// Reproduction of the five-block example supplied by the user. Keeping this in
// the test lets the documentation evolve without changing the regression case.
const fiveBlocks: FigureFixture = {
  directive: 'side image=left width=75% blocks=4%,3%,31%,31%,31%',
  image: '/assets/help/penalties/pena_vueensemble.png',
  parts: ["Sélection du bateau et mode d'affichage.", 'Sélection des options.', 'Pénalités simples.', "Rentabilité d'une manoeuvre.", 'Pénalités doubles.'],
}
const additionalText = ' Ce complément explique en détail la sélection du bateau et les informations affichées.'.repeat(12)

test.use({ viewport: { width: 1440, height: 1100 } })

async function openFixture(page: Page, fixture: FigureFixture, locale: 'fr' | 'en' = 'fr', documentId = 'tuto_pena') {
  let intercepted = false
  const markdown = `# Figure options fixture\n\n## Capture\n\n:::figure ${fixture.directive}\n![Vue d'ensemble](${fixture.image})\n\n${fixture.parts.join('\n\n---\n\n')}\n:::\n`
  await page.route(`**/content/${locale}/${documentId}.md?*`, async route => {
    if (!new URL(route.request().url()).searchParams.has('raw')) return route.continue()
    const response = await route.fetch()
    await route.fulfill({ response, body: `export default ${JSON.stringify(markdown)}` })
    intercepted = true
  })
  await page.goto(`/#aide?article=${documentId}`)
  if (locale === 'en') await page.getByRole('button', { name: 'English', exact: true }).click()
  await expect.poll(() => intercepted, { message: 'la fixture Markdown ?raw a été chargée' }).toBe(true)
  const figure = page.locator('.help-illustrated').filter({ has: page.locator(`img[src*="${fixture.image.split('/').at(-1)!.replace('.png', '')}"]`) })
  await readyFigure(page, figure)
  return figure
}

async function readyFigure(page: Page, figure: Locator) {
  await expect(figure).toHaveCount(1)
  await figure.scrollIntoViewIfNeeded()
  const image = figure.locator('figure img')
  await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  await image.evaluate(element => (element as HTMLImageElement).decode())
  await page.evaluate(async () => { await document.fonts.ready })
}

async function geometry(figure: Locator) {
  return figure.evaluate(element => {
    const box = (node: Element) => {
      const rect = node.getBoundingClientRect()
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height }
    }
    const image = element.querySelector('img')!
    return {
      wrapper: box(element),
      frame: box(element.querySelector('figure')!),
      image: box(image),
      naturalImage: { width: image.naturalWidth, height: image.naturalHeight },
      explanation: box(element.querySelector('.help-figure-explanation')!),
      parts: [...element.querySelectorAll('.help-explanation-part')].map(part => ({ ...box(part), contentHeight: part.scrollHeight, visibleHeight: part.clientHeight })),
    }
  })
}

async function expectCustomHeights(figure: Locator, ratios = [0.1, 0.3, 0.3, 0.3]) {
  await expect(figure).toHaveClass(/custom-blocks/)
  await expect.poll(async () => {
    const layout = await geometry(figure)
    return Math.abs(layout.explanation.height - layout.image.height)
  }).toBeLessThan(3)
  const layout = await geometry(figure)
  expect(layout.parts).toHaveLength(ratios.length)
  expect(Math.abs(layout.wrapper.height - layout.image.height)).toBeLessThan(3)
  expect(Math.abs(layout.frame.height - layout.image.height)).toBeLessThan(3)
  expect(Math.abs(layout.image.height - layout.image.width * layout.naturalImage.height / layout.naturalImage.width), 'le ratio naturel de la capture est conservé').toBeLessThan(1)
  for (const [index, ratio] of ratios.entries()) {
    expect(Math.abs(layout.parts[index].height - layout.frame.height * ratio), `hauteur du bloc ${index + 1}`).toBeLessThan(3)
  }
  expect(Math.abs(layout.parts[0].top - layout.image.top)).toBeLessThan(3)
  expect(Math.abs(layout.parts.at(-1)!.bottom - layout.image.bottom)).toBeLessThan(3)
  return layout
}

async function expectMobileFlow(page: Page, figure: Locator) {
  const layout = await geometry(figure)
  expect(layout.image.bottom).toBeLessThanOrEqual(layout.explanation.top)
  for (let index = 0; index < layout.parts.length; index++) {
    expect(layout.parts[index].contentHeight).toBeLessThanOrEqual(layout.parts[index].visibleHeight + 1)
    if (index) expect(layout.parts[index - 1].bottom).toBeLessThanOrEqual(layout.parts[index].top)
  }
  const width = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }))
  expect(width.document).toBeLessThanOrEqual(width.viewport + 1)
  return layout
}

test('la capture à gauche occupe 75% avec quatre blocs de hauteurs 10/30/30/30', async ({ page }, testInfo) => {
  const figure = await openFixture(page, fourBlocks)
  await expect(figure).toHaveAttribute('data-image-position', 'left')
  await expect(figure.locator('.help-explanation-part')).toHaveText(fourBlocks.parts)
  const layout = await expectCustomHeights(figure)
  expect(layout.frame.right).toBeLessThanOrEqual(layout.explanation.left)
  expect(layout.frame.width / layout.wrapper.width).toBeCloseTo(0.75, 2)
  await figure.screenshot({ path: testInfo.outputPath('capture-options-gauche.png'), animations: 'disabled' })
})

test('les mêmes options sont prises en compte dans la documentation anglaise', async ({ page }) => {
  const figure = await openFixture(page, { ...fourBlocks, parts: ['Boat selection.', 'Single penalties.', 'Manoeuvre profitability.', 'Double penalties.'] }, 'en')
  await expect(figure).toHaveAttribute('data-image-position', 'left')
  await expectCustomHeights(figure)
})

test('image=right place la capture à droite sans changer sa largeur ni les hauteurs', async ({ page }, testInfo) => {
  const figure = await openFixture(page, { ...fourBlocks, directive: fourBlocks.directive.replace('image=left', 'image=right') })
  await expect(figure).toHaveAttribute('data-image-position', 'right')
  await expect(figure.locator('.help-explanation-part')).toHaveText(fourBlocks.parts)
  const layout = await expectCustomHeights(figure)
  expect(layout.explanation.right).toBeLessThanOrEqual(layout.frame.left)
  expect(layout.frame.width / layout.wrapper.width).toBeCloseTo(0.75, 2)
  await figure.screenshot({ path: testInfo.outputPath('capture-options-droite.png'), animations: 'disabled' })
})

for (const position of ['left', 'right']) {
  test(`sur mobile image=${position} empile la capture puis tout le texte avec des hauteurs libres`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    const fixture = { ...fourBlocks, directive: fourBlocks.directive.replace('image=left', `image=${position}`), parts: [fourBlocks.parts[0] + additionalText, ...fourBlocks.parts.slice(1)] }
    const figure = await openFixture(page, fixture)
    await expect(figure).toHaveAttribute('data-image-position', position)
    await expect(figure.locator('.help-explanation-part')).toHaveText(fixture.parts)
    const layout = await expectMobileFlow(page, figure)
    expect(layout.parts[0].height).toBeGreaterThan(layout.image.height * 0.1)
  })
}

for (const [preset, ratio] of [['wide', 0.75], ['half', 0.5]] as const) {
  test(`l’ancien format ${preset} reste compatible avec image=right`, async ({ page }) => {
    const figure = await openFixture(page, { ...fourBlocks, directive: `side ${preset} image=right` })
    await expect(figure).toHaveClass(new RegExp(`\\b${preset}\\b`))
    await expect(figure).toHaveAttribute('data-image-position', 'right')
    await expect(figure.locator('.help-explanation-part')).toHaveText(fourBlocks.parts)
    const layout = await geometry(figure)
    expect(layout.explanation.right).toBeLessThanOrEqual(layout.frame.left)
    expect(Math.abs(layout.frame.width / layout.wrapper.width - ratio)).toBeLessThan(0.035)
  })
}

test('width=80% sur une capture au-dessus du texte garde son comportement', async ({ page }) => {
  const figure = await openFixture(page, { directive: 'below width=80%', image: '/assets/help/penalties/tuto/pena_ref_curve_vr.png', parts: ['Courbe de référence.'] }, 'fr', 'aide_pena')
  const layout = await geometry(figure)
  expect(layout.frame.width / layout.wrapper.width).toBeCloseTo(0.8, 2)
  await expect(figure.locator('figure img')).toBeVisible()
})

for (const blocks of ['10%,30%,30%', '10%,30%,30%,50%']) {
  test(`blocks=${blocks} invalide conserve les quatre explications sans les tronquer`, async ({ page }) => {
    const figure = await openFixture(page, { ...fourBlocks, directive: fourBlocks.directive.replace('blocks=10%,30%,30%,30%', `blocks=${blocks}`) })
    await expect(figure).not.toHaveClass(/custom-blocks/)
    await expect(figure.locator('.help-explanation-part')).toHaveText(fourBlocks.parts)
    const layout = await geometry(figure)
    for (const part of layout.parts) expect(part.contentHeight).toBeLessThanOrEqual(part.visibleHeight + 1)
  })
}

for (const theme of ['light', 'dark']) {
  for (const position of ['left', 'right']) {
    test(`les cinq blocs 4/3/31/31/31 restent alignés sur IMG en ${theme}, image=${position}, après redimensionnement`, async ({ page }, testInfo) => {
      await page.addInitScript(value => localStorage.setItem('theme', value), theme)
      const figure = await openFixture(page, { ...fiveBlocks, directive: fiveBlocks.directive.replace('image=left', `image=${position}`) })
      await expect(figure.locator('.help-explanation-part')).toHaveText(fiveBlocks.parts)
      for (const width of [1440, 1100]) {
        await page.setViewportSize({ width, height: 1100 })
        await readyFigure(page, figure)
        const layout = await expectCustomHeights(figure, [0.04, 0.03, 0.31, 0.31, 0.31])
        if (position === 'left') expect(layout.frame.right).toBeLessThanOrEqual(layout.explanation.left)
        else expect(layout.explanation.right).toBeLessThanOrEqual(layout.frame.left)
        if (theme === 'dark' && position === 'left') await figure.screenshot({ path: testInfo.outputPath(`capture-cinq-blocs-${width}.png`), animations: 'disabled' })
      }
    })
  }
}

test('les cinq blocs retrouvent des hauteurs libres sur mobile sans tronquer de texte', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  const fixture = { ...fiveBlocks, parts: [fiveBlocks.parts[0] + additionalText, ...fiveBlocks.parts.slice(1)] }
  const figure = await openFixture(page, fixture)
  await expect(figure.locator('.help-explanation-part')).toHaveText(fixture.parts)
  const layout = await expectMobileFlow(page, figure)
  expect(layout.parts[0].height).toBeGreaterThan(layout.image.height * 0.04)
})

test('un bloc trop long défile sans agrandir la colonne au-delà de la vraie capture', async ({ page }) => {
  const fixture = { ...fiveBlocks, parts: [fiveBlocks.parts[0] + additionalText + ' FIN DU BLOC.', ...fiveBlocks.parts.slice(1)] }
  const figure = await openFixture(page, fixture)
  await expect(figure.locator('.help-explanation-part')).toHaveText(fixture.parts)
  await expectCustomHeights(figure, [0.04, 0.03, 0.31, 0.31, 0.31])
  const first = figure.locator('.help-explanation-part').first()
  const overflow = await first.evaluate(element => ({ content: element.scrollHeight, visible: element.clientHeight, overflow: getComputedStyle(element).overflowY }))
  expect(overflow.content).toBeGreaterThan(overflow.visible + 20)
  expect(overflow.overflow).toBe('auto')
  const scrolled = await first.evaluate(element => {
    element.scrollTop = element.scrollHeight
    return { top: element.scrollTop, visible: element.clientHeight, content: element.scrollHeight }
  })
  expect(scrolled.top).toBeGreaterThan(0)
  expect(scrolled.top + scrolled.visible).toBeGreaterThanOrEqual(scrolled.content - 1)
  await expectCustomHeights(figure, [0.04, 0.03, 0.31, 0.31, 0.31])
})
