# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.spec.ts >> desktop >> voiles-auto reste lisible
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
    18 × locator resolved to 1 element
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
      - generic [ref=e29]:
        - generic [ref=e30] [cursor=pointer]:
          - checkbox "Light" [checked] [ref=e31]
          - generic [ref=e33]: Light
        - link "Soutenez ITYC.FR" [ref=e34] [cursor=pointer]:
          - /url: https://fr.tipeee.com/itycfr
  - generic [ref=e35]:
    - heading "Voiles Automatiques" [level=1] [ref=e36]
    - paragraph [ref=e37]:
      - button "Accueil" [ref=e38] [cursor=pointer]
      - generic [ref=e39]: /
      - generic [ref=e40]: Voiles Auto
  - generic [ref=e42]:
    - region "Contrôles de navigation" [ref=e43]:
      - combobox "Bateau" [ref=e45]:
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
      - paragraph [ref=e46]: "MAJ : mardi 2 juillet 2024 20:33:41"
      - link "Tutoriel" [ref=e47] [cursor=pointer]:
        - /url: "#aide"
      - group "Disposition des courbes" [ref=e48]:
        - button "Grille" [pressed] [ref=e49] [cursor=pointer]
        - button "Focus" [ref=e50] [cursor=pointer]
    - region "Réglages de calcul" [ref=e51]:
      - region "Options" [ref=e52]:
        - heading "Option" [level=2] [ref=e53]
        - generic [ref=e54]:
          - generic [ref=e55] [cursor=pointer]:
            - checkbox "Full Pack" [checked] [ref=e56]
            - generic [ref=e59]: Full Pack
          - generic [ref=e60] [cursor=pointer]:
            - checkbox "Foils" [checked] [ref=e61]
            - generic [ref=e64]: Foils
          - generic [ref=e65] [cursor=pointer]:
            - checkbox "Polish coque" [checked] [ref=e66]
            - generic [ref=e69]: Polish coque
          - generic [ref=e70] [cursor=pointer]:
            - checkbox "Brise" [checked] [ref=e71]
            - generic [ref=e74]: Brise
          - generic [ref=e75] [cursor=pointer]:
            - checkbox "Reaching" [checked] [ref=e76]
            - generic [ref=e79]: Reaching
          - generic [ref=e80] [cursor=pointer]:
            - checkbox "Petit temps" [checked] [ref=e81]
            - generic [ref=e84]: Petit temps
      - region "Voiles" [ref=e85]:
        - heading "Voiles" [level=2] [ref=e86]
        - generic [ref=e87]:
          - generic [ref=e88] [cursor=pointer]:
            - checkbox "Foc (J)" [checked] [ref=e89]
            - generic [ref=e92]: Foc (J)
          - generic [ref=e93] [cursor=pointer]:
            - checkbox "Génois léger (LJ)" [checked] [ref=e94]
            - generic [ref=e97]: Génois léger (LJ)
          - generic [ref=e98] [cursor=pointer]:
            - checkbox "Spi lourd (HG)" [checked] [ref=e99]
            - generic [ref=e102]: Spi lourd (HG)
          - generic [ref=e103] [cursor=pointer]:
            - checkbox "Code 0" [checked] [ref=e104]
            - generic [ref=e107]: Code 0
          - generic [ref=e108] [cursor=pointer]:
            - checkbox "Spi (S)" [checked] [ref=e109]
            - generic [ref=e112]: Spi (S)
          - generic [ref=e113] [cursor=pointer]:
            - checkbox "Spi léger (LG)" [checked] [ref=e114]
            - generic [ref=e117]: Spi léger (LG)
          - generic [ref=e118] [cursor=pointer]:
            - checkbox "Trinquette (SS)" [checked] [ref=e119]
            - generic [ref=e122]: Trinquette (SS)
  - main [ref=e123]:
    - article [ref=e124]:
      - generic [ref=e125]:
        - heading "Voile active · TWA fixe" [level=2] [ref=e126]
        - generic [ref=e127]:
          - button "Réinitialiser le zoom de Voile active · TWA fixe" [ref=e128] [cursor=pointer]: ↺
          - button "Afficher Voile active · TWA fixe en focus" [ref=e129] [cursor=pointer]: ↗
      - complementary [ref=e134]:
        - generic [ref=e135]:
          - text: Voile
          - combobox "Voile analysée" [ref=e136]:
            - option "Foc (J)"
            - option "Spi (S)"
            - option "Code 0" [selected]
            - option "Génois léger (LJ)"
            - option "Spi léger (LG)"
            - option "Spi lourd (HG)"
            - option "Trinquette (SS)"
        - generic [ref=e137]:
          - generic [ref=e138]: True Wind Angle
          - generic [ref=e139]:
            - textbox "True Wind Angle" [ref=e140]: "120.0"
            - generic [ref=e141]: °
          - slider "True Wind Angle 120.0 °" [ref=e142] [cursor=pointer]: "120"
        - generic [ref=e143]:
          - generic [ref=e144]: TWS début
          - generic [ref=e145]:
            - textbox "TWS début" [ref=e146]: "1.0"
            - generic [ref=e147]: nds
          - slider "TWS début 1.0 nds" [ref=e148] [cursor=pointer]: "1"
        - generic [ref=e149]:
          - generic [ref=e150]: TWS fin
          - generic [ref=e151]:
            - textbox "TWS fin" [ref=e152]: "40.0"
            - generic [ref=e153]: nds
          - slider "TWS fin 40.0 nds" [ref=e154] [cursor=pointer]: "40"
        - generic [ref=e155]:
          - heading "Plage d’utilisation" [level=3] [ref=e156]
          - table [ref=e157]:
            - rowgroup [ref=e158]:
              - row [ref=e159]:
                - columnheader [ref=e160]
                - columnheader "Mini" [ref=e161]
                - columnheader "Maxi" [ref=e162]
            - rowgroup [ref=e163]:
              - row [ref=e164]:
                - cell "TWS" [ref=e165]
                - cell "2,8 nds" [ref=e166]
                - cell "36,7 nds" [ref=e167]
    - article [ref=e168]:
      - generic [ref=e169]:
        - heading "Voile active · TWS fixe" [level=2] [ref=e170]
        - generic [ref=e171]:
          - button "Réinitialiser le zoom de Voile active · TWS fixe" [ref=e172] [cursor=pointer]: ↺
          - button "Afficher Voile active · TWS fixe en focus" [ref=e173] [cursor=pointer]: ↗
      - complementary [ref=e178]:
        - generic [ref=e179]:
          - text: Voile
          - combobox "Voile analysée" [ref=e180]:
            - option "Foc (J)"
            - option "Spi (S)"
            - option "Code 0" [selected]
            - option "Génois léger (LJ)"
            - option "Spi léger (LG)"
            - option "Spi lourd (HG)"
            - option "Trinquette (SS)"
        - generic [ref=e181]:
          - generic [ref=e182]: True Wind Speed
          - generic [ref=e183]:
            - textbox "True Wind Speed" [ref=e184]: "18.0"
            - generic [ref=e185]: nds
          - slider "True Wind Speed 18.0 nds" [ref=e186] [cursor=pointer]: "18"
        - generic [ref=e187]:
          - generic [ref=e188]: TWA début
          - generic [ref=e189]:
            - textbox "TWA début" [ref=e190]: "0.0"
            - generic [ref=e191]: °
          - slider "TWA début 0.0 °" [ref=e192] [cursor=pointer]: "0"
        - generic [ref=e193]:
          - generic [ref=e194]: TWA fin
          - generic [ref=e195]:
            - textbox "TWA fin" [ref=e196]: "180.0"
            - generic [ref=e197]: °
          - slider "TWA fin 180.0 °" [ref=e198] [cursor=pointer]: "180"
        - generic [ref=e199]:
          - heading "Plage d’utilisation" [level=3] [ref=e200]
          - table [ref=e201]:
            - rowgroup [ref=e202]:
              - row [ref=e203]:
                - columnheader [ref=e204]
                - columnheader "Mini" [ref=e205]
                - columnheader "Maxi" [ref=e206]
            - rowgroup [ref=e207]:
              - row [ref=e208]:
                - cell "TWA" [ref=e209]
                - cell "62,9 °" [ref=e210]
                - cell "132,1 °" [ref=e211]
    - article [ref=e212]:
      - generic [ref=e213]:
        - heading "Zone d’utilisation" [level=2] [ref=e214]
        - generic [ref=e215]:
          - button "Réinitialiser le zoom de Zone d’utilisation" [ref=e216] [cursor=pointer]: ↺
          - button "Afficher Zone d’utilisation en focus" [ref=e217] [cursor=pointer]: ↗
      - generic [ref=e218]:
        - paragraph [ref=e220]: "Calcul en cours : 99%"
        - complementary [ref=e221]:
          - generic [ref=e222]:
            - text: Voile
            - combobox "Voile analysée" [ref=e223]:
              - option "Foc (J)"
              - option "Spi (S)"
              - option "Code 0" [selected]
              - option "Génois léger (LJ)"
              - option "Spi léger (LG)"
              - option "Spi lourd (HG)"
              - option "Trinquette (SS)"
    - article [ref=e224]:
      - generic [ref=e225]:
        - heading "Zone de recouvrement" [level=2] [ref=e226]
        - generic [ref=e227]:
          - button "Réinitialiser le zoom de Zone de recouvrement" [ref=e228] [cursor=pointer]: ↺
          - button "Afficher Zone de recouvrement en focus" [ref=e229] [cursor=pointer]: ↗
      - generic [ref=e230]:
        - paragraph [ref=e232]: Pas de zones de recouvrement.
        - complementary [ref=e233]:
          - generic [ref=e234]:
            - text: Première voile
            - combobox "Voile analysée" [ref=e235]:
              - option "Foc (J)"
              - option "Spi (S)"
              - option "Code 0" [selected]
              - option "Génois léger (LJ)"
              - option "Spi léger (LG)"
              - option "Spi lourd (HG)"
              - option "Trinquette (SS)"
          - generic [ref=e236]:
            - text: Seconde voile
            - combobox "Voile analysée" [ref=e237]:
              - option "Foc (J)" [selected]
              - option "Spi (S)"
              - option "Code 0"
              - option "Génois léger (LJ)"
              - option "Spi léger (LG)"
              - option "Spi lourd (HG)"
              - option "Trinquette (SS)"
          - generic [ref=e238]:
            - generic [ref=e239]: Précision
            - group "Précision du recouvrement" [ref=e240]:
              - button "0,1" [pressed] [ref=e241] [cursor=pointer]
              - button "0,01" [ref=e242] [cursor=pointer]
  - contentinfo [ref=e243]:
    - generic [ref=e244]:
      - generic [ref=e245]: © Copyright ITYC. All Rights Reserved
      - generic [ref=e246]: Designed by Skipper Du Mad
      - button "Remonter en haut de la page" [ref=e247] [cursor=pointer]: ↑
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