import { expect, test, type Locator, type Page } from '@playwright/test'

const paragraphs = [
  'La première explication accompagne la capture.',
  'La deuxième explication donne davantage de détails sur les réglages et les résultats.',
  'La troisième explication complète la lecture de la capture et précise les informations présentées.',
]
const galleryImages = [
  { alt: 'Sélection du bateau', src: '/assets/help/common/select_boat_ityc.png' },
  { alt: 'Calculatrice', src: '/assets/help/penalties/PS/pena_simple_cal.png' },
]

test.use({ viewport: { width: 1440, height: 1100 } })

async function openFixtureMarkdown(page: Page, markdown: string) {
  let intercepted = false
  await page.route('**/content/fr/tuto_pena.md?*', async route => {
    if (!new URL(route.request().url()).searchParams.has('raw')) return route.continue()
    const response = await route.fetch()
    await route.fulfill({ response, body: `export default ${JSON.stringify(markdown)}` })
    intercepted = true
  })
  await page.goto('/#aide?article=tuto_pena')
  await expect.poll(() => intercepted, { message: 'la fixture rows a été chargée' }).toBe(true)
}

async function openRowsFixture(page: Page, options: string, parts = paragraphs, images = [{ alt: 'Courbe de référence', src: '/assets/help/penalties/tuto/pena_ref_curve_vr.png' }], blankLineBetweenImages = false) {
  const imageMarkdown = images.map(image => `![${image.alt}](${image.src})`).join(blankLineBetweenImages ? '\n\n' : '\n')
  const markdown = `# Fixture de disposition en lignes\n\n## Capture et explications\n\n:::figure rows ${options}\n${imageMarkdown}\n\n${parts.join('\n\n---\n\n')}\n:::\n`
  await openFixtureMarkdown(page, markdown)
  const figure = page.locator('.help-illustrated.rows')
  await expect(figure).toHaveCount(1)
  await figure.scrollIntoViewIfNeeded()
  const image = figure.locator('figure img')
  await expect(image).toHaveCount(images.length)
  await expect.poll(() => image.evaluateAll(elements => elements.every(element => (element as HTMLImageElement).naturalWidth > 0))).toBe(true)
  await image.evaluateAll(elements => Promise.all(elements.map(element => (element as HTMLImageElement).decode())))
  await page.evaluate(async () => { await document.fonts.ready })
  await expect(figure.locator('.help-explanation-part')).toHaveText(parts)
  return figure
}

async function galleryGeometry(figure: Locator) {
  return figure.evaluate(element => {
    const box = (node: Element) => {
      const rect = node.getBoundingClientRect()
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height }
    }
    const row = element.querySelector('.help-image-row')!
    const text = element.querySelector('.help-figure-explanation')
    return {
      available: box(element.closest('.help-content-section')!),
      row: box(row),
      frames: [...row.querySelectorAll('figure')].map(box),
      images: [...row.querySelectorAll('img')].map(image => ({ ...box(image), naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight })),
      text: text ? box(text) : undefined,
      parts: [...element.querySelectorAll('.help-explanation-part')].map(part => ({ ...box(part), contentHeight: part.scrollHeight, visibleHeight: part.clientHeight })),
    }
  })
}

async function geometry(figure: Locator) {
  return figure.evaluate(element => {
    const box = (node: Element) => {
      const rect = node.getBoundingClientRect()
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height }
    }
    const image = element.querySelector('img')!
    return {
      available: box(element.closest('.help-content-section')!),
      frame: box(element.querySelector('figure')!),
      image: box(image),
      naturalImage: { width: image.naturalWidth, height: image.naturalHeight },
      text: box(element.querySelector('.help-figure-explanation')!),
      parts: [...element.querySelectorAll('.help-explanation-part')].map(part => ({ ...box(part), contentHeight: part.scrollHeight, visibleHeight: part.clientHeight })),
    }
  })
}

async function expectGroupPosition(figure: Locator, position: string) {
  await expect(figure).toHaveAttribute('data-image-position', position)
  const layout = await geometry(figure)
  expect(layout.frame.width / layout.available.width).toBeCloseTo(0.8, 2)
  expect(Math.abs(layout.frame.left - layout.text.left)).toBeLessThan(1)
  expect(Math.abs(layout.frame.right - layout.text.right)).toBeLessThan(1)
  expect(layout.frame.bottom).toBeLessThanOrEqual(layout.text.top)
  expect(Math.abs(layout.image.height - layout.image.width * layout.naturalImage.height / layout.naturalImage.width)).toBeLessThan(1)
  if (position === 'left') expect(Math.abs(layout.frame.left - layout.available.left)).toBeLessThan(1)
  else if (position === 'right') expect(Math.abs(layout.frame.right - layout.available.right)).toBeLessThan(1)
  else expect(Math.abs((layout.frame.left + layout.frame.right - layout.available.left - layout.available.right) / 2)).toBeLessThan(1)
  return layout
}

async function expectColumns(figure: Locator, ratios: number[]) {
  const layout = await geometry(figure)
  expect(layout.parts).toHaveLength(ratios.length)
  expect(Math.abs(layout.parts[0].left - layout.frame.left)).toBeLessThan(1)
  expect(Math.abs(layout.parts.at(-1)!.right - layout.frame.right)).toBeLessThan(1)
  for (const [index, ratio] of ratios.entries()) {
    expect(Math.abs(layout.parts[index].width - layout.text.width * ratio), `largeur du bloc ${index + 1}`).toBeLessThan(2)
    expect(Math.abs(layout.parts[index].top - layout.parts[0].top)).toBeLessThan(1)
    if (index) expect(Math.abs(layout.parts[index - 1].right - layout.parts[index].left)).toBeLessThan(1)
  }
}

for (const position of ['left', 'center', 'right']) {
  test(`rows image=${position} aligne le groupe à 80% et ses colonnes 20/30/50 sous la capture`, async ({ page }, testInfo) => {
    const figure = await openRowsFixture(page, `image=${position} width=80% blocks=20%,30%,50%`)
    await expectGroupPosition(figure, position)
    await expectColumns(figure, [0.2, 0.3, 0.5])
    if (position === 'center') await figure.screenshot({ path: testInfo.outputPath('rows-center-80.png'), animations: 'disabled' })
  })
}

for (const mobile of [false, true]) {
  test(`une deuxième rangée sans image conserve quatre blocs ${mobile ? 'lisibles sur mobile' : 'alignés sous la première rangée'}`, async ({ page }, testInfo) => {
    if (mobile) await page.setViewportSize({ width: 360, height: 800 })
    const firstParts = ['Sélection du bateau.', 'Sélection des options.', 'Date mise à jour polaire.', 'Mode affichage.']
    const secondParts = [
      'Choisir le bateau à analyser.' + (mobile ? ' Toutes les informations complémentaires restent lisibles dans cette deuxième rangée.'.repeat(8) : ''),
      'Activer les options disponibles.',
      'Consulter la dernière mise à jour.',
      'Choisir le mode Focus ou Grille.',
    ]
    const options = 'image=center width=100% blocks=23%,40%,22%,15%'
    const markdown = `# Fixture de deux rangées\n\n## Capture et explications\n\n:::figure rows ${options}\n![Courbe de référence](/assets/help/penalties/tuto/pena_ref_curve_vr.png)\n\n${firstParts.join('\n\n---\n\n')}\n:::\n\n:::figure rows ${options}\n${secondParts.join('\n\n---\n\n')}\n:::\n`
    await openFixtureMarkdown(page, markdown)
    const rows = page.locator('.help-illustrated.rows')
    await expect(rows).toHaveCount(2)
    await expect(rows.locator('img')).toHaveCount(1)
    await rows.locator('img').evaluate(element => (element as HTMLImageElement).decode())
    await page.evaluate(async () => { await document.fonts.ready })
    await expect(rows.locator('.help-explanation-part')).toHaveText([...firstParts, ...secondParts])
    await expect(rows.nth(1).locator('figure, img, .help-image-row')).toHaveCount(0)
    const layout = await rows.evaluateAll(elements => {
      const box = (element: Element) => {
        const rect = element.getBoundingClientRect()
        return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width }
      }
      return elements.map(element => ({
        ...box(element),
        parts: [...element.querySelectorAll('.help-explanation-part')].map(part => ({ ...box(part), contentHeight: part.scrollHeight, visibleHeight: part.clientHeight })),
      }))
    })
    expect(layout[0].bottom).toBeLessThanOrEqual(layout[1].top)
    expect(Math.abs(layout[0].left - layout[1].left)).toBeLessThan(1)
    expect(Math.abs(layout[0].right - layout[1].right)).toBeLessThan(1)
    for (const row of layout) {
      expect(row.parts).toHaveLength(4)
      for (const [index, ratio] of [0.23, 0.4, 0.22, 0.15].entries()) {
        const part = row.parts[index]
        expect(part.contentHeight).toBeLessThanOrEqual(part.visibleHeight + 1)
        expect(Math.abs(part.width - row.width * (mobile ? 1 : ratio))).toBeLessThan(2)
        if (mobile) {
          expect(Math.abs(part.left - row.left)).toBeLessThan(1)
          if (index) expect(row.parts[index - 1].bottom).toBeLessThanOrEqual(part.top)
        } else {
          expect(Math.abs(part.top - row.parts[0].top)).toBeLessThan(1)
          expect(Math.abs(part.left - layout[0].parts[index].left)).toBeLessThan(1)
          if (index) expect(Math.abs(row.parts[index - 1].right - part.left)).toBeLessThan(1)
        }
      }
    }
    const width = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }))
    expect(width.document).toBeLessThanOrEqual(width.viewport + 1)
    if (!mobile) await page.locator('.help-content-section').screenshot({ path: testInfo.outputPath('rows-deux-rangees.png'), animations: 'disabled', style: '.site-header { visibility: hidden !important; }' })
  })
}

test('deux captures occupent la même ligne à largeur égale avec leurs thèmes et liens', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'))
  const figure = await openRowsFixture(page, 'image=center width=80%', [], galleryImages)
  await expect(figure).toHaveClass(/has-gallery/)
  await expect(figure.locator(':scope > .help-image-row')).toHaveCount(1)
  await expect(figure.locator('.help-figure-explanation')).toHaveCount(0)

  for (const theme of ['dark', 'light']) {
    await page.locator('#theme-toggle').setChecked(theme === 'dark')
    for (const [index, image] of galleryImages.entries()) {
      const capture = figure.locator('figure').nth(index)
      const expected = theme === 'dark' ? image.src.replace('.png', '_b.png') : image.src
      await expect(capture.locator('img')).toHaveAttribute('src', expected)
      await expect(capture.locator('img')).toHaveAttribute('alt', image.alt)
      await expect(capture.locator('a')).toHaveAttribute('href', expected)
      await expect(capture.locator('a')).toHaveAttribute('target', '_blank')
      await capture.locator('img').evaluate(element => (element as HTMLImageElement).decode())
    }
    const layout = await galleryGeometry(figure)
    expect(layout.frames).toHaveLength(2)
    expect(layout.row.width / layout.available.width).toBeCloseTo(0.8, 2)
    expect(Math.abs(layout.frames[0].width - layout.frames[1].width)).toBeLessThan(1)
    expect(Math.abs(layout.frames[0].top - layout.frames[1].top)).toBeLessThan(1)
    expect(layout.frames[0].right).toBeLessThanOrEqual(layout.frames[1].left)
    for (const image of layout.images) expect(Math.abs(image.height - image.width * image.naturalHeight / image.naturalWidth)).toBeLessThan(1)
  }
})

test('deux images séparées par une ligne blanche gardent deux blocs sous toute la galerie', async ({ page }, testInfo) => {
  const figure = await openRowsFixture(page, 'image=center width=80% blocks=35%,65%', paragraphs.slice(0, 2), galleryImages, true)
  await expect(figure).toHaveClass(/has-gallery/)
  const layout = await galleryGeometry(figure)
  expect(layout.frames).toHaveLength(2)
  expect(Math.abs(layout.text!.left - layout.row.left)).toBeLessThan(1)
  expect(Math.abs(layout.text!.right - layout.row.right)).toBeLessThan(1)
  expect(layout.row.bottom).toBeLessThanOrEqual(layout.text!.top)
  for (const [index, ratio] of [0.35, 0.65].entries()) {
    expect(Math.abs(layout.parts[index].width - layout.row.width * ratio)).toBeLessThan(2)
    expect(Math.abs(layout.parts[index].top - layout.parts[0].top)).toBeLessThan(1)
  }
  await figure.screenshot({ path: testInfo.outputPath('rows-deux-images.png'), animations: 'disabled', style: '.site-header { visibility: hidden !important; }' })
})

test('sur mobile les deux captures et leurs textes restent dans l’ordre sans débordement', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  const longParts = [paragraphs[0] + ' Un complément permet de lire toutes les informations de la galerie.'.repeat(8), paragraphs[1]]
  const figure = await openRowsFixture(page, 'image=center width=80% blocks=35%,65%', longParts, galleryImages)
  const layout = await galleryGeometry(figure)
  expect(layout.frames).toHaveLength(2)
  expect(layout.frames[0].bottom).toBeLessThanOrEqual(layout.frames[1].top)
  expect(Math.abs(layout.frames[0].left - layout.frames[1].left)).toBeLessThan(1)
  for (const frame of layout.frames) expect(Math.abs(frame.width - layout.row.width)).toBeLessThan(1)
  for (const image of layout.images) expect(Math.abs(image.height - image.width * image.naturalHeight / image.naturalWidth)).toBeLessThan(1)
  expect(layout.row.bottom).toBeLessThanOrEqual(layout.text!.top)
  expect(layout.parts[0].bottom).toBeLessThanOrEqual(layout.parts[1].top)
  for (const part of layout.parts) expect(part.contentHeight).toBeLessThanOrEqual(part.visibleHeight + 1)
  expect(await figure.locator('img').evaluateAll(images => images.map(image => image.alt))).toEqual(galleryImages.map(image => image.alt))
  const width = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }))
  expect(width.document).toBeLessThanOrEqual(width.viewport + 1)
})

test('sans blocks les trois explications se répartissent à parts égales sous la capture', async ({ page }) => {
  const figure = await openRowsFixture(page, 'image=center width=80%')
  await expectGroupPosition(figure, 'center')
  await expectColumns(figure, [1 / 3, 1 / 3, 1 / 3])
})

for (const blocks of ['20%,80%', '20%,30%,40%']) {
  test(`rows blocks=${blocks} invalide conserve trois colonnes égales et tous les textes`, async ({ page }) => {
    const figure = await openRowsFixture(page, `image=center width=80% blocks=${blocks}`)
    await expectGroupPosition(figure, 'center')
    await expectColumns(figure, [1 / 3, 1 / 3, 1 / 3])
    const layout = await geometry(figure)
    for (const part of layout.parts) expect(part.contentHeight).toBeLessThanOrEqual(part.visibleHeight + 1)
  })
}

for (const position of ['left', 'center', 'right']) {
  test(`sur mobile rows image=${position} conserve largeur et alignement puis empile tous les textes`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 360, height: 800 })
    const longParagraphs = [paragraphs[0] + ' Un complément détaille les différentes informations de la capture pour permettre une lecture complète.'.repeat(10), ...paragraphs.slice(1)]
    const figure = await openRowsFixture(page, `image=${position} width=80% blocks=20%,30%,50%`, longParagraphs)
    const layout = await expectGroupPosition(figure, position)
    for (const [index, part] of layout.parts.entries()) {
      expect(Math.abs(part.width - layout.text.width)).toBeLessThan(1)
      expect(part.contentHeight).toBeLessThanOrEqual(part.visibleHeight + 1)
      if (index) expect(layout.parts[index - 1].bottom).toBeLessThanOrEqual(part.top)
    }
    const width = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }))
    expect(width.document).toBeLessThanOrEqual(width.viewport + 1)
    if (position === 'center') await figure.screenshot({ path: testInfo.outputPath('rows-mobile-center.png'), animations: 'disabled', style: '.site-header { visibility: hidden !important; }' })
  })
}
