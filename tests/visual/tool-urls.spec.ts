import { expect, test, type Page } from '@playwright/test'

declare global {
  interface Window { toolUrlWorkerStarts: number }
}

const tools = [
  { file: 'pena', page: 'penalties', hash: '#penalites', heading: 'Pénalités', wind: 'pena-simple-wind', edit: 'pena-simple-wind' },
  { file: 'energy', page: 'energy', hash: '#energie', heading: 'Énergie', wind: 'energy-loss-wind', edit: 'energy-recovery-energy' },
  { file: 'polar', page: 'polar', hash: '#polaire', heading: 'Polaires', wind: 'tws', edit: 'tws' },
  { file: 'autoSail', page: 'autosail', hash: '#autosail', heading: 'Voiles Automatiques', wind: 'autosail-tws', edit: 'autosail-tws' },
] as const

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

async function values(page: Page, expected: Record<string, number>) {
  for (const [id, value] of Object.entries(expected)) {
    await expect(page.locator(`[id="${id}-number"]`)).toHaveValue(value.toFixed(1))
  }
}

async function exactAddress(page: Page, address: string) {
  await expect(page).toHaveURL(new URL(address, page.url()).href)
}

function headerLink(page: Page, tool: 'pena' | 'energy' | 'polar' | 'autoSail') {
  const name = {
    pena: /^(Pénalités|Penalties)$/,
    energy: /^(Énergie|Energy)$/,
    polar: /^(Polaires|Polars)$/,
    autoSail: /^(Voiles Auto|Auto Sails)$/,
  }[tool]
  return page.locator('.site-header .main-navigation').getByRole('link', { name })
}

async function linkParameter(page: Page, tool: 'pena' | 'energy' | 'polar' | 'autoSail', key: string) {
  const href = await headerLink(page, tool).getAttribute('href')
  return new URL(href!, page.url()).searchParams.get(key)
}

async function seedSession(page: Page, states: Record<string, object>) {
  await page.addInitScript(states => {
    for (const [key, state] of Object.entries(states)) {
      sessionStorage.setItem(`ityc:tool-page:${key}`, JSON.stringify(state))
    }
  }, states)
}

async function overlapSails(page: Page, expected: string[]) {
  await expect.poll(() => page.locator('#autosail-chart-3 .autosail-settings select').evaluateAll(selects =>
    selects.map(select => (select as HTMLSelectElement).value),
  )).toEqual(expected)
}

for (const locale of ['fr', 'en'] as const) {
  for (const tool of tools) {
    test(`${tool.file}${locale === 'en' ? 'En' : ''}.html conserve son adresse et charge ses réglages après rechargement`, async ({ page }) => {
      await page.addInitScript(locale => {
        localStorage.setItem('locale', locale === 'fr' ? 'en' : 'fr')
        localStorage.setItem('theme', 'dark')
      }, locale)
      await seedSession(page, { [tool.page]: {
        boat: 'Imoca', twa: 33, tws: 3, simpleWind: 3, doubleWind: 3, rentWind: 3,
        simpleEnergy: 80, doubleEnergy: 80, rentEnergy: 80, simpleSpeed: 6, doubleSpeed: 6,
        energy: 80, lossWind: 3, recoveryWind: 3,
        fullPack: false, winch: false, furler: false, jacket: false, pug: false,
        options: { foil: false, hull: false, fullPack: false }, selectedSails: ['Jib'],
      } })
      const address = `/${tool.file}${locale === 'en' ? 'En' : ''}.html?b=Class_40&s=LJ&o=FP&ts=14,5&ta=-72,5&bs=9,5&se=45,5&th=light`
      await page.goto(address)

      const check = async () => {
        await expect(page.locator('.page-heading h1')).toHaveText(tool.heading)
        await expect(page.locator('html')).toHaveAttribute('lang', locale)
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
        await expect(page.getByRole('combobox', { name: 'Bateau', exact: true })).toHaveValue('Class 40 2021')
        await expect(page.getByRole('checkbox', { name: 'Full Pack', exact: true })).toBeChecked()
        await values(page, { [tool.wind]: 14.5 })
        if (tool.page === 'polar') await values(page, { twa: 72.5 })
        if (tool.page === 'autosail') await values(page, { 'autosail-twa': 72.5 })
        if (tool.page === 'penalties') await values(page, {
          'pena-simple-energy': 45.5, 'pena-double-energy': 45.5, 'pena-rent-energy': 45.5,
          'pena-simple-speed': 9.5, 'pena-double-speed': 9.5,
          'pena-double-wind': 14.5, 'pena-rent-wind': 14.5,
        })
        if (tool.page === 'energy') await values(page, { 'energy-recovery-energy': 45.5, 'energy-recovery-wind': 14.5 })
        await exactAddress(page, address)
      }
      await check()
      await page.reload()
      await check()
    })
  }
}

test('les réglages propres aux trois calculatrices Pénalités priment sur les paramètres communs', async ({ page }) => {
  await page.goto('/pena.html?b=Imoca&ts=12&se=50&bs=7&simpleWind=5.5&simpleEnergy=22.2&simpleSpeed=3.3&doubleWind=16.6&doubleEnergy=44.4&doubleSpeed=9.9&rentWind=10.1&rentEnergy=66.6&withoutSpeed=8.8&withSpeed=12.2&layout=focus&focus=2&fullPack=false&winch=false&furler=true&jacket=false')
  await values(page, {
    'pena-simple-wind': 5.5, 'pena-simple-energy': 22.2, 'pena-simple-speed': 3.3,
    'pena-double-wind': 16.6, 'pena-double-energy': 44.4, 'pena-double-speed': 9.9,
    'pena-rent-wind': 10.1, 'pena-rent-energy': 66.6, 'pena-rent-without': 8.8, 'pena-rent-with': 12.2,
  })
  await expect(page.locator('.analysis-layout-focus .analysis-card.is-focus')).toHaveAttribute('id', 'analysis-card-2')
  for (const name of ['Full Pack', 'Winch', 'Veste']) await expect(page.getByRole('checkbox', { name, exact: true })).not.toBeChecked()
  await expect(page.getByRole('checkbox', { name: 'Enrouleur', exact: true })).toBeChecked()
})

test('les réglages Énergie conservent zéro et les booléens explicites', async ({ page }) => {
  await page.goto('/energy.html?ts=10&se=77&lossWind=4.4&recoveryWind=22.2&energy=0&winch=0&furler=false&jacket=1&pug=true&fullPack=false&layout=focus&focus=1')
  await values(page, { 'energy-loss-wind': 4.4, 'energy-recovery-wind': 22.2, 'energy-recovery-energy': 0 })
  await expect(page.locator('.analysis-layout-focus .analysis-card.is-focus')).toHaveAttribute('id', 'analysis-card-1')
  for (const name of ['Full Pack', 'Winch', 'Enrouleur']) await expect(page.getByRole('checkbox', { name, exact: true })).not.toBeChecked()
  for (const name of ['Veste', 'Coussin']) await expect(page.getByRole('checkbox', { name, exact: true })).toBeChecked()
})

test('la polaire experte restaure sa disposition, ses couches et sa sélection précise de voiles', async ({ page }) => {
  await page.goto('/polar.html?b=Class_40&ts=8.2&ta=-135.5&level=expert&layout=focus&displayAuto=false&displayFoils=0&displaySails=false&o=FhRLH&sails=J,LG&foil=false&hull=true&fullPack=false')
  await expect(page.locator('.expert-workspace.is-focus')).toBeVisible()
  await values(page, { 'expert-tws': 8.2, 'expert-twa': 135.5 })
  await expect(page.locator('#foil')).not.toBeChecked()
  await expect(page.locator('#hull')).toBeChecked()
  await expect(page.locator('#full-pack')).not.toBeChecked()
  for (const id of ['Jib', 'LightGnk']) await expect(page.locator(`#sail-${id}`)).toBeChecked()
  for (const id of ['Spi', 'Code0', 'LightJib', 'HeavyGnk', 'Staysail']) await expect(page.locator(`#sail-${id}`)).not.toBeChecked()
  await expect(page.locator('.expert-diagram-toolbar').getByRole('button', { name: 'Voiles Auto', exact: true })).toHaveAttribute('aria-pressed', 'false')
  for (const name of ['Toutes', 'Foils']) await expect(page.locator('.expert-diagram-toolbar').getByRole('button', { name, exact: true })).not.toHaveClass(/is-active/)
})

test('Voiles Auto reconnaît LJ puis les sélecteurs, plages et précision propres à chaque carte', async ({ page }) => {
  await page.goto('/autoSail.html?s=LJ&o=FP')
  for (const index of [0, 1, 2]) await expect(page.locator(`#autosail-chart-${index} .autosail-settings select`)).toHaveValue('LightJib')
  await overlapSails(page, ['LightJib', 'LightJib'])

  await page.goto('/autoSail.html?s=LJ&o=FP&ts=7.5&ta=-85.5&twsStart=2.2&twsEnd=30.3&twaStart=20.2&twaEnd=150.5&sailForTwa=Code0&sailForTws=Spi&sailForRange=LightJib&firstOverlapSail=LightJib&secondOverlapSail=LightGnk&precision=0.01&layout=focus')
  await values(page, {
    'autosail-tws': 7.5, 'autosail-twa': 85.5, 'autosail-tws-start': 2.2,
    'autosail-tws-end': 30.3, 'autosail-twa-start': 20.2, 'autosail-twa-end': 150.5,
  })
  for (const [index, sail] of [[0, 'Code0'], [1, 'Spi'], [2, 'LightJib']] as const) {
    await expect(page.locator(`#autosail-chart-${index} .autosail-settings select`)).toHaveValue(sail)
  }
  await overlapSails(page, ['LightJib', 'LightGnk'])
  await expect(page.getByRole('group', { name: 'Précision du recouvrement' }).getByRole('button', { name: '0,01', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.autosail-layout-focus')).toBeVisible()
})

test('les noms historiques et les noms encodés de bateau sont décodés sans réécrire l’adresse', async ({ page }) => {
  for (const [encoded, expected] of [
    ['Class_40', 'Class 40 2021'], ['Super_Maxi%20100', 'Super Maxi 100'], ['Class%2040%202021', 'Class 40 2021'],
  ]) {
    const address = `/energy.html?b=${encoded}&note=ar%C3%AAtes%20%26%20voiles`
    await page.goto(address)
    await expect(page.getByRole('combobox', { name: 'Bateau', exact: true })).toHaveValue(expected)
    await exactAddress(page, address)
  }
})

test('les paramètres invalides ne remplacent pas un état de session valide', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'light'))
  await seedSession(page, {
    polar: { boat: 'Imoca', tws: 3.3, twa: 60, layout: 'grid', level: 'normal', options: { foil: false, hull: true, fullPack: false }, selectedSails: ['Jib', 'LightJib'] },
    autosail: { boat: 'Imoca', tws: 3.3, twa: 60, layout: 'grid', options: { foil: false, hull: true, fullPack: false }, selectedSails: ['Jib', 'LightJib'], sailForTwa: 'LightJib', sailForTws: 'LightJib', sailForRange: 'LightJib', firstOverlapSail: 'LightJib', secondOverlapSail: 'LightJib' },
    penalties: { boat: 'Imoca', simpleWind: 3.3, simpleEnergy: 11, simpleSpeed: 6, layout: 'grid', fullPack: false },
    energy: { boat: 'Imoca', lossWind: 3.3, recoveryWind: 4.4, energy: 55, layout: 'grid', fullPack: false },
  })
  for (const tool of tools) {
    await page.goto(`/${tool.file}.html?b=inconnu&ts=NaN&ta=Infinity&se=abc&bs=nope&o=0&th=invalid&layout=invalid&level=invalid&focus=wrong&s=invalid&fullPack=invalid&foil=invalid&winch=invalid`)
    await expect(page.getByRole('combobox', { name: 'Bateau', exact: true })).toHaveValue('Imoca')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await values(page, { [tool.wind]: 3.3 })
    await expect(page.getByRole('checkbox', { name: 'Full Pack', exact: true })).not.toBeChecked()
  }
})

test('les valeurs finies respectent les bornes et les options vides restent désactivées', async ({ page }) => {
  await page.goto('/pena.html?ts=0&bs=0&se=0&winch=0&furler=false&jacket=false&fullPack=0')
  await values(page, { 'pena-simple-wind': .1, 'pena-simple-speed': 1, 'pena-simple-energy': 0, 'pena-double-energy': 0, 'pena-rent-energy': 0 })
  for (const name of ['Full Pack', 'Winch', 'Enrouleur', 'Veste']) await expect(page.getByRole('checkbox', { name, exact: true })).not.toBeChecked()
  await page.goto('/energy.html?energy=0&lossWind=0&recoveryWind=999&o=')
  await values(page, { 'energy-loss-wind': .1, 'energy-recovery-wind': 35, 'energy-recovery-energy': 0 })
  for (const name of ['Full Pack', 'Winch', 'Enrouleur', 'Veste', 'Coussin']) await expect(page.getByRole('checkbox', { name, exact: true })).not.toBeChecked()
  await page.goto('/polar.html?ts=999&ta=-999&o=')
  await values(page, { tws: 40, twa: 180 })
  for (const id of ['full-pack', 'foil', 'hull', 'sail-Code0', 'sail-LightJib', 'sail-LightGnk', 'sail-HeavyGnk', 'sail-Staysail']) await expect(page.locator(`#${id}`)).not.toBeChecked()
  for (const id of ['sail-Jib', 'sail-Spi']) await expect(page.locator(`#${id}`)).toBeChecked()
  await page.goto('/autoSail.html?ts=0&ta=0&twsStart=0&twsEnd=999&twaStart=-10&twaEnd=999&o=&s=J')
  await values(page, { 'autosail-tws': .1, 'autosail-twa': 0, 'autosail-tws-start': .1, 'autosail-tws-end': 50, 'autosail-twa-start': 0, 'autosail-twa-end': 180 })
})

test('une voile scalaire ou une plage invalide conserve les sélections AutoSail de session', async ({ page }) => {
  await seedSession(page, { autosail: {
    boat: 'Class 40 2021', options: { foil: false, hull: false, fullPack: false }, selectedSails: ['Jib', 'LightJib', 'LightGnk'],
    sailForTwa: 'LightJib', sailForTws: 'LightJib', sailForRange: 'LightJib', firstOverlapSail: 'LightJib', secondOverlapSail: 'LightGnk',
    overlapPrecision: '0.01', twsStart: 2, twsEnd: 3, twaStart: 30, twaEnd: 140,
  } })
  await page.goto('/autoSail.html?s=LJ,LG&precision=0.2&twsStart=oops&twsEnd=Infinity&twaStart=NaN&twaEnd=-Infinity&sailForRange=bad&secondOverlapSail=bad')
  await values(page, { 'autosail-tws-start': 2, 'autosail-tws-end': 3, 'autosail-twa-start': 30, 'autosail-twa-end': 140 })
  for (const index of [0, 1, 2]) await expect(page.locator(`#autosail-chart-${index} .autosail-settings select`)).toHaveValue('LightJib')
  await overlapSails(page, ['LightJib', 'LightGnk'])
  await expect(page.getByRole('group', { name: 'Précision du recouvrement' }).getByRole('button', { name: '0,01', exact: true })).toHaveAttribute('aria-pressed', 'true')
})

for (const tool of tools) {
  test(`les éditions de ${tool.file}.html ne sont pas réécrasées par sa query initiale`, async ({ page }) => {
    await page.goto(`/${tool.file}.html?b=Class_40&ts=12&ta=90&se=80&bs=8&s=LJ&o=FP&th=dark`)
    const field = page.locator(`[id="${tool.edit}-number"]`)
    await field.fill('9,2')
    await field.blur()
    await values(page, { [tool.edit]: 9.2 })
    await page.locator('.theme-switch').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await values(page, { [tool.edit]: 9.2 })
    const next = tool.file === 'energy' ? 'pena' : 'energy'
    await expect.poll(() => linkParameter(page, next, tool.edit === 'energy-recovery-energy' ? 'se' : 'ts')).toBe('9.2')
  })
}

test('changer de langue modifie le nom du fichier sans remonter les graphiques ni relancer les workers', async ({ page }) => {
  await page.addInitScript(() => {
    window.toolUrlWorkerStarts = 0
    const NativeWorker = window.Worker
    window.Worker = class extends NativeWorker {
      constructor(url: string | URL, options?: WorkerOptions) {
        super(url, options)
        window.toolUrlWorkerStarts++
      }
    }
  })
  for (const file of ['polar', 'autoSail']) {
    await page.goto(`/${file}.html?b=Class_40&s=LJ&o=FP&ts=2&ta=90`)
    const canvases = page.locator(file === 'polar' ? '#polaire .chart-card canvas' : '.autosail-card canvas')
    await expect(canvases).toHaveCount(file === 'polar' ? 7 : 4)
    const before = await page.evaluate(() => window.toolUrlWorkerStarts)
    expect(before).toBeGreaterThan(0)
    await canvases.first().evaluate(canvas => canvas.setAttribute('data-tool-url-marker', 'preserved'))
    await page.getByRole('button', { name: 'English', exact: true }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect.poll(() => new URL(page.url()).pathname).toBe(`/${file}En.html`)
    await expect(page.locator('canvas[data-tool-url-marker="preserved"]')).toHaveCount(1)
    expect(await page.evaluate(() => window.toolUrlWorkerStarts)).toBe(before)
    await page.getByRole('button', { name: 'Français', exact: true }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    await expect.poll(() => new URL(page.url()).pathname).toBe(`/${file}.html`)
    await expect(page.locator('canvas[data-tool-url-marker="preserved"]')).toHaveCount(1)
    expect(await page.evaluate(() => window.toolUrlWorkerStarts)).toBe(before)
  }
})

test('les liens classiques transmettent les derniers réglages et conservent le contexte au retour', async ({ page }) => {
  await page.goto('/polar.html?b=Class_40&ts=12&ta=-90&o=FP&s=LJ&bs=8&se=44&th=dark&tag=conserver')
  await page.locator('#tws-number').fill('17.4')
  await page.locator('#tws-number').blur()
  await page.locator('#twa-number').fill('110.5')
  await page.locator('#twa-number').blur()
  await page.getByRole('combobox', { name: 'Bateau', exact: true }).selectOption('Imoca')
  await expect.poll(() => linkParameter(page, 'energy', 'ts')).toBe('17.4')
  await expect.poll(() => linkParameter(page, 'energy', 'ta')).toBe('110.5')
  await expect.poll(() => linkParameter(page, 'energy', 'b')).toBe('Imoca')
  for (const tool of tools) {
    const href = new URL((await headerLink(page, tool.file).getAttribute('href'))!, page.url())
    expect(href.pathname).toBe(`/${tool.file}.html`)
    expect(href.hash).toBe('')
    expect(href.searchParams.get('tag')).toBe('conserver')
  }
  await headerLink(page, 'energy').click()
  await expect.poll(() => new URL(page.url()).pathname).toBe('/energy.html')
  await values(page, { 'energy-loss-wind': 17.4, 'energy-recovery-energy': 44 })
  await page.locator('#energy-loss-wind-number').fill('9.4')
  await page.locator('#energy-loss-wind-number').blur()
  await page.locator('#energy-recovery-energy-number').fill('28.7')
  await page.locator('#energy-recovery-energy-number').blur()
  await expect.poll(() => linkParameter(page, 'pena', 'ts')).toBe('9.4')
  await expect.poll(() => linkParameter(page, 'pena', 'se')).toBe('28.7')
  const energyAddress = page.url()
  await headerLink(page, 'pena').click()
  await expect.poll(() => new URL(page.url()).pathname).toBe('/pena.html')
  await values(page, { 'pena-simple-wind': 9.4, 'pena-simple-energy': 28.7 })
  await page.goBack()
  await expect(page).toHaveURL(energyAddress)
  await expect(page.locator('.page-heading h1')).toHaveText('Énergie')
  await expect(page.getByRole('combobox', { name: 'Bateau', exact: true })).toHaveValue('Imoca')
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  expect(new URL(page.url()).searchParams.get('tag')).toBe('conserver')
  const wind = Number(await page.locator('#energy-loss-wind-number').inputValue())
  const energy = Number(await page.locator('#energy-recovery-energy-number').inputValue())
  await expect.poll(() => linkParameter(page, 'pena', 'ts')).toBe(String(wind))
  await expect.poll(() => linkParameter(page, 'pena', 'se')).toBe(String(energy))
})

test('les anciens liens hash restent utilisables et les quatre liens du menu sont classiques', async ({ page }) => {
  for (const tool of tools) {
    await page.goto(`/${tool.hash}`)
    await expect(page.locator('.page-heading h1')).toHaveText(tool.heading)
    expect(new URL(page.url()).hash).toBe(tool.hash)
    for (const destination of tools) {
      const href = new URL((await headerLink(page, destination.file).getAttribute('href'))!, page.url())
      expect(href.pathname).toBe(`/${destination.file}.html`)
      expect(href.hash).toBe('')
    }
  }
})

test('les alias tws et twa suivent les éditions et restent secondaires aux paramètres historiques', async ({ page }) => {
  const address = '/polar.html?tws=12&twa=90&ts=invalid&ta=invalid'
  await page.goto(address)
  await values(page, { tws: 12, twa: 90 })
  await page.locator('#tws-number').fill('17.4')
  await page.locator('#tws-number').blur()
  await page.locator('#twa-number').fill('110.5')
  await page.locator('#twa-number').blur()
  await exactAddress(page, address)
  for (const [key, value] of [['ts', '17.4'], ['tws', '17.4'], ['ta', '110.5'], ['twa', '110.5']]) {
    await expect.poll(() => linkParameter(page, 'energy', key)).toBe(value)
  }
  await headerLink(page, 'energy').click()
  await values(page, { 'energy-loss-wind': 17.4 })
  await page.locator('#energy-loss-wind-number').fill('20.2')
  await page.locator('#energy-loss-wind-number').blur()
  await expect.poll(() => linkParameter(page, 'polar', 'tws')).toBe('20.2')
  await headerLink(page, 'polar').click()
  await values(page, { tws: 20.2, twa: 110.5 })

  await page.goto('/polar.html?tws=12&twa=90&ts=19&ta=-100')
  await values(page, { tws: 19, twa: 100 })
  await page.goto('/polar.html?tws=12&twa=-100')
  await values(page, { tws: 12, twa: 100 })
  await page.goto('/energy.html?tws=18.5')
  await values(page, { 'energy-loss-wind': 18.5, 'energy-recovery-wind': 18.5 })
  await page.goto('/pena.html?tws=11.5')
  await values(page, { 'pena-simple-wind': 11.5, 'pena-double-wind': 11.5, 'pena-rent-wind': 11.5 })
})

test('les préférences explicites restent cohérentes entre outil, aide et accueil après rechargement', async ({ page }) => {
  await page.goto('/polarEn.html?locale=en&ts=12&tag=conserver')
  await page.getByRole('button', { name: 'Français', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  await page.locator('.site-header .main-navigation').getByRole('link', { name: 'Aide', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  expect(new URL(page.url()).searchParams.get('locale')).toBe('fr')
  await page.evaluate(() => { window.location.hash = '#aide?article=tuto_pena' })
  const sectionLink = page.locator('.help-toc a[data-level="2"]').first()
  await expect(sectionLink).toHaveAttribute('href', /article=tuto_pena&section=/)
  await page.evaluate(href => { window.location.hash = href! }, await sectionLink.getAttribute('href'))
  const helpHash = new URL(page.url()).hash
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await page.locator('.theme-switch').click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  const chosenAddress = page.url()
  expect(new URL(chosenAddress).hash).toBe(helpHash)
  expect(new URL(chosenAddress).searchParams.get('tag')).toBe('conserver')
  await page.reload()
  await exactAddress(page, chosenAddress)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.locator('.site-header .main-navigation').getByRole('link', { name: 'Home', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.getByRole('button', { name: 'Français', exact: true }).click()
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

  await page.goto('/energyEn.html?lang=fr&th=light#aide?article=tuto_pena')
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await page.getByRole('button', { name: 'Français', exact: true }).click()
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  expect(new URL(page.url()).pathname).toBe('/energyEn.html')
  expect(new URL(page.url()).hash).toBe('#aide?article=tuto_pena')
})

for (const tool of [
  { file: 'polar' as const, prefix: 'polar', last: 6 },
  { file: 'autoSail' as const, prefix: 'autosail', last: 3 },
]) {
  test(`${tool.file} atteint la carte focus demandée et transmet ensuite la carte choisie`, async ({ page }) => {
    await page.goto(`/${tool.file}.html?b=Class_40&ts=12&layout=focus&focus=${tool.last}`)
    await expect(page.locator(`#${tool.prefix}-chart-${tool.last}`)).toBeInViewport({ ratio: .2 })
    const card = page.locator(`#${tool.prefix}-chart-1`)
    await card.getByRole('button', { name: 'Revenir à la grille', exact: true }).click()
    await expect.poll(() => linkParameter(page, tool.file, 'focus')).toBe('1')
    await card.getByRole('button', { name: /^Afficher .+ en focus$/ }).click()
    await expect.poll(() => linkParameter(page, tool.file, 'layout')).toBe('focus')
    await headerLink(page, tool.file).click()
    await expect(page.locator(`#${tool.prefix}-chart-1`)).toBeInViewport({ ratio: .2 })
    expect(new URL(page.url()).searchParams.get('focus')).toBe('1')
  })
}
