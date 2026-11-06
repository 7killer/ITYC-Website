import { expect, test } from '@playwright/test'
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http'
import { mkdtemp, readFile, readdir, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, extname, isAbsolute, join, relative, resolve } from 'node:path'

// Keep this contract independent of the plugin's own list of emitted entries.
const entries = [
  'indexEn.html', 'aide.html', 'aideEn.html',
  'pena.html', 'penaEn.html',
  'energy.html', 'energyEn.html',
  'polar.html', 'polarEn.html',
  'autoSail.html', 'autoSailEn.html',
  'dash.html', 'dashEn.html',
  ...['aide_pena', 'tuto_pena', 'aide_energy', 'tuto_energy', 'aide_polaire', 'tuto_polaire', 'aide_autoSail', 'tuto_autoSail', 'aide_dash', 'glossaire']
    .flatMap(document => [`${document}.html`, `${document}En.html`]),
  'webstore_dashEn.html', 'webstore_helpEn.html',
  'penaDash.html', 'energyDash.html', 'polarDash.html', 'autoSailDash.html',
]
const mimeTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
}

let temporaryDirectory: string | undefined
let outputDirectory: string
let indexHtml: string
let server: Server | undefined
let staticUrl: string

test.beforeAll(async () => {
  test.setTimeout(60_000)
  temporaryDirectory = await mkdtemp(join(tmpdir(), 'ityc-tool-entries-'))
  outputDirectory = join(temporaryDirectory, 'dist')
  const { build } = await import('vite')
  await build({
    root: resolve('.'),
    logLevel: 'silent',
    build: { outDir: outputDirectory, emptyOutDir: true },
  })
  indexHtml = await readFile(join(outputDirectory, 'index.html'), 'utf8')

  const serveStatic = async (request: IncomingMessage, response: ServerResponse) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname)
      const filename = resolve(outputDirectory, `.${pathname === '/' ? '/index.html' : pathname}`)
      const relativePath = relative(outputDirectory, filename)
      if (relativePath.startsWith('..') || isAbsolute(relativePath) || !(await stat(filename)).isFile()) {
        response.writeHead(404).end('Not found')
        return
      }
      const body = await readFile(filename)
      response.writeHead(200, {
        'Content-Type': mimeTypes[extname(filename)] ?? 'application/octet-stream',
        'Content-Length': body.length,
      }).end(body)
    } catch {
      response.writeHead(404).end('Not found')
    }
  }
  // This server reads actual files only. It deliberately has no SPA fallback.
  server = createServer((request, response) => { void serveStatic(request, response) })
  await new Promise<void>((done, reject) => {
    server!.once('error', reject)
    server!.listen(0, '127.0.0.1', done)
  })
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('Le serveur statique de test ne possède pas de port HTTP.')
  staticUrl = `http://127.0.0.1:${address.port}`
})

test.afterAll(async () => {
  if (server?.listening) await new Promise<void>((done, reject) => server!.close(error => error ? reject(error) : done()))
  if (temporaryDirectory) {
    // Only remove the directory this suite created directly in the system temp.
    const target = resolve(temporaryDirectory)
    if (dirname(target) !== resolve(tmpdir()) || !basename(target).startsWith('ityc-tool-entries-')) {
      throw new Error(`Nettoyage refusé en dehors du dossier temporaire de cette suite : ${target}`)
    }
    await rm(target, { recursive: true, force: true })
  }
})

function resources(html: string, url: string) {
  return [...html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)="([^"]+)"/g)]
    .map(match => match[1])
    .filter(resource => new URL(resource, url).origin === staticUrl)
}

test('le build produit les entrées publiques, historiques et iframe avec les mêmes ressources compilées', async () => {
  const htmlFiles = (await readdir(outputDirectory)).filter(filename => filename.endsWith('.html')).sort()
  expect(htmlFiles).toEqual(['index.html', ...entries].sort())
  expect(indexHtml).not.toContain('/src/main.tsx')
  expect(indexHtml).toMatch(/<script[^>]+src="[^"]*\/assets\/[^"]+\.js"/)
  expect(indexHtml).toMatch(/<link[^>]+href="[^"]*\/assets\/[^"]+\.css"/)
  expect(indexHtml).toContain('<link rel="canonical" href="https://ityc.fr/"')
  for (const entry of entries) {
    const html = await readFile(join(outputDirectory, entry), 'utf8')
    expect(resources(html, `${staticUrl}/${entry}`), entry).toEqual(resources(indexHtml, `${staticUrl}/index.html`))
    expect(html, entry).toContain(`<html lang="${entry.endsWith('En.html') ? 'en' : 'fr'}"`)
    expect(html.match(/googletagmanager\.com\/gtag\/js\?id=G-PNQ15CT161/g), entry).toHaveLength(1)
    expect(html, entry).toMatch(/<link rel="canonical" href="https:\/\/ityc\.fr\/[^"?#]*"/)
    if (entry.endsWith('Dash.html') || entry.startsWith('webstore_')) expect(html).toContain('content="noindex, follow"')
  }
})

for (const entry of entries) {
  test(`${entry} et ses ressources sont servis depuis les vrais fichiers compilés`, async ({ request }) => {
    const url = `${staticUrl}/${entry}?b=Class_40&s=C0&o=FP&ts=18&ta=120`
    const response = await request.get(url, { maxRedirects: 0 })
    expect(response.status()).toBe(200)
    expect(response.url()).toBe(url)
    expect(response.headers()['location']).toBeUndefined()
    expect(response.headers()['content-type']).toMatch(/^text\/html/)
    const html = await response.text()
    expect(html).toBe(await readFile(join(outputDirectory, entry), 'utf8'))

    const localResources = resources(html, url)
    expect(localResources.length).toBeGreaterThanOrEqual(2)
    for (const resource of localResources) {
      const assetUrl = new URL(resource, url)
      expect(assetUrl.origin).toBe(staticUrl)
      const asset = await request.get(assetUrl.href, { maxRedirects: 0 })
      expect(asset.status(), resource).toBe(200)
      const extension = extname(assetUrl.pathname)
      expect(['.js', '.css'], resource).toContain(extension)
      expect(asset.headers()['content-type'], resource).toBe(mimeTypes[extension])
      const filename = resolve(outputDirectory, `.${assetUrl.pathname}`)
      expect((await asset.body()).equals(await readFile(filename)), resource).toBe(true)
    }
  })
}

test('le sitemap expose les 34 pages canoniques avec leurs alternances FR/EN et robots.txt le déclare', async ({ request }) => {
  const response = await request.get(`${staticUrl}/sitemap.xml`)
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toMatch(/^application\/xml/)
  const xml = await response.text()
  expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
  expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"')
  const blocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(match => match[1])
  const locations = blocks.map(block => block.match(/<loc>([^<]+)<\/loc>/)![1])
  const expected = ['index.html', ...entries]
    .filter(entry => !entry.endsWith('Dash.html') && !entry.startsWith('webstore_'))
    .map(entry => `https://ityc.fr/${entry === 'index.html' ? '' : entry}`)
  expect(locations.sort()).toEqual(expected.sort())
  expect(new Set(locations).size).toBe(34)
  for (const block of blocks) {
    const location = new URL(block.match(/<loc>([^<]+)<\/loc>/)![1])
    expect(location.hash).toBe('')
    expect(location.search).toBe('')
    const filename = location.pathname === '/' ? 'index.html' : location.pathname.slice(1)
    const page = await request.get(`${staticUrl}/${filename}`, { maxRedirects: 0 })
    expect(page.status(), filename).toBe(200)
    const alternates = [...block.matchAll(/<xhtml:link rel="alternate" hreflang="(fr|en)" href="([^"]+)" \/>/g)]
    expect(alternates.map(match => match[1])).toEqual(['fr', 'en'])
    expect(alternates.map(match => match[2])).toContain(location.href)
  }
  const robots = await request.get(`${staticUrl}/robots.txt`)
  expect(robots.status()).toBe(200)
  expect(await robots.text()).toContain('Sitemap: https://ityc.fr/sitemap.xml')
})

for (const document of ['aide_pena', 'tuto_pena', 'aide_energy', 'tuto_energy', 'aide_polaire', 'tuto_polaire', 'aide_autoSail', 'tuto_autoSail', 'aide_dash', 'glossaire']) {
  for (const locale of ['fr', 'en'] as const) {
    test(`${document}${locale === 'en' ? 'En' : ''}.html ouvre directement son article dans la bonne langue`, async ({ page }) => {
      await page.addInitScript(language => localStorage.setItem('locale', language === 'fr' ? 'en' : 'fr'), locale)
      const file = `${document}${locale === 'en' ? 'En' : ''}.html`
      const response = await page.goto(`${staticUrl}/${file}`)
      expect(response!.status()).toBe(200)
      const source = await readFile(resolve('src/features/help/content', locale, `${document}.md`), 'utf8')
      const title = source.match(/^# (.+)$/m)![1]
      await expect(page.locator('html')).toHaveAttribute('lang', locale)
      await expect(page.locator('.help-article > h2')).toHaveText(title)
      await expect(page).toHaveURL(`${staticUrl}/${file}`)
    })
  }
}

test('les anciens chemins Dashboard et WebStore affichent leur destination', async ({ page }) => {
  for (const [file, locale] of [['dash.html', 'fr'], ['dashEn.html', 'en'], ['webstore_dashEn.html', 'en']] as const) {
    await page.goto(`${staticUrl}/${file}`)
    await expect(page.locator('html')).toHaveAttribute('lang', locale)
    await expect(page.locator('.page-heading h1')).toHaveText('Dashboard')
  }
  await page.goto(`${staticUrl}/webstore_helpEn.html`)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  const source = await readFile(resolve('src/features/help/content/en/aide_dash.md'), 'utf8')
  await expect(page.locator('.help-article > h2')).toHaveText(source.match(/^# (.+)$/m)![1])
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://ityc.fr/aide_dashEn.html')
})

test('une ancienne ancre de tutoriel reste accessible et le changement de langue conserve l’article', async ({ page }) => {
  await page.goto(`${staticUrl}/tuto_pena.html#tp_p1`)
  await expect(page.locator('#tp_p1').locator('..').locator(':scope > h3')).toBeInViewport()
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await expect(page).toHaveURL(/\/tuto_penaEn\.html\?[^#]*#aide\?article=tuto_pena&section=tp_p1$/)
  await expect(page.locator('#tp_p1').locator('..').locator(':scope > h3')).toBeInViewport()
  await page.reload()
  await expect(page.locator('#tp_p1').locator('..').locator(':scope > h3')).toBeInViewport()
})

test('energyEn.html initialise React et ses paramètres depuis le vrai build statique', async ({ page }) => {
  const query = '?b=Class_40&ts=18.5&se=60&th=light'
  const url = `${staticUrl}/energyEn.html${query}`
  const response = await page.goto(url)
  expect(response).not.toBeNull()
  expect(response!.status()).toBe(200)
  expect(response!.request().redirectedFrom()).toBeNull()

  await expect(page).toHaveURL(url)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect(page.locator('#energy-loss-wind-number')).toHaveValue('18.5')
  await expect(page.locator('#energy-recovery-wind-number')).toHaveValue('18.5')
  await expect(page.locator('#energy-recovery-energy-number')).toHaveValue('60.0')
  await expect(page.locator('.analysis-card canvas')).toHaveCount(2)
  expect(await page.evaluate(() => ({ pathname: location.pathname, search: location.search, hash: location.hash })))
    .toEqual({ pathname: '/energyEn.html', search: query, hash: '' })
})

test('energyDash.html charge le mode iframe compact depuis le vrai build statique', async ({ page }) => {
  const query = '?b=Class_40&ts=18.5&se=60&th=dark'
  const url = `${staticUrl}/energyDash.html${query}`
  await page.setContent(`<iframe id="embedded-tool" src="${url.replaceAll('&', '&amp;')}" width="1100" height="900"></iframe>`)
  const frame = page.frameLocator('#embedded-tool')
  await expect(frame.locator('.analysis-card canvas')).toHaveCount(2)
  await expect(frame.locator('#energy-loss-wind-number')).toHaveValue('18.5')
  await expect(frame.locator('#energy-recovery-wind-number')).toHaveValue('18.5')
  await expect(frame.locator('#energy-recovery-energy-number')).toHaveValue('60.0')
  await expect(frame.locator('.boat-selector')).toHaveCount(0)
  await expect(frame.locator('.options-panel, .sails-panel, .analysis-toolbar-options')).toHaveCount(0)
  await expect(frame.locator('footer')).toHaveCount(0)

  const links = frame.locator('nav a[href]')
  await expect(links).toHaveCount(4)
  const destinations = await links.evaluateAll(elements => elements.map(element => (element as HTMLAnchorElement).href))
  expect(destinations.map(destination => new URL(destination).pathname).sort())
    .toEqual(['/penaDash.html', '/energyDash.html', '/polarDash.html', '/autoSailDash.html'].sort())
  for (const destination of destinations) {
    const address = new URL(destination)
    expect(address.searchParams.get('b')).toBe('Class_40')
    expect(address.searchParams.get('th')).toBe('dark')
  }
  expect(await frame.locator('body').evaluate(() => ({ pathname: location.pathname, search: location.search, hash: location.hash })))
    .toEqual({ pathname: '/energyDash.html', search: query, hash: '' })
})

test('une URL inexistante ne bénéficie pas d’un fallback sur le serveur statique', async ({ request }) => {
  const response = await request.get(`${staticUrl}/unknown-tool.html`)
  expect(response.status()).toBe(404)
})
