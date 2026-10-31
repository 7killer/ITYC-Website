# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: polar-expert-mobile.spec.ts >> la polaire Expert reste dans son cadre en grid à 360px
- Location: tests\visual\polar-expert-mobile.spec.ts:31:5

# Error details

```
Error: Les commandes fixes ne doivent pas masquer le centre du tracé

Les commandes fixes ne doivent pas masquer le centre du tracé

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false

Call Log:
- Timeout 10000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - link "ITYC, accueil" [ref=e7] [cursor=pointer]:
          - /url: index.html?layout=grid&level=expert&focus=0&displayAuto=1&displayFoils=1&displaySails=1&b=Class_40&o=FP&ts=18&ta=120&th=dark&fullPack=1&foil=1&hull=1&sails=Jib%2CSpi%2CCode0%2CLightJib%2CLightGnk%2CHeavyGnk%2CStaysail&lang=fr#accueil
          - text: ITYC
        - generic "Langue" [ref=e8]:
          - button "Français" [pressed] [ref=e9] [cursor=pointer]:
            - generic [aria-hidden] [ref=e10]: 🇫🇷
          - button "English" [ref=e11] [cursor=pointer]:
            - generic [aria-hidden] [ref=e12]: 🇬🇧
      - navigation "Navigation principale" [ref=e13]:
        - list [ref=e14]:
          - listitem [ref=e15]:
            - link "Accueil" [ref=e16] [cursor=pointer]:
              - /url: index.html?layout=grid&level=expert&focus=0&displayAuto=1&displayFoils=1&displaySails=1&b=Class_40&o=FP&ts=18&ta=120&th=dark&fullPack=1&foil=1&hull=1&sails=Jib%2CSpi%2CCode0%2CLightJib%2CLightGnk%2CHeavyGnk%2CStaysail&lang=fr#accueil
          - listitem [ref=e17]:
            - link "Pénalités" [ref=e18] [cursor=pointer]:
              - /url: pena.html?layout=grid&level=expert&focus=0&displayAuto=1&displayFoils=1&displaySails=1&b=Class_40&o=FP&ts=18&ta=120&th=dark&fullPack=1&foil=1&hull=1&sails=Jib%2CSpi%2CCode0%2CLightJib%2CLightGnk%2CHeavyGnk%2CStaysail
          - listitem [ref=e19]:
            - link "Énergie" [ref=e20] [cursor=pointer]:
              - /url: energy.html?layout=grid&level=expert&focus=0&displayAuto=1&displayFoils=1&displaySails=1&b=Class_40&o=FP&ts=18&ta=120&th=dark&fullPack=1&foil=1&hull=1&sails=Jib%2CSpi%2CCode0%2CLightJib%2CLightGnk%2CHeavyGnk%2CStaysail
          - listitem [ref=e21]:
            - link "Polaires" [ref=e22] [cursor=pointer]:
              - /url: polar.html?layout=grid&level=expert&focus=0&displayAuto=1&displayFoils=1&displaySails=1&b=Class_40&o=FP&ts=18&ta=120&th=dark&fullPack=1&foil=1&hull=1&sails=Jib%2CSpi%2CCode0%2CLightJib%2CLightGnk%2CHeavyGnk%2CStaysail
          - listitem [ref=e23]:
            - link "Voiles Auto" [ref=e24] [cursor=pointer]:
              - /url: autoSail.html?layout=grid&level=expert&focus=0&displayAuto=1&displayFoils=1&displaySails=1&b=Class_40&o=FP&ts=18&ta=120&th=dark&fullPack=1&foil=1&hull=1&sails=Jib%2CSpi%2CCode0%2CLightJib%2CLightGnk%2CHeavyGnk%2CStaysail
          - listitem [ref=e25]:
            - link "Dash" [ref=e26] [cursor=pointer]:
              - /url: index.html?layout=grid&level=expert&focus=0&displayAuto=1&displayFoils=1&displaySails=1&b=Class_40&o=FP&ts=18&ta=120&th=dark&fullPack=1&foil=1&hull=1&sails=Jib%2CSpi%2CCode0%2CLightJib%2CLightGnk%2CHeavyGnk%2CStaysail&lang=fr#dash
          - listitem [ref=e27]:
            - link "Aide" [ref=e28] [cursor=pointer]:
              - /url: index.html?layout=grid&level=expert&focus=0&displayAuto=1&displayFoils=1&displaySails=1&b=Class_40&o=FP&ts=18&ta=120&th=dark&fullPack=1&foil=1&hull=1&sails=Jib%2CSpi%2CCode0%2CLightJib%2CLightGnk%2CHeavyGnk%2CStaysail&lang=fr#aide
      - checkbox [checked] [ref=e31]
  - generic [ref=e33]:
    - generic [ref=e34]:
      - heading "Polaires" [level=1] [ref=e36]
      - paragraph [ref=e37]:
        - button "Accueil" [ref=e38] [cursor=pointer]
        - generic [ref=e39]: /
        - text: Polaires
    - generic [ref=e40]:
      - region "Contrôles de navigation" [ref=e41]:
        - combobox "Bateau" [ref=e43]:
          - option "Cruiser Racer"
          - option "Class 40 2021" [selected]
          - option "Figaro 3"
          - option "OffShore Racer"
          - option "Imoca"
          - option "Mini 6.50"
          - option "Mod70"
          - option "Ocean 50 (Multi 50)"
          - option "Volvo 65"
          - option "Super Maxi 100"
          - option "Tara"
          - option "Ultim (Crew)"
          - option "Ultim (Solo)"
          - option "Ultim BP XI"
          - option "Olympus"
          - option "Caravelle"
        - paragraph [ref=e44]: "MAJ : mardi 2 juillet 2024 20:33:41"
        - link "Tutoriel" [ref=e45] [cursor=pointer]:
          - /url: "#aide"
        - group "Disposition des courbes" [ref=e46]:
          - button "Grille" [pressed] [ref=e47] [cursor=pointer]
          - button "Focus" [ref=e48] [cursor=pointer]
      - region "Réglages de calcul" [ref=e49]:
        - region "Options" [ref=e50]:
          - heading "Option" [level=2] [ref=e51]
          - generic [ref=e52]:
            - generic [ref=e53] [cursor=pointer]:
              - checkbox "Full Pack" [checked] [ref=e54]
              - generic [ref=e57]: Full Pack
            - generic [ref=e58] [cursor=pointer]:
              - checkbox "Foils" [checked] [ref=e59]
              - generic [ref=e62]: Foils
            - generic [ref=e63] [cursor=pointer]:
              - checkbox "Polish coque" [checked] [ref=e64]
              - generic [ref=e67]: Polish coque
            - generic [ref=e68] [cursor=pointer]:
              - checkbox "Brise" [checked] [ref=e69]
              - generic [ref=e72]: Brise
            - generic [ref=e73] [cursor=pointer]:
              - checkbox "Reaching" [checked] [ref=e74]
              - generic [ref=e77]: Reaching
            - generic [ref=e78] [cursor=pointer]:
              - checkbox "Petit temps" [checked] [ref=e79]
              - generic [ref=e82]: Petit temps
        - region "Voiles" [ref=e83]:
          - heading "Voiles" [level=2] [ref=e84]
          - generic [ref=e85]:
            - generic [ref=e86] [cursor=pointer]:
              - checkbox "Foc (J)" [checked] [ref=e87]
              - generic [ref=e90]: Foc (J)
            - generic [ref=e91] [cursor=pointer]:
              - checkbox "Génois léger (LJ)" [checked] [ref=e92]
              - generic [ref=e95]: Génois léger (LJ)
            - generic [ref=e96] [cursor=pointer]:
              - checkbox "Spi lourd (HG)" [checked] [ref=e97]
              - generic [ref=e100]: Spi lourd (HG)
            - generic [ref=e101] [cursor=pointer]:
              - checkbox "Code 0" [checked] [ref=e102]
              - generic [ref=e105]: Code 0
            - generic [ref=e106] [cursor=pointer]:
              - checkbox "Spi (S)" [checked] [ref=e107]
              - generic [ref=e110]: Spi (S)
            - generic [ref=e111] [cursor=pointer]:
              - checkbox "Spi léger (LG)" [checked] [ref=e112]
              - generic [ref=e115]: Spi léger (LG)
            - generic [ref=e116] [cursor=pointer]:
              - checkbox "Trinquette (SS)" [checked] [ref=e117]
              - generic [ref=e120]: Trinquette (SS)
        - region "Modes d’affichage" [ref=e121]:
          - group "Niveau de détail" [ref=e122]:
            - button "Normal" [ref=e123] [cursor=pointer]
            - button "Expert" [pressed] [ref=e124] [cursor=pointer]
  - main [ref=e125]:
    - region "Analyse polaire experte" [ref=e126]:
      - generic [ref=e127]:
        - article [ref=e128]:
          - generic [ref=e129]:
            - heading "Vitesse selon le TWA" [level=3] [ref=e131]
            - generic [ref=e132]:
              - button "Réinitialiser le zoom et le déplacement de Vitesse selon le TWA" [ref=e133] [cursor=pointer]: ↺
              - button "Afficher Vitesse selon le TWA en focus" [ref=e134] [cursor=pointer]:
                - generic [aria-hidden] [ref=e136]: ↗
          - 'generic "Zone de tracé : Vitesse selon le TWA" [ref=e137]'
        - article [ref=e140]:
          - generic [ref=e141]:
            - heading "Vitesse selon le TWS" [level=3] [ref=e143]
            - generic [ref=e144]:
              - button "Réinitialiser le zoom et le déplacement de Vitesse selon le TWS" [ref=e145] [cursor=pointer]: ↺
              - button "Afficher Vitesse selon le TWS en focus" [ref=e146] [cursor=pointer]:
                - generic [aria-hidden] [ref=e148]: ↗
          - 'generic "Zone de tracé : Vitesse selon le TWS" [ref=e149]'
      - region "Polaire experte" [ref=e152]:
        - button "Réinitialiser le zoom de la polaire" [ref=e154] [cursor=pointer]: ↺
        - complementary [ref=e157]:
          - generic "Affichage de la polaire" [ref=e158]:
            - button "Toutes" [ref=e159] [cursor=pointer]
            - button "Foils" [ref=e160] [cursor=pointer]
            - button "Voiles Auto" [pressed] [ref=e161] [cursor=pointer]
          - generic [ref=e162]:
            - generic [ref=e163]:
              - generic [ref=e164]: True Wind Angle
              - generic [ref=e165]:
                - textbox "True Wind Angle" [ref=e166]: "120.0"
                - generic [ref=e167]: °
              - slider "True Wind Angle 120.0 °" [ref=e168] [cursor=pointer]: "120"
            - generic [ref=e169]:
              - generic [ref=e170]: True Wind Speed
              - generic [ref=e171]:
                - textbox "True Wind Speed" [ref=e172]: "18.0"
                - generic [ref=e173]: nds
              - slider "True Wind Speed 18.0 nds" [ref=e174] [cursor=pointer]: "18"
          - generic [ref=e175]:
            - heading "Actuelle" [level=3] [ref=e176]
            - generic [ref=e177]:
              - term [ref=e178]: TWA
              - definition [ref=e179]: 120,0°
              - term [ref=e180]: Vitesse
              - definition [ref=e181]: 14,23 nds
              - term [ref=e182]: VMG
              - definition [ref=e183]: 7,11 nds
              - term [ref=e184]: Voile
              - definition [ref=e185]: Code 0
          - generic [ref=e186]:
            - heading "Vitesse max" [level=3] [ref=e187]
            - generic [ref=e188]:
              - term [ref=e189]: TWA
              - definition [ref=e190]: 125,0°
              - term [ref=e191]: Vitesse
              - definition [ref=e192]: 14,45 nds
              - term [ref=e193]: Voile
              - definition [ref=e194]: Code 0
          - generic [ref=e195]:
            - heading "Best VMG" [level=3] [ref=e196]
            - generic [ref=e197]:
              - term [ref=e198]: Au près
              - definition [ref=e199]: 50,0° · 5,70 nds
              - term [ref=e200]: Au portant
              - definition [ref=e201]: 145,0° · 10,72 nds
          - generic [ref=e202]:
            - heading "Plage Code 0" [level=3] [ref=e203]
            - generic [ref=e204]:
              - term [ref=e205]: TWA mini
              - definition [ref=e206]: 62,9°
              - term [ref=e207]: TWA maxi
              - definition [ref=e208]: 132,1°
              - term [ref=e209]: TWS mini
              - definition [ref=e210]: 2,8 nds
              - term [ref=e211]: TWS maxi
              - definition [ref=e212]: 36,7 nds
          - generic [ref=e213]:
            - heading "Voiles" [level=3] [ref=e214]
            - table [ref=e215]:
              - rowgroup [ref=e216]:
                - row [ref=e217]:
                  - columnheader "Voiles" [ref=e218]
                  - columnheader "Vitesse (nds)" [ref=e219]: Vitesse(nds)
                  - columnheader "VMG (nds)" [ref=e220]: VMG(nds)
              - rowgroup [ref=e221]:
                - row [ref=e222]:
                  - cell "Foc (J)" [ref=e223]
                  - cell "13,80" [ref=e224]
                  - cell "6,90" [ref=e225]
                - row [ref=e226]:
                  - cell "Spi (S)" [ref=e227]
                  - cell "13,80" [ref=e228]
                  - cell "6,90" [ref=e229]
                - row [ref=e230]:
                  - cell "Code 0" [ref=e231]
                  - cell "14,23" [ref=e232]
                  - cell "7,11" [ref=e233]
                - row [ref=e234]:
                  - cell "Génois léger (LJ)" [ref=e235]
                  - cell "6,09" [ref=e236]
                  - cell "3,05" [ref=e237]
                - row [ref=e238]:
                  - cell "Spi léger (LG)" [ref=e239]
                  - cell "12,04" [ref=e240]
                  - cell "6,02" [ref=e241]
                - row [ref=e242]:
                  - cell "Spi lourd (HG)" [ref=e243]
                  - cell "12,07" [ref=e244]
                  - cell "6,03" [ref=e245]
                - row [ref=e246]:
                  - cell "Trinquette (SS)" [ref=e247]
                  - cell "6,38" [ref=e248]
                  - cell "3,19" [ref=e249]
    - region "Courbes expertes de Class 40 2021" [ref=e250]:
      - generic [ref=e251]:
        - article [ref=e252]:
          - generic [ref=e253]:
            - heading "BVMG" [level=3] [ref=e255]
            - generic [ref=e256]:
              - button "Réinitialiser le zoom et le déplacement de BVMG" [ref=e257] [cursor=pointer]: ↺
              - button "Afficher BVMG en focus" [ref=e258] [cursor=pointer]:
                - generic [aria-hidden] [ref=e260]: ↗
          - 'generic "Zone de tracé : BVMG" [ref=e261]'
        - article [ref=e264]:
          - generic [ref=e265]:
            - heading "Best Speed" [level=3] [ref=e267]
            - generic [ref=e268]:
              - button "Réinitialiser le zoom et le déplacement de Best Speed" [ref=e269] [cursor=pointer]: ↺
              - button "Afficher Best Speed en focus" [ref=e270] [cursor=pointer]:
                - generic [aria-hidden] [ref=e272]: ↗
          - 'generic "Zone de tracé : Best Speed" [ref=e273]'
        - article [ref=e276]:
          - generic [ref=e277]:
            - heading "VMG" [level=3] [ref=e279]
            - generic [ref=e280]:
              - button "Réinitialiser le zoom et le déplacement de VMG" [ref=e281] [cursor=pointer]: ↺
              - button "Afficher VMG en focus" [ref=e282] [cursor=pointer]:
                - generic [aria-hidden] [ref=e284]: ↗
          - 'generic "Zone de tracé : VMG" [ref=e285]'
        - article [ref=e288]:
          - generic [ref=e289]:
            - heading "Utilisation des voiles" [level=3] [ref=e291]
            - generic [ref=e292]:
              - button "Réinitialiser le zoom et le déplacement de Utilisation des voiles" [ref=e293] [cursor=pointer]: ↺
              - button "Afficher Utilisation des voiles en focus" [ref=e294] [cursor=pointer]:
                - generic [aria-hidden] [ref=e296]: ↗
          - 'generic "Zone de tracé : Utilisation des voiles" [ref=e297]'
  - contentinfo [ref=e300]:
    - generic [ref=e301]:
      - generic [ref=e302]: © Copyright ITYC. All Rights Reserved
      - generic [ref=e303]: Designed by Skipper Du Mad
      - button "Remonter en haut de la page" [ref=e304] [cursor=pointer]: ↑
```

# Test source

```ts
  1  | import { expect, test, type Locator } from '@playwright/test'
  2  | 
  3  | type PolarRing = { x: number; y: number; radius: number }
  4  | declare global {
  5  |   interface Window { expertDrawnRings: WeakMap<HTMLCanvasElement, PolarRing[]> }
  6  | }
  7  | 
  8  | async function expectDiagramInFrame(canvas: Locator) {
  9  |   await expect.poll(() => canvas.evaluate(element => window.expertDrawnRings.get(element as HTMLCanvasElement)?.length ?? 0)).toBeGreaterThanOrEqual(4)
  10 |   const geometry = await canvas.evaluate(element => {
  11 |     const bounds = element.getBoundingClientRect()
  12 |     const rings = window.expertDrawnRings.get(element as HTMLCanvasElement) ?? []
  13 |     return { width: bounds.width, height: bounds.height, ring: rings.reduce((outer, ring) => ring.radius > outer.radius ? ring : outer) }
  14 |   })
  15 |   expect(geometry.width, 'Le dessin doit disposer d’une largeur utile sur mobile').toBeGreaterThanOrEqual(260)
  16 |   expect(geometry.height).toBeGreaterThanOrEqual(260)
  17 |   expect(geometry.ring.radius, 'La polaire ne doit pas être réduite à un tracé minuscule').toBeGreaterThan(100)
  18 |   expect(geometry.ring.x, 'Le centre de la polaire doit rester dans le canvas').toBeGreaterThanOrEqual(0)
  19 |   expect(geometry.ring.x + geometry.ring.radius).toBeLessThanOrEqual(geometry.width + 1)
  20 |   expect(geometry.ring.y - geometry.ring.radius).toBeGreaterThanOrEqual(-1)
  21 |   expect(geometry.ring.y + geometry.ring.radius).toBeLessThanOrEqual(geometry.height + 1)
  22 | }
  23 | 
  24 | for (const viewport of [
  25 |   { width: 360, height: 800 },
  26 |   { width: 390, height: 844 },
  27 |   { width: 820, height: 1180 },
  28 |   { width: 1440, height: 1000 },
  29 | ]) {
  30 |   for (const layout of ['grid', 'focus'] as const) {
  31 |     test(`la polaire Expert reste dans son cadre en ${layout} à ${viewport.width}px`, async ({ page }, testInfo) => {
  32 |       await page.setViewportSize(viewport)
  33 |       await page.addInitScript(layout => {
  34 |         localStorage.setItem('locale', 'fr')
  35 |         sessionStorage.setItem('ityc:tool-page:polar', JSON.stringify({ level: 'expert', layout }))
  36 |         window.expertDrawnRings = new WeakMap()
  37 |         const clear = CanvasRenderingContext2D.prototype.clearRect
  38 |         const arc = CanvasRenderingContext2D.prototype.arc
  39 |         CanvasRenderingContext2D.prototype.clearRect = function (...args) {
  40 |           if (this.canvas.classList.contains('expert-polar-diagram')) window.expertDrawnRings.set(this.canvas, [])
  41 |           return clear.apply(this, args)
  42 |         }
  43 |         CanvasRenderingContext2D.prototype.arc = function (x, y, radius, start, end, counterclockwise) {
  44 |           if (this.canvas.classList.contains('expert-polar-diagram') && Math.abs(start + Math.PI / 2) < .000001 && Math.abs(end - Math.PI / 2) < .000001) {
  45 |             const rings = window.expertDrawnRings.get(this.canvas) ?? []
  46 |             rings.push({ x, y, radius })
  47 |             window.expertDrawnRings.set(this.canvas, rings)
  48 |           }
  49 |           return arc.call(this, x, y, radius, start, end, counterclockwise)
  50 |         }
  51 |       }, layout)
  52 |       await page.goto('/#polaire')
  53 |       const canvas = page.locator('.expert-polar-diagram')
  54 |       await expect(canvas).toHaveCount(1)
  55 |       await page.evaluate(async () => { await document.fonts.ready })
  56 |       await expectDiagramInFrame(canvas)
  57 |       await canvas.scrollIntoViewIfNeeded()
  58 |       const bounds = await canvas.boundingBox()
  59 |       expect(bounds!.x).toBeGreaterThanOrEqual(-1)
  60 |       expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width + 1)
  61 |       await expect(canvas).toBeInViewport()
  62 |       await expect.poll(() => canvas.evaluate(element => {
  63 |         const bounds = element.getBoundingClientRect()
  64 |         return document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2) === element
> 65 |       }), { message: 'Les commandes fixes ne doivent pas masquer le centre du tracé' }).toBe(true)
     |                                                                                         ^ Error: Les commandes fixes ne doivent pas masquer le centre du tracé
  66 |       await page.getByRole('button', { name: 'Réinitialiser le zoom de la polaire', exact: true }).click()
  67 |       await expectDiagramInFrame(canvas)
  68 |       await canvas.scrollIntoViewIfNeeded()
  69 |       await page.screenshot({ path: testInfo.outputPath(`expert-viewport-${layout}-${viewport.width}.png`), animations: 'disabled' })
  70 |       expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width + 1)
  71 |       await page.locator('.expert-polar-panel').screenshot({ path: testInfo.outputPath(`expert-${layout}-${viewport.width}.png`), animations: 'disabled' })
  72 |     })
  73 |   }
  74 | }
  75 | 
```