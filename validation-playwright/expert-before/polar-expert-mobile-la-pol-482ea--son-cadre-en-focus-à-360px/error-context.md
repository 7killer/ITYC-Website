# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: polar-expert-mobile.spec.ts >> la polaire Expert reste dans son cadre en focus à 360px
- Location: tests\visual\polar-expert-mobile.spec.ts:31:5

# Error details

```
Error: Le dessin doit disposer d’une largeur utile sur mobile

expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 260
Received:    0
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - link "ITYC, accueil" [ref=e7] [cursor=pointer]:
          - /url: "#accueil"
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
              - /url: "#accueil"
          - listitem [ref=e17]:
            - link "Pénalités" [ref=e18] [cursor=pointer]:
              - /url: "#penalites"
          - listitem [ref=e19]:
            - link "Énergie" [ref=e20] [cursor=pointer]:
              - /url: "#energie"
          - listitem [ref=e21]:
            - link "Polaires" [ref=e22] [cursor=pointer]:
              - /url: "#polaire"
          - listitem [ref=e23]:
            - link "Voiles Auto" [ref=e24] [cursor=pointer]:
              - /url: "#autosail"
          - listitem [ref=e25]:
            - link "Dash" [ref=e26] [cursor=pointer]:
              - /url: "#dash"
          - listitem [ref=e27]:
            - link "Aide" [ref=e28] [cursor=pointer]:
              - /url: "#aide"
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
        - paragraph [ref=e44]: "MAJ : mardi 2 juillet 2024 20:33:41"
        - link "Tutoriel" [ref=e45] [cursor=pointer]:
          - /url: "#aide"
        - group "Disposition des courbes" [ref=e46]:
          - button "Grille" [ref=e47] [cursor=pointer]
          - button "Focus" [pressed] [ref=e48] [cursor=pointer]
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
      - region "Polaire experte" [ref=e127]:
        - button "Réinitialiser le zoom de la polaire" [ref=e128] [cursor=pointer]: ↺
        - complementary [ref=e129]:
          - generic "Affichage de la polaire" [ref=e130]:
            - button "Toutes" [ref=e131] [cursor=pointer]
            - button "Foils" [ref=e132] [cursor=pointer]
            - button "Voiles Auto" [pressed] [ref=e133] [cursor=pointer]
          - generic [ref=e134]:
            - generic [ref=e135]:
              - generic [ref=e136]: True Wind Angle
              - generic [ref=e137]:
                - textbox "True Wind Angle" [ref=e138]: "120.0"
                - generic [ref=e139]: °
              - slider "True Wind Angle 120.0 °" [ref=e140] [cursor=pointer]: "120"
            - generic [ref=e141]:
              - generic [ref=e142]: True Wind Speed
              - generic [ref=e143]:
                - textbox "True Wind Speed" [ref=e144]: "18.0"
                - generic [ref=e145]: nds
              - slider "True Wind Speed 18.0 nds" [ref=e146] [cursor=pointer]: "18"
          - generic [ref=e147]:
            - heading "Actuelle" [level=3] [ref=e148]
            - generic [ref=e149]:
              - term [ref=e150]: TWA
              - definition [ref=e151]: 120,0°
              - term [ref=e152]: Vitesse
              - definition [ref=e153]: 14,23 nds
              - term [ref=e154]: VMG
              - definition [ref=e155]: 7,11 nds
              - term [ref=e156]: Voile
              - definition [ref=e157]: Code 0
          - generic [ref=e158]:
            - heading "Vitesse max" [level=3] [ref=e159]
            - generic [ref=e160]:
              - term [ref=e161]: TWA
              - definition [ref=e162]: 125,0°
              - term [ref=e163]: Vitesse
              - definition [ref=e164]: 14,45 nds
              - term [ref=e165]: Voile
              - definition [ref=e166]: Code 0
          - generic [ref=e167]:
            - heading "Best VMG" [level=3] [ref=e168]
            - generic [ref=e169]:
              - term [ref=e170]: Au près
              - definition [ref=e171]: 50,0° · 5,70 nds
              - term [ref=e172]: Au portant
              - definition [ref=e173]: 145,0° · 10,72 nds
          - generic [ref=e174]:
            - heading "Plage Code 0" [level=3] [ref=e175]
            - generic [ref=e176]:
              - term [ref=e177]: TWA mini
              - definition [ref=e178]: 62,9°
              - term [ref=e179]: TWA maxi
              - definition [ref=e180]: 132,1°
              - term [ref=e181]: TWS mini
              - definition [ref=e182]: 2,8 nds
              - term [ref=e183]: TWS maxi
              - definition [ref=e184]: 36,7 nds
          - generic [ref=e185]:
            - heading "Voiles" [level=3] [ref=e186]
            - table [ref=e187]:
              - rowgroup [ref=e188]:
                - row [ref=e189]:
                  - columnheader "Voiles" [ref=e190]
                  - columnheader "Vitesse (nds)" [ref=e191]: Vitesse(nds)
                  - columnheader "VMG (nds)" [ref=e192]: VMG(nds)
              - rowgroup [ref=e193]:
                - row [ref=e194]:
                  - cell "Foc (J)" [ref=e195]
                  - cell "13,80" [ref=e196]
                  - cell "6,90" [ref=e197]
                - row [ref=e198]:
                  - cell "Spi (S)" [ref=e199]
                  - cell "13,80" [ref=e200]
                  - cell "6,90" [ref=e201]
                - row [ref=e202]:
                  - cell "Code 0" [ref=e203]
                  - cell "14,23" [ref=e204]
                  - cell "7,11" [ref=e205]
                - row [ref=e206]:
                  - cell "Génois léger (LJ)" [ref=e207]
                  - cell "6,09" [ref=e208]
                  - cell "3,05" [ref=e209]
                - row [ref=e210]:
                  - cell "Spi léger (LG)" [ref=e211]
                  - cell "12,04" [ref=e212]
                  - cell "6,02" [ref=e213]
                - row [ref=e214]:
                  - cell "Spi lourd (HG)" [ref=e215]
                  - cell "12,07" [ref=e216]
                  - cell "6,03" [ref=e217]
                - row [ref=e218]:
                  - cell "Trinquette (SS)" [ref=e219]
                  - cell "6,38" [ref=e220]
                  - cell "3,19" [ref=e221]
    - region "Courbes expertes de Class 40 2021" [ref=e222]:
      - generic [ref=e223]:
        - article [ref=e224]:
          - generic [ref=e225]:
            - heading "Vitesse selon le TWA" [level=3] [ref=e227]
            - generic [ref=e228]:
              - generic [ref=e230]:
                - generic [ref=e231]: True Wind Speed
                - generic [ref=e232]:
                  - textbox "True Wind Speed" [ref=e233]: "18.0"
                  - generic [ref=e234]: nds
                - slider "True Wind Speed 18.0 nds" [ref=e235] [cursor=pointer]: "18"
              - button "Réinitialiser le zoom et le déplacement de Vitesse selon le TWA" [ref=e236] [cursor=pointer]: ↺
              - button "Revenir à la grille" [ref=e237] [cursor=pointer]:
                - generic [aria-hidden] [ref=e239]: ⊞
          - 'generic "Zone de tracé : Vitesse selon le TWA" [ref=e240]'
        - article [ref=e243]:
          - generic [ref=e244]:
            - heading "Vitesse selon le TWS" [level=3] [ref=e246]
            - generic [ref=e247]:
              - generic [ref=e249]:
                - generic [ref=e250]: True Wind Angle
                - generic [ref=e251]:
                  - textbox "True Wind Angle" [ref=e252]: "120.0"
                  - generic [ref=e253]: °
                - slider "True Wind Angle 120.0 °" [ref=e254] [cursor=pointer]: "120"
              - button "Réinitialiser le zoom et le déplacement de Vitesse selon le TWS" [ref=e255] [cursor=pointer]: ↺
              - button "Revenir à la grille" [ref=e256] [cursor=pointer]:
                - generic [aria-hidden] [ref=e258]: ⊞
          - 'generic "Zone de tracé : Vitesse selon le TWS" [ref=e259]'
        - article [ref=e262]:
          - generic [ref=e263]:
            - heading "BVMG" [level=3] [ref=e265]
            - generic [ref=e266]:
              - button "Réinitialiser le zoom et le déplacement de BVMG" [ref=e267] [cursor=pointer]: ↺
              - button "Revenir à la grille" [ref=e268] [cursor=pointer]:
                - generic [aria-hidden] [ref=e270]: ⊞
          - 'generic "Zone de tracé : BVMG" [ref=e271]':
            - status [ref=e272]:
              - generic [ref=e273]: Calcul de la polaire en cours
              - strong [ref=e274]: 54%
        - article [ref=e277]:
          - generic [ref=e278]:
            - heading "Best Speed" [level=3] [ref=e280]
            - generic [ref=e281]:
              - button "Réinitialiser le zoom et le déplacement de Best Speed" [ref=e282] [cursor=pointer]: ↺
              - button "Revenir à la grille" [ref=e283] [cursor=pointer]:
                - generic [aria-hidden] [ref=e285]: ⊞
          - 'generic "Zone de tracé : Best Speed" [ref=e286]':
            - status [ref=e287]:
              - generic [ref=e288]: Calcul de la polaire en cours
              - strong [ref=e289]: 54%
        - article [ref=e292]:
          - generic [ref=e293]:
            - heading "VMG" [level=3] [ref=e295]
            - generic [ref=e296]:
              - button "Réinitialiser le zoom et le déplacement de VMG" [ref=e297] [cursor=pointer]: ↺
              - button "Revenir à la grille" [ref=e298] [cursor=pointer]:
                - generic [aria-hidden] [ref=e300]: ⊞
          - 'generic "Zone de tracé : VMG" [ref=e301]':
            - status [ref=e302]:
              - generic [ref=e303]: Calcul de la polaire en cours
              - strong [ref=e304]: 54%
        - article [ref=e307]:
          - generic [ref=e308]:
            - heading "Utilisation des voiles" [level=3] [ref=e310]
            - generic [ref=e311]:
              - button "Réinitialiser le zoom et le déplacement de Utilisation des voiles" [ref=e312] [cursor=pointer]: ↺
              - button "Revenir à la grille" [ref=e313] [cursor=pointer]:
                - generic [aria-hidden] [ref=e315]: ⊞
          - 'generic "Zone de tracé : Utilisation des voiles" [ref=e316]'
  - contentinfo [ref=e319]:
    - generic [ref=e320]:
      - generic [ref=e321]: © Copyright ITYC. All Rights Reserved
      - generic [ref=e322]: Designed by Skipper Du Mad
      - button "Remonter en haut de la page" [ref=e323] [cursor=pointer]: ↑
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
> 15 |   expect(geometry.width, 'Le dessin doit disposer d’une largeur utile sur mobile').toBeGreaterThanOrEqual(260)
     |                                                                                    ^ Error: Le dessin doit disposer d’une largeur utile sur mobile
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
  62 |       await page.getByRole('button', { name: 'Réinitialiser le zoom de la polaire', exact: true }).click()
  63 |       await expectDiagramInFrame(canvas)
  64 |       expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width + 1)
  65 |       await page.locator('.expert-polar-panel').screenshot({ path: testInfo.outputPath(`expert-${layout}-${viewport.width}.png`), animations: 'disabled' })
  66 |     })
  67 |   }
  68 | }
  69 | 
```