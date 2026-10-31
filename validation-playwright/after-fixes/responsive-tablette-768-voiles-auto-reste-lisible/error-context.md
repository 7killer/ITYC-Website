# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.spec.ts >> tablette-768 >> voiles-auto reste lisible
- Location: tests\visual\responsive.spec.ts:26:7

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.autosail-chart > p').filter({ hasText: /^Calcul/ })
Expected: 0
Received: 1
Timeout:  10000ms

Call log:
  - Expect "toHaveCount" locator('.autosail-chart > p').filter({ hasText: /^Calcul/ }) with timeout 10000ms
  - waiting for locator('.autosail-chart > p').filter({ hasText: /^Calcul/ })
    6 × locator resolved to 2 elements
      - unexpected value "2"
    17 × locator resolved to 1 element
       - unexpected value "1"

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
    - heading "Voiles Automatiques" [level=1] [ref=e34]
    - paragraph [ref=e35]:
      - button "Accueil" [ref=e36] [cursor=pointer]
      - generic [ref=e37]: /
      - generic [ref=e38]: Voiles Auto
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
  - main [ref=e121]:
    - article [ref=e122]:
      - generic [ref=e123]:
        - heading "Voile active · TWA fixe" [level=2] [ref=e124]
        - generic [ref=e125]:
          - button "Réinitialiser le zoom de Voile active · TWA fixe" [ref=e126] [cursor=pointer]: ↺
          - button "Afficher Voile active · TWA fixe en focus" [ref=e127] [cursor=pointer]: ↗
      - complementary [ref=e132]:
        - generic [ref=e133]:
          - text: Voile
          - combobox "Voile analysée" [ref=e134]:
            - option "Foc (J)"
            - option "Spi (S)"
            - option "Code 0" [selected]
            - option "Génois léger (LJ)"
            - option "Spi léger (LG)"
            - option "Spi lourd (HG)"
            - option "Trinquette (SS)"
        - generic [ref=e135]:
          - generic [ref=e136]: True Wind Angle
          - generic [ref=e137]:
            - textbox "True Wind Angle" [ref=e138]: "120.0"
            - generic [ref=e139]: °
          - slider "True Wind Angle 120.0 °" [ref=e140] [cursor=pointer]: "120"
        - generic [ref=e141]:
          - generic [ref=e142]: TWS début
          - generic [ref=e143]:
            - textbox "TWS début" [ref=e144]: "1.0"
            - generic [ref=e145]: nds
          - slider "TWS début 1.0 nds" [ref=e146] [cursor=pointer]: "1"
        - generic [ref=e147]:
          - generic [ref=e148]: TWS fin
          - generic [ref=e149]:
            - textbox "TWS fin" [ref=e150]: "40.0"
            - generic [ref=e151]: nds
          - slider "TWS fin 40.0 nds" [ref=e152] [cursor=pointer]: "40"
        - generic [ref=e153]:
          - heading "Plage d’utilisation" [level=3] [ref=e154]
          - table [ref=e155]:
            - rowgroup [ref=e156]:
              - row [ref=e157]:
                - columnheader [ref=e158]
                - columnheader "Mini" [ref=e159]
                - columnheader "Maxi" [ref=e160]
            - rowgroup [ref=e161]:
              - row [ref=e162]:
                - cell "TWS" [ref=e163]
                - cell "2,8 nds" [ref=e164]
                - cell "36,7 nds" [ref=e165]
    - article [ref=e166]:
      - generic [ref=e167]:
        - heading "Voile active · TWS fixe" [level=2] [ref=e168]
        - generic [ref=e169]:
          - button "Réinitialiser le zoom de Voile active · TWS fixe" [ref=e170] [cursor=pointer]: ↺
          - button "Afficher Voile active · TWS fixe en focus" [ref=e171] [cursor=pointer]: ↗
      - complementary [ref=e176]:
        - generic [ref=e177]:
          - text: Voile
          - combobox "Voile analysée" [ref=e178]:
            - option "Foc (J)"
            - option "Spi (S)"
            - option "Code 0" [selected]
            - option "Génois léger (LJ)"
            - option "Spi léger (LG)"
            - option "Spi lourd (HG)"
            - option "Trinquette (SS)"
        - generic [ref=e179]:
          - generic [ref=e180]: True Wind Speed
          - generic [ref=e181]:
            - textbox "True Wind Speed" [ref=e182]: "18.0"
            - generic [ref=e183]: nds
          - slider "True Wind Speed 18.0 nds" [ref=e184] [cursor=pointer]: "18"
        - generic [ref=e185]:
          - generic [ref=e186]: TWA début
          - generic [ref=e187]:
            - textbox "TWA début" [ref=e188]: "0.0"
            - generic [ref=e189]: °
          - slider "TWA début 0.0 °" [ref=e190] [cursor=pointer]: "0"
        - generic [ref=e191]:
          - generic [ref=e192]: TWA fin
          - generic [ref=e193]:
            - textbox "TWA fin" [ref=e194]: "180.0"
            - generic [ref=e195]: °
          - slider "TWA fin 180.0 °" [ref=e196] [cursor=pointer]: "180"
        - generic [ref=e197]:
          - heading "Plage d’utilisation" [level=3] [ref=e198]
          - table [ref=e199]:
            - rowgroup [ref=e200]:
              - row [ref=e201]:
                - columnheader [ref=e202]
                - columnheader "Mini" [ref=e203]
                - columnheader "Maxi" [ref=e204]
            - rowgroup [ref=e205]:
              - row [ref=e206]:
                - cell "TWA" [ref=e207]
                - cell "62,9 °" [ref=e208]
                - cell "132,1 °" [ref=e209]
    - article [ref=e210]:
      - generic [ref=e211]:
        - heading "Zone d’utilisation" [level=2] [ref=e212]
        - generic [ref=e213]:
          - button "Réinitialiser le zoom de Zone d’utilisation" [ref=e214] [cursor=pointer]: ↺
          - button "Afficher Zone d’utilisation en focus" [ref=e215] [cursor=pointer]: ↗
      - generic [ref=e216]:
        - paragraph [ref=e218]: "Calcul en cours : 99%"
        - complementary [ref=e219]:
          - generic [ref=e220]:
            - text: Voile
            - combobox "Voile analysée" [ref=e221]:
              - option "Foc (J)"
              - option "Spi (S)"
              - option "Code 0" [selected]
              - option "Génois léger (LJ)"
              - option "Spi léger (LG)"
              - option "Spi lourd (HG)"
              - option "Trinquette (SS)"
    - article [ref=e222]:
      - generic [ref=e223]:
        - heading "Zone de recouvrement" [level=2] [ref=e224]
        - generic [ref=e225]:
          - button "Réinitialiser le zoom de Zone de recouvrement" [ref=e226] [cursor=pointer]: ↺
          - button "Afficher Zone de recouvrement en focus" [ref=e227] [cursor=pointer]: ↗
      - generic [ref=e228]:
        - paragraph [ref=e230]: Pas de zones de recouvrement.
        - complementary [ref=e231]:
          - generic [ref=e232]:
            - text: Première voile
            - combobox "Voile analysée" [ref=e233]:
              - option "Foc (J)"
              - option "Spi (S)"
              - option "Code 0" [selected]
              - option "Génois léger (LJ)"
              - option "Spi léger (LG)"
              - option "Spi lourd (HG)"
              - option "Trinquette (SS)"
          - generic [ref=e234]:
            - text: Seconde voile
            - combobox "Voile analysée" [ref=e235]:
              - option "Foc (J)" [selected]
              - option "Spi (S)"
              - option "Code 0"
              - option "Génois léger (LJ)"
              - option "Spi léger (LG)"
              - option "Spi lourd (HG)"
              - option "Trinquette (SS)"
          - generic [ref=e236]:
            - generic [ref=e237]: Précision
            - group "Précision du recouvrement" [ref=e238]:
              - button "0,1" [pressed] [ref=e239] [cursor=pointer]
              - button "0,01" [ref=e240] [cursor=pointer]
  - contentinfo [ref=e241]:
    - generic [ref=e242]:
      - generic [ref=e243]: © Copyright ITYC. All Rights Reserved
      - generic [ref=e244]: Designed by Skipper Du Mad
      - button "Remonter en haut de la page" [ref=e245] [cursor=pointer]: ↑
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test'
  2  | 
  3  | const pages = [
  4  |   { name: 'accueil', hash: '' },
  5  |   { name: 'polaires', hash: '#polaire' },
  6  |   { name: 'voiles-auto', hash: '#autosail' },
  7  |   { name: 'penalites', hash: '#penalites' },
  8  |   { name: 'energie', hash: '#energie' },
  9  |   { name: 'dash', hash: '#dash' },
  10 | ]
  11 | 
  12 | const viewports = [
  13 |   { name: 'mobile-360', width: 360, height: 800 },
  14 |   { name: 'mobile-390', width: 390, height: 844 },
  15 |   { name: 'tablette-768', width: 768, height: 1024 },
  16 |   { name: 'ipad-air', width: 820, height: 1180 },
  17 |   { name: 'laptop', width: 1280, height: 800 },
  18 |   { name: 'desktop', width: 1440, height: 900 },
  19 | ]
  20 | 
  21 | for (const viewport of viewports) {
  22 |   test.describe(viewport.name, () => {
  23 |     test.use({ viewport: { width: viewport.width, height: viewport.height } })
  24 | 
  25 |     for (const tool of pages) {
  26 |       test(`${tool.name} reste lisible`, async ({ page }) => {
  27 |         await page.goto(`/${tool.hash}`)
  28 |         await expect(page.locator(tool.hash ? '.tool-page' : '.app-shell')).toBeVisible()
  29 |         await page.evaluate(async () => { await document.fonts.ready })
  30 |         if (tool.hash === '#polaire') {
  31 |           await expect(page.locator('.chart-card canvas')).toHaveCount(6)
  32 |           await expect(page.locator('.calculation-progress')).toHaveCount(0)
  33 |         } else if (tool.hash === '#autosail') {
> 34 |           await expect(page.locator('.autosail-chart > p').filter({ hasText: /^Calcul/ })).toHaveCount(0)
     |                                                                                            ^ Error: expect(locator).toHaveCount(expected) failed
  35 |           const emptyOverlap = page.locator('#autosail-chart-3 .autosail-chart > p').filter({ hasText: /^Pas de zones de recouvrement\.$/ })
  36 |           await expect(page.locator('.autosail-card canvas')).toHaveCount(await emptyOverlap.count() ? 3 : 4)
  37 |         }
  38 |         await page.waitForTimeout(500)
  39 | 
  40 |         await expect(page).toHaveScreenshot(`${tool.name}-${viewport.name}.png`, {
  41 |           animations: 'disabled',
  42 |           fullPage: true,
  43 |           maxDiffPixelRatio: .01,
  44 |         })
  45 |       })
  46 |     }
  47 |   })
  48 | }
  49 | 
```