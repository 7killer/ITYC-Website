import { expect, test, type FrameLocator, type Page } from '@playwright/test'

type Scope = Page | FrameLocator
type ToolFile = 'pena' | 'energy' | 'polar' | 'autoSail'

const tools: Array<{ file: ToolFile; initial: Record<string, number>; edits: Record<string, number>; layoutGroup: string }> = [
  { file: 'pena', initial: { 'pena-simple-wind': 14.5, 'pena-simple-energy': 45.5, 'pena-simple-speed': 9.5 }, edits: { 'pena-simple-wind': 12.3, 'pena-simple-energy': 33.3, 'pena-simple-speed': 7.7 }, layoutGroup: "Mode d'affichage" },
  { file: 'energy', initial: { 'energy-loss-wind': 14.5, 'energy-recovery-energy': 45.5 }, edits: { 'energy-loss-wind': 12.3, 'energy-recovery-energy': 33.3 }, layoutGroup: "Mode d'affichage" },
  { file: 'polar', initial: { tws: 14.5, twa: 72.5 }, edits: { tws: 12.3, twa: 81.2 }, layoutGroup: 'Disposition des courbes' },
  { file: 'autoSail', initial: { 'autosail-tws': 14.5, 'autosail-twa': 72.5 }, edits: { 'autosail-tws': 12.3, 'autosail-twa': 81.2 }, layoutGroup: 'Disposition des courbes' },
]

const polar = {
  twa: [0, 90, 180], tws: [0, 2, 4],
  sail: ['Jib', 'Spi', 'Code0', 'LightJib', 'LightGnk', 'HeavyGnk', 'Staysail'].map(name => ({
    name, speed: [[0, 0, 0], [8, 10, 12], [4, 5, 6]],
  })),
}

test.use({ viewport: { width: 1440, height: 1000 } })
test.beforeEach(async ({ page }) => {
  await page.route('**/data/export/*.json', route => route.fulfill({
    contentType: 'application/json', body: JSON.stringify(polar),
  }))
})

async function values(scope: Scope, expected: Record<string, number>) {
  for (const [id, value] of Object.entries(expected)) {
    await expect(scope.locator(`[id="${id}-number"]`)).toHaveValue(value.toFixed(1))
  }
}

async function edit(scope: Scope, changes: Record<string, number>) {
  for (const [id, value] of Object.entries(changes)) {
    const field = scope.locator(`[id="${id}-number"]`)
    await field.fill(String(value))
    await field.blur()
  }
  await values(scope, changes)
}

function headerLink(scope: Scope, tool: ToolFile) {
  const name = {
    pena: /^(Pénalités|Penalties)$/,
    energy: /^(Énergie|Energy)$/,
    polar: /^(Polaires|Polars)$/,
    autoSail: /^(Voiles Auto|Auto Sails)$/,
  }[tool]
  return scope.locator('.site-header .main-navigation').getByRole('link', { name })
}

async function compactShell(scope: Scope) {
  await expect(scope.locator('.embedded-page')).toBeVisible()
  await expect(scope.locator('.site-header .main-navigation a')).toHaveCount(4)
  for (const selector of [
    '.boat-selector', '.options-panel', '.sails-panel', '.analysis-toolbar-options',
    '.site-footer', '.language-switcher', '.theme-switch', '.support-link',
  ]) await expect(scope.locator(selector)).toHaveCount(0)
}

async function fixedLinks(scope: Scope, base: string, rawBoat: string, rawOptions: string, tag: string) {
  for (const tool of tools) {
    const address = new URL((await headerLink(scope, tool.file).getAttribute('href'))!, base)
    expect(address.pathname).toBe(`/${tool.file}Dash.html`)
    expect(address.hash).toBe('')
    expect(address.search).toContain(`b=${rawBoat}`)
    expect(address.search).toContain(`o=${rawOptions}`)
    expect(address.searchParams.getAll('b')).toEqual([decodeURIComponent(rawBoat)])
    expect(address.searchParams.getAll('o')).toEqual([rawOptions])
    expect(address.searchParams.get('tag')).toBe(tag)
  }
}

for (const tool of tools) {
  test(`${tool.file}Dash garde le contexte fixe et permet les simulations sans interface de configuration`, async ({ page }) => {
    // Noncanonical encoding and option order expose an accidental reconstruction of b/o.
    const query = 'b=Class%2040%202021&o=PMWJHLRhF&ts=14.5&ta=-72.5&se=45.5&bs=9.5&s=LJ&th=dark&lang=fr&tag=preserve%2F%E2%9C%93'
    const address = `/${tool.file}Dash.html?${query}${tool.file === 'energy' ? '#accueil' : ''}`
    await page.goto(address)
    await compactShell(page)
    await expect(page.locator('.embedded-boat-name')).toHaveText('Class 40 2021')
    await values(page, tool.initial)
    await expect(page).toHaveURL(new URL(address, page.url()).href)

    await edit(page, tool.edits)
    const layout = page.getByRole('group', { name: tool.layoutGroup, exact: true })
    await layout.getByRole('button', { name: 'Focus', exact: true }).click()
    await expect(layout.getByRole('button', { name: 'Focus', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await layout.getByRole('button', { name: 'Grille', exact: true }).click()

    if (tool.file === 'polar') {
      await page.getByRole('group', { name: 'Niveau de détail', exact: true }).getByRole('button', { name: 'Expert', exact: true }).click()
      await expect(page.locator('#polaire')).toHaveAttribute('data-polar-level', 'expert')
      await values(page, { 'expert-tws': 12.3, 'expert-twa': 81.2 })
    }
    if (tool.file === 'autoSail') {
      await page.locator('#autosail-chart-0 .autosail-settings select').selectOption('Code0')
      await page.locator('#autosail-chart-3 .autosail-settings select').nth(1).selectOption('LightGnk')
      await expect(page.locator('#autosail-chart-0 .autosail-settings select')).toHaveValue('Code0')
      await expect(page.locator('#autosail-chart-3 .autosail-settings select').nth(1)).toHaveValue('LightGnk')
    }
    await fixedLinks(page, page.url(), 'Class%2040%202021', 'PMWJHLRhF', 'preserve/✓')
    await compactShell(page)
    await expect(page).toHaveURL(new URL(address, page.url()).href)
  })
}

test('la navigation entre outils reste dans les pages Dash avec le dernier contexte de simulation', async ({ page }) => {
  await page.goto('/energyDash.html?b=Super_Maxi%20100&o=JMW&s=J&ts=8&se=40&th=dark&lang=fr&tag=iframe')
  await edit(page, { 'energy-loss-wind': 10.7, 'energy-recovery-energy': 55.5 })
  await expect.poll(async () => new URL((await headerLink(page, 'pena').getAttribute('href'))!, page.url()).searchParams.get('ts')).toBe('10.7')
  await fixedLinks(page, page.url(), 'Super_Maxi%20100', 'JMW', 'iframe')
  await headerLink(page, 'pena').click()
  await expect.poll(() => new URL(page.url()).pathname).toBe('/penaDash.html')
  await compactShell(page)
  await values(page, { 'pena-simple-wind': 10.7, 'pena-simple-energy': 55.5 })

  await edit(page, { 'pena-simple-speed': 7.3 })
  await expect.poll(async () => new URL((await headerLink(page, 'polar').getAttribute('href'))!, page.url()).searchParams.get('bs')).toBe('7.3')
  await headerLink(page, 'polar').click()
  await expect.poll(() => new URL(page.url()).pathname).toBe('/polarDash.html')
  await values(page, { tws: 10.7 })
  await fixedLinks(page, page.url(), 'Super_Maxi%20100', 'JMW', 'iframe')
  await page.goBack()
  await expect.poll(() => new URL(page.url()).pathname).toBe('/penaDash.html')
  await compactShell(page)
  await fixedLinks(page, page.url(), 'Super_Maxi%20100', 'JMW', 'iframe')
})

test('les pages Dash ignorent la session normale et ne modifient ni ses réglages ni les préférences', async ({ page }) => {
  await page.goto('/index.html')
  await expect(page.locator('.app-shell')).toBeVisible()
  const states = {
    polar: { boat: 'Imoca', tws: 3.3, twa: 33, layout: 'focus', level: 'normal', focus: 0, options: { foil: true, hull: true, fullPack: true } },
    autosail: { boat: 'Imoca', tws: 4.4, twa: 44, layout: 'focus', options: { foil: true, hull: true, fullPack: true }, sailForTwa: 'LightJib', sailForTws: 'LightJib', sailForRange: 'LightJib' },
    penalties: { boat: 'Imoca', simpleWind: 5.5, simpleEnergy: 11, simpleSpeed: 6, layout: 'focus', fullPack: true },
    energy: { boat: 'Imoca', lossWind: 6.6, recoveryWind: 7.7, energy: 55.5, layout: 'focus', fullPack: true },
  }
  await page.evaluate(states => {
    for (const [key, value] of Object.entries(states)) sessionStorage.setItem(`ityc:tool-page:${key}`, JSON.stringify(value))
    sessionStorage.setItem('ordinary-tab-marker', 'keep-session')
    localStorage.setItem('theme', 'light')
    localStorage.setItem('locale', 'en')
    localStorage.setItem('ordinary-pref-marker', 'keep-local')
  }, states)

  for (const tool of tools) {
    await page.goto(`/${tool.file}Dash.html?b=Class_40&o=FP&ts=14.5&se=45.5&th=dark&lang=fr`)
    await compactShell(page)
    await expect(page.locator('.embedded-boat-name')).toHaveText('Class 40 2021')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    await expect(page.getByRole('group', { name: tool.layoutGroup, exact: true }).getByRole('button', { name: 'Grille', exact: true })).toHaveAttribute('aria-pressed', 'true')
    const wind = tool.file === 'polar' ? 'tws' : tool.file === 'autoSail' ? 'autosail-tws' : tool.file === 'pena' ? 'pena-simple-wind' : 'energy-loss-wind'
    await values(page, { [wind]: 14.5 })
    await edit(page, { [wind]: 12.3 })
    const stored = await page.evaluate(keys => ({
      states: Object.fromEntries(keys.map(key => [key, sessionStorage.getItem(`ityc:tool-page:${key}`)])),
      sessionMarker: sessionStorage.getItem('ordinary-tab-marker'),
      theme: localStorage.getItem('theme'), locale: localStorage.getItem('locale'),
      localMarker: localStorage.getItem('ordinary-pref-marker'),
    }), Object.keys(states))
    expect(stored.states).toEqual(Object.fromEntries(Object.entries(states).map(([key, value]) => [key, JSON.stringify(value)])))
    expect(stored).toMatchObject({ sessionMarker: 'keep-session', theme: 'light', locale: 'en', localMarker: 'keep-local' })
  }
  await page.goto('/energy.html')
  await expect(page.locator('.embedded-page')).toHaveCount(0)
  await expect(page.getByRole('combobox', { name: 'Bateau', exact: true })).toHaveValue('Imoca')
  await values(page, { 'energy-loss-wind': 6.6, 'energy-recovery-wind': 7.7, 'energy-recovery-energy': 55.5 })
  await expect(page.locator('.site-footer')).toBeVisible()
})

test('deux iframes du même outil restent indépendantes pendant les éditions, le rechargement et la navigation', async ({ page }) => {
  await page.goto('/index.html')
  await expect(page.locator('.app-shell')).toBeVisible()
  const parentAddress = page.url()
  const normalState = JSON.stringify({ boat: 'Tara', simpleEnergy: 5, simpleWind: 2, layout: 'grid' })
  await page.evaluate(normalState => {
    sessionStorage.setItem('ityc:tool-page:penalties', normalState)
    localStorage.setItem('theme', 'light')
    localStorage.setItem('locale', 'en')
  }, normalState)
  await page.setContent('<iframe id="first" name="first" title="Premier outil" width="1000" height="900"></iframe><iframe id="second" name="second" title="Second outil" width="1000" height="900"></iframe>')
  await page.evaluate(() => {
    const firstIframe = document.getElementById('first') as HTMLIFrameElement
    const secondIframe = document.getElementById('second') as HTMLIFrameElement
    firstIframe.src = '/penaDash.html?b=Class_40&o=FP&ts=11&se=60&bs=8&th=dark&lang=fr'
    secondIframe.src = '/penaDash.html?b=Imoca&o=W&ts=17&bs=6&th=light&lang=en'
  })
  const first = page.frameLocator('#first')
  const second = page.frameLocator('#second')
  await compactShell(first)
  await compactShell(second)
  await expect(first.locator('.embedded-boat-name')).toHaveText('Class 40 2021')
  await expect(second.locator('.embedded-boat-name')).toHaveText('Imoca')
  await values(first, { 'pena-simple-wind': 11, 'pena-simple-energy': 60 })
  await values(second, { 'pena-simple-wind': 17, 'pena-simple-energy': 66.7 })
  await edit(first, { 'pena-simple-wind': 9.2, 'pena-simple-energy': 22 })
  await values(second, { 'pena-simple-wind': 17, 'pena-simple-energy': 66.7 })

  const secondFrame = page.frame({ name: 'second' })!
  await secondFrame.goto(secondFrame.url())
  await values(second, { 'pena-simple-wind': 17, 'pena-simple-energy': 66.7 })
  await values(first, { 'pena-simple-wind': 9.2, 'pena-simple-energy': 22 })
  await headerLink(first, 'energy').click()
  await values(first, { 'energy-loss-wind': 9.2, 'energy-recovery-energy': 22 })
  await compactShell(first)
  await values(second, { 'pena-simple-wind': 17, 'pena-simple-energy': 66.7 })
  await expect.poll(async () => new URL((await headerLink(second, 'energy').getAttribute('href'))!, parentAddress).searchParams.get('ts')).toBe('17')
  await expect(page).toHaveURL(parentAddress)
  expect(await page.evaluate(() => sessionStorage.getItem('ityc:tool-page:penalties'))).toBe(normalState)
  expect(await page.evaluate(() => ({ theme: localStorage.getItem('theme'), locale: localStorage.getItem('locale') }))).toEqual({ theme: 'light', locale: 'en' })
})

test('Voiles Auto intégré conserve uniquement des sélections équipées sans hériter de la session normale', async ({ page }) => {
  await page.goto('/autoSail.html?b=Imoca&o=FP&s=LJ')
  await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('ityc:tool-page:autosail') ?? '{}').options?.fullPack)).toBe(true)
  for (const suffix of [
    '', '&o=invalide', '&o=&s=C0',
    '&o=&s=LJ&sailForTwa=Code0&sailForTws=LightJib&sailForRange=LightGnk&firstOverlapSail=HeavyGnk&secondOverlapSail=Staysail',
  ]) {
    const address = `/autoSailDash.html?b=Class_40&th=dark&lang=fr${suffix}`
    await page.goto(address)
    await compactShell(page)
    await expect(page.locator('.embedded-boat-name')).toHaveText('Class 40 2021')
    for (const index of [0, 1, 2]) {
      const select = page.locator(`#autosail-chart-${index} .autosail-settings select`)
      await expect(select).toHaveValue('Jib')
      expect(await select.locator('option').evaluateAll(options => options.map(option => (option as HTMLOptionElement).value))).toEqual(['Jib', 'Spi'])
    }
    await expect(page.locator('#autosail-chart-3 .autosail-settings select').nth(0)).toHaveValue('Jib')
    await expect(page.locator('#autosail-chart-3 .autosail-settings select').nth(1)).toHaveValue('Spi')
    await expect(page).toHaveURL(new URL(address, page.url()).href)
  }
})
