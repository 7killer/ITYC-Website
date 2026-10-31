# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: help-wiki.spec.ts >> toutes les captures Markdown FR et EN sont servies dans leurs thèmes disponibles
- Location: tests\visual\help-wiki.spec.ts:172:1

# Error details

```
Error: /assets/help/polar/polar-expert-current.png

expect(received).toMatch(expected)

Expected pattern: /^image\//
Received string:  "text/html"
```

# Test source

```ts
  93  |   expect(destination).toMatch(/article=tuto_pena.*section=/)
  94  |   const sectionId = new URLSearchParams(destination!.split('?')[1]).get('section')!
  95  |   const heading = page.locator(`[id="${sectionId}"] h3`)
  96  |   const title = await heading.textContent()
  97  | 
  98  |   await sectionLink.click()
  99  |   await expect(page).toHaveURL(new RegExp(`article=tuto_pena.*section=${encodeURIComponent(sectionId)}`))
  100 |   await expect(heading).toBeInViewport()
  101 |   const sharedUrl = page.url()
  102 | 
  103 |   await page.reload()
  104 |   await expect(page).toHaveURL(sharedUrl)
  105 |   await expect(heading).toHaveText(title!)
  106 |   await expect(heading).toBeInViewport()
  107 | })
  108 | 
  109 | test('l’ancienne ancre Flotte du Dashboard reste accessible après rechargement', async ({ page }) => {
  110 |   await page.goto('/#aide?article=aide_dash&section=tabDashTab5')
  111 |   const fleet = page.locator('h4').filter({ has: page.locator('#tabDashTab5') })
  112 |   await expect(fleet).toHaveText('5. Page Flotte')
  113 |   await expect(fleet).toBeInViewport()
  114 |   await page.reload()
  115 |   await expect(page).toHaveURL(/article=aide_dash&section=tabDashTab5$/)
  116 |   await expect(fleet).toBeInViewport()
  117 | })
  118 | 
  119 | test('la recherche trouve aussi les explications dans le corps du Dashboard', async ({ page }) => {
  120 |   await page.goto('/#aide')
  121 |   await page.getByRole('searchbox').fill('carte de présentation')
  122 |   const result = page.locator('.help-results a[href*="article=aide_dash"]')
  123 |   await expect(result).toBeVisible()
  124 |   await result.click()
  125 |   await expect(page.locator('.help-article > h2')).toHaveText('Aide Dashboard')
  126 |   await expect(page.locator('.help-article')).toContainText('Chargé à la carte de présentation pour les autres bateaux.')
  127 | })
  128 | 
  129 | test('le Dashboard conserve les détails de flotte et de configuration présents dans l’aide d’origine', async ({ page }) => {
  130 |   await page.goto('/#aide?article=aide_dash')
  131 |   const article = page.locator('.help-article')
  132 |   await expect(article).toContainText('RT : Ouvre un onglet de routage zezo avec les coordonnées et les options pré remplies.')
  133 |   await expect(article).toContainText('Le reste des options zezo seront celles que vous avez utilisé sur la page zezo pour la course concernée')
  134 |   await expect(article).toContainText('Time : Heure de la dernière itération serveur reçue.')
  135 |   await expect(article).toContainText('UTC ou temps local selon configuration utilisateur')
  136 |   await expect(article).toContainText('Team : Team du joueur.')
  137 |   await expect(article).toContainText("Chargé à l'ouverture de la course pour les joueurs de la team.")
  138 |   await expect(article).toContainText('Chargé à la carte de présentation pour les autres bateaux.')
  139 |   await expect(article).toContainText("Pré - chargé au démarrage avec les données d'ITYC.")
  140 |   await expect(article).toContainText("Peut être caché si décoché dans l'onglet Configuration section Flotte.")
  141 |   await expect(article).toContainText('DTU : Distance To yoU (mn).')
  142 |   await expect(article).toContainText('ERT : Enhanced Race Time.')
  143 | })
  144 | 
  145 | test('les formules et les tableaux de référence restent consultables', async ({ page }) => {
  146 |   await page.goto('/#aide?article=aide_pena')
  147 |   await expect.poll(() => page.locator('.help-article .katex').count()).toBeGreaterThan(0)
  148 |   await expect(page.locator('.help-article .katex-error')).toHaveCount(0)
  149 |   await expect(page.locator('.help-article')).toContainText('Temps minimal de manoeuvre')
  150 | 
  151 |   await page.goto('/#aide?article=aide_energy')
  152 |   const rates = page.locator('.help-article table').filter({ hasText: 'Taux de pertes' })
  153 |   await expect(rates).toHaveCount(1)
  154 |   await expect(rates.getByRole('row')).toHaveText([
  155 |     /Manoeuvre\s*Taux de pertes/, /Virement\s*10%/, /Empannage\s*10%/, /Changement de voile\s*20%/,
  156 |   ])
  157 |   await expect.poll(() => page.locator('.help-article .katex').count()).toBeGreaterThan(0)
  158 |   await expect(page.locator('.help-article .katex-error')).toHaveCount(0)
  159 | })
  160 | 
  161 | test('la version anglaise garde le document courant et ses captures', async ({ page }) => {
  162 |   await page.goto('/#aide?article=aide_dash')
  163 |   await page.getByRole('button', { name: 'English', exact: true }).click()
  164 |   await expect(page.locator('.help-article > h2')).toHaveText('Dashboard Help')
  165 |   await expect(page).toHaveURL(/article=aide_dash$/)
  166 |   await expect(page.locator('.help-content-section').first()).toContainText('Navigation on Virtual Regatta')
  167 |   await expect(page.locator('.help-article')).toContainText('RT : Opens a zezo routing tab')
  168 |   expect(await page.locator('.help-figure img').count()).toBeGreaterThan(0)
  169 |   await expect(page.locator('.help-article-footer a').first()).toHaveAttribute('href', 'https://ityc.fr/aide_dashEn.html')
  170 | })
  171 | 
  172 | test('toutes les captures Markdown FR et EN sont servies dans leurs thèmes disponibles', async ({ request }) => {
  173 |   const imagePaths = new Set<string>()
  174 |   for (const locale of ['fr', 'en']) {
  175 |     const directory = resolve('src/features/help/content', locale)
  176 |     for (const filename of readdirSync(directory).filter(name => name.endsWith('.md'))) {
  177 |       const source = readFileSync(resolve(directory, filename), 'utf8')
  178 |       for (const image of source.matchAll(/!\[[^\]]*\]\(([^\n)]+)\)/g)) {
  179 |         const path = image[1]
  180 |         expect(path, `${locale}/${filename}`).toMatch(/^\/assets\/help\//)
  181 |         imagePaths.add(path)
  182 |         const dark = path.replace(/\.(png|jpg|jpeg)$/i, '_b.$1')
  183 |         if (existsSync(resolve('public', decodeURI(dark).replace(/^\//, '')))) imagePaths.add(dark)
  184 |       }
  185 |     }
  186 |   }
  187 |   expect(imagePaths.size).toBeGreaterThan(100)
  188 |   const paths = [...imagePaths]
  189 |   for (let offset = 0; offset < paths.length; offset += 12) {
  190 |     await Promise.all(paths.slice(offset, offset + 12).map(async path => {
  191 |       const response = await request.head(path)
  192 |       expect(response.ok(), path).toBe(true)
> 193 |       expect(response.headers()['content-type'], path).toMatch(/^image\//)
      |                                                        ^ Error: /assets/help/polar/polar-expert-current.png
  194 |     }))
  195 |   }
  196 | })
  197 | 
```