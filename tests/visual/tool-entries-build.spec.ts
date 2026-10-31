import { expect, test } from '@playwright/test'
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http'
import { mkdtemp, readFile, readdir, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, extname, isAbsolute, join, relative, resolve } from 'node:path'

// Keep this contract independent of the plugin's own list of emitted entries.
const entries = [
  'pena.html', 'penaEn.html',
  'energy.html', 'energyEn.html',
  'polar.html', 'polarEn.html',
  'autoSail.html', 'autoSailEn.html',
  'penaDash.html', 'energyDash.html', 'polarDash.html', 'autoSailDash.html',
]
const mimeTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
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

test('le build produit douze entrées HTML classiques et iframe identiques à index.html', async () => {
  const htmlFiles = (await readdir(outputDirectory)).filter(filename => filename.endsWith('.html')).sort()
  expect(htmlFiles).toEqual(['index.html', ...entries].sort())
  expect(indexHtml).not.toContain('/src/main.tsx')
  expect(indexHtml).toMatch(/<script[^>]+src="[^"]*\/assets\/[^"]+\.js"/)
  expect(indexHtml).toMatch(/<link[^>]+href="[^"]*\/assets\/[^"]+\.css"/)
  const indexBytes = await readFile(join(outputDirectory, 'index.html'))
  for (const entry of entries) {
    expect((await readFile(join(outputDirectory, entry))).equals(indexBytes), entry).toBe(true)
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
    expect(html).toBe(indexHtml)

    const resources = [...html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)="([^"]+)"/g)].map(match => match[1])
    expect(resources.length).toBeGreaterThanOrEqual(2)
    for (const resource of resources) {
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
