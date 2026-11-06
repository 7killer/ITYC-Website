import { expect, test, type Locator, type Page } from '@playwright/test'

const iconSource = '/assets/help/common/resetZoom.png'

test.use({ viewport: { width: 1440, height: 1000 } })

async function openFixture(page: Page, body: string) {
  let intercepted = false
  const markdown = `# Inline image fixture\n\n## Usage\n\n${body}\n`
  await page.route('**/content/fr/tuto_pena.md?*', async route => {
    if (!new URL(route.request().url()).searchParams.has('raw')) return route.continue()
    const response = await route.fetch()
    await route.fulfill({ response, body: `export default ${JSON.stringify(markdown)}` })
    intercepted = true
  })
  await page.goto('/#aide?article=tuto_pena')
  await expect.poll(() => intercepted, { message: 'inline image fixture was loaded' }).toBe(true)
  const images = page.locator('.help-article img')
  await expect(images.first()).toBeVisible()
  await images.evaluateAll(elements => Promise.all(elements.map(element => (element as HTMLImageElement).decode())))
  await page.evaluate(async () => { await document.fonts.ready })
}

async function expectEmSize(image: Locator, em: number) {
  const size = await image.evaluate(element => {
    const image = element as HTMLImageElement
    const rect = image.getBoundingClientRect()
    return {
      width: rect.width,
      height: rect.height,
      fontSize: Number.parseFloat(getComputedStyle(image).fontSize),
      ratio: image.naturalWidth / image.naturalHeight,
    }
  })
  expect(Math.abs(size.height - size.fontSize * em), 'height follows the inherited text size').toBeLessThan(0.6)
  expect(Math.abs(size.width - size.height * size.ratio), 'natural image proportions are preserved').toBeLessThan(0.6)
}

test('inline image sizes follow em units and inherited text on desktop and mobile', async ({ page }) => {
  await openFixture(page, `Avant ![Default](${iconSource} "icon") puis ![Large](${iconSource} "icon:1.2em") et ![Small](${iconSource} "icon:.8em") fin.`)
  const icons = page.locator('.help-inline-icon')
  const paragraph = page.locator('.help-content-section p').filter({ has: page.locator('img[alt="Default"]') })
  await expect(icons).toHaveCount(3)
  await expect(paragraph).toHaveCount(1)
  await expect(paragraph.locator('figure, a')).toHaveCount(0)

  for (const width of [1440, 360]) {
    await page.setViewportSize({ width, height: 1000 })
    for (const [index, em] of [1, 1.2, 0.8].entries()) await expectEmSize(icons.nth(index), em)
    const layout = await paragraph.evaluate(element => ({
      height: element.getBoundingClientRect().height,
      lineHeight: Number.parseFloat(getComputedStyle(element).lineHeight),
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }))
    expect(layout.height, 'text and images remain on one line').toBeLessThanOrEqual(layout.lineHeight + 1)
    expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth + 1)
  }

  await paragraph.evaluate(element => { element.style.fontSize = '28px' })
  for (const [index, em] of [1, 1.2, 0.8].entries()) await expectEmSize(icons.nth(index), em)
})

test('icons stay inline in formatted text while ordinary and invalid images keep their figures', async ({ page }) => {
  await openFixture(page, `**Texte gras ![Strong](${iconSource} "icon")**.

[Lien ![Linked](${iconSource} "icon:1.2em")](#aide).

- Liste ![List](${iconSource} "icon:.8em")

| Commande | Action |
| --- | --- |
| ![Table](${iconSource} "icon") | Zoom |

![Capture](${iconSource})

![Zero](${iconSource} "icon:0em")

![Negative](${iconSource} "icon:-1em")

![Wrong unit](${iconSource} "icon:1px")`)

  await expect(page.locator('.help-content-section p strong > img.help-inline-icon[alt="Strong"]')).toHaveCount(1)
  await expect(page.locator('.help-content-section p a[href="#aide"] > img.help-inline-icon[alt="Linked"]')).toHaveCount(1)
  await expect(page.locator('.help-content-section li img.help-inline-icon[alt="List"]')).toHaveCount(1)
  await expect(page.locator('.help-content-section td img.help-inline-icon[alt="Table"]')).toHaveCount(1)
  await expect(page.locator('.help-inline-icon')).toHaveCount(4)
  await expect(page.locator('.help-figure .help-inline-icon')).toHaveCount(0)

  for (const [alt, em] of [['Strong', 1], ['Linked', 1.2], ['List', 0.8], ['Table', 1]] as const) {
    await expectEmSize(page.locator(`.help-inline-icon[alt="${alt}"]`), em)
  }
  const figures = page.locator('.help-content-section figure.help-figure')
  await expect(figures).toHaveCount(4)
  for (const alt of ['Capture', 'Zero', 'Negative', 'Wrong unit']) {
    const figure = figures.filter({ has: page.locator(`img[alt="${alt}"]`) })
    await expect(figure).toHaveCount(1)
    await expect(figure.locator('a')).toHaveAttribute('target', '_blank')
    await expect(figure.locator('a')).toHaveAttribute('href', await figure.locator('img').getAttribute('src') as string)
  }
})

test('inline images follow light and dark variants with the same capture fallback', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'))
  await openFixture(page, `Zoom ![Themed icon](${iconSource} "icon:1.2em") et ![Without variant](/assets/help/common/select_boat_game.png "icon").

![Capture](${iconSource})`)
  const icon = page.locator('.help-inline-icon[alt="Themed icon"]')
  const capture = page.locator('.help-figure img[alt="Capture"]')

  for (const theme of ['dark', 'light', 'dark']) {
    await page.locator('#theme-toggle').setChecked(theme === 'dark')
    const expected = theme === 'dark' ? /\/resetZoom_b\.png$/ : /\/resetZoom\.png$/
    await expect(icon).toHaveAttribute('src', expected)
    await expect(capture).toHaveAttribute('src', expected)
    await expect(page.locator('.help-inline-icon[alt="Without variant"]')).toHaveAttribute('src', '/assets/help/common/select_boat_game.png')
    await icon.evaluate(element => (element as HTMLImageElement).decode())
    await expectEmSize(icon, 1.2)
    await expect(icon.locator('xpath=ancestor::figure | ancestor::a')).toHaveCount(0)
  }
})
