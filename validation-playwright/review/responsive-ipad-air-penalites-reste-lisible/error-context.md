# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.spec.ts >> ipad-air >> penalites reste lisible
- Location: tests\visual\responsive.spec.ts:26:7

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  Expected an image 820px by 3192px, received 820px by 3277px. 134079 pixels (ratio 0.05 of all image pixels) are different.

  Snapshot: penalites-ipad-air.png

Call log:
  - Expect "toHaveScreenshot(penalites-ipad-air.png)" with timeout 10000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Expected an image 820px by 3192px, received 820px by 3277px. 134079 pixels (ratio 0.05 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - Expected an image 820px by 3192px, received 820px by 3277px. 134079 pixels (ratio 0.05 of all image pixels) are different.

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
    - heading "Pénalités" [level=1] [ref=e34]
    - paragraph [ref=e35]:
      - button "Accueil" [ref=e36] [cursor=pointer]
      - generic [ref=e37]: /
      - generic [ref=e38]: Pénalités
  - generic [ref=e40]:
    - combobox "Bateau" [ref=e42]:
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
    - paragraph [ref=e43]: "MAJ : mardi 2 juillet 2024 20:33:41"
    - link "Tutoriel" [ref=e44] [cursor=pointer]:
      - /url: "#aide"
    - group "Mode d'affichage" [ref=e45]:
      - button "Grille" [pressed] [ref=e46] [cursor=pointer]
      - button "Focus" [ref=e47] [cursor=pointer]
    - generic [ref=e49]:
      - generic [ref=e50] [cursor=pointer]:
        - checkbox "Full Pack" [checked] [ref=e51]
        - generic [ref=e53]: Full Pack
      - generic [ref=e54] [cursor=pointer]:
        - checkbox "Winch" [checked] [ref=e55]
        - generic [ref=e57]: Winch
      - generic [ref=e58] [cursor=pointer]:
        - checkbox "Enrouleur" [checked] [ref=e59]
        - generic [ref=e61]: Enrouleur
      - generic [ref=e62] [cursor=pointer]:
        - checkbox "Veste" [checked] [ref=e63]
        - generic [ref=e65]: Veste
  - main [ref=e66]:
    - generic [ref=e67]:
      - generic [ref=e68]:
        - heading "Pénalités simples" [level=2] [ref=e69]
        - generic [ref=e70]:
          - button "Réinitialiser le zoom de Pénalités simples" [ref=e71] [cursor=pointer]: ↺
          - button "Afficher Pénalités simples en focus" [ref=e72] [cursor=pointer]:
            - generic [aria-hidden] [ref=e74]: ↗
      - generic [ref=e76]:
        - generic [ref=e77]:
          - generic [ref=e79]:
            - generic [ref=e80]: Énergie du skipper
            - generic [ref=e81]:
              - textbox "Énergie du skipper" [ref=e82]: "66.7"
              - generic [ref=e83]: "%"
            - slider "Énergie du skipper 66.7 %" [ref=e84] [cursor=pointer]: "66.7"
          - generic [ref=e86]:
            - generic [ref=e87]: True Wind Speed
            - generic [ref=e88]:
              - textbox "True Wind Speed" [ref=e89]: "10.0"
              - generic [ref=e90]: nds
            - slider "True Wind Speed 10.0 nds" [ref=e91] [cursor=pointer]: "10"
          - generic [ref=e93]:
            - generic [ref=e94]: Vitesse bateau
            - generic [ref=e95]:
              - textbox "Vitesse bateau" [ref=e96]: "5.0"
              - generic [ref=e97]: nds
            - slider "Vitesse bateau 5.0 nds" [ref=e98] [cursor=pointer]: "5"
        - table [ref=e99]:
          - rowgroup [ref=e100]:
            - row [ref=e101]:
              - columnheader "Manœuvre" [ref=e102]
              - columnheader "Temps" [ref=e103]
              - columnheader "Énergie" [ref=e104]
              - columnheader "Distance" [ref=e105]
          - rowgroup [ref=e106]:
            - row [ref=e107]:
              - rowheader "Virement / Empannage" [ref=e108]
              - cell "180 s 3 min" [ref=e109]:
                - generic [ref=e110]:
                  - strong [ref=e111]: 180 s
                  - generic [ref=e112]: 3 min
              - cell "-10,0 %" [ref=e113]
              - cell "-0,07 nm" [ref=e114]
            - row [ref=e115]:
              - rowheader "Voile" [ref=e116]
              - cell "192 s 3 min 12 s" [ref=e117]:
                - generic [ref=e118]:
                  - strong [ref=e119]: 192 s
                  - generic [ref=e120]: 3 min 12 s
              - cell "-16,0 %" [ref=e121]
              - cell "-0,08 nm" [ref=e122]
    - generic [ref=e126]:
      - generic [ref=e127]:
        - heading "Rentabilité" [level=2] [ref=e128]
        - generic [ref=e129]:
          - button "Réinitialiser le zoom de Rentabilité" [ref=e130] [cursor=pointer]: ↺
          - button "Afficher Rentabilité en focus" [ref=e131] [cursor=pointer]:
            - generic [aria-hidden] [ref=e133]: ↗
      - generic [ref=e135]:
        - generic [ref=e136]:
          - generic [ref=e137]:
            - generic [ref=e138]: Énergie du skipper
            - generic [ref=e139]:
              - textbox "Énergie du skipper" [ref=e140]: "66.7"
              - generic [ref=e141]: "%"
            - slider "Énergie du skipper 66.7 %" [ref=e142] [cursor=pointer]: "66.7"
          - generic [ref=e143]:
            - generic [ref=e144]: True Wind Speed
            - generic [ref=e145]:
              - textbox "True Wind Speed" [ref=e146]: "10.0"
              - generic [ref=e147]: nds
            - slider "True Wind Speed 10.0 nds" [ref=e148] [cursor=pointer]: "10"
          - generic [ref=e149]:
            - generic [ref=e150]: Vitesse sans changement
            - generic [ref=e151]:
              - textbox "Vitesse sans changement" [ref=e152]: "10.0"
              - generic [ref=e153]: nds
            - slider "Vitesse sans changement 10.0 nds" [ref=e154] [cursor=pointer]: "10"
          - generic [ref=e155]:
            - generic [ref=e156]: Vitesse avec changement
            - generic [ref=e157]:
              - textbox "Vitesse avec changement" [ref=e158]: "12.0"
              - generic [ref=e159]: nds
            - slider "Vitesse avec changement 12.0 nds" [ref=e160] [cursor=pointer]: "12"
        - generic [ref=e161]:
          - table [ref=e163]:
            - rowgroup [ref=e164]:
              - row [ref=e165]:
                - columnheader "Manœuvre" [ref=e166]
                - columnheader "Temps" [ref=e167]
                - columnheader "Énergie" [ref=e168]
            - rowgroup [ref=e169]:
              - row [ref=e170]:
                - rowheader "Voile" [ref=e171]
                - cell "192 s 3 min 12 s" [ref=e172]:
                  - generic [ref=e173]:
                    - strong [ref=e174]: 192 s
                    - generic [ref=e175]: 3 min 12 s
                - cell "-16,0 %" [ref=e176]
          - table [ref=e177]:
            - rowgroup [ref=e178]:
              - row [ref=e179]:
                - rowheader "Rattrapage" [ref=e180]
                - cell "346 s 5 min 46 s" [ref=e181]:
                  - generic [ref=e182]:
                    - strong [ref=e183]: 346 s
                    - generic [ref=e184]: 5 min 46 s
              - row [ref=e185]:
                - rowheader "Distance" [ref=e186]
                - cell "0,96 nm" [ref=e187]
    - generic [ref=e191]:
      - generic [ref=e192]:
        - heading "Pénalités doubles" [level=2] [ref=e193]
        - generic [ref=e194]:
          - button "Réinitialiser le zoom de Pénalités doubles" [ref=e195] [cursor=pointer]: ↺
          - button "Afficher Pénalités doubles en focus" [ref=e196] [cursor=pointer]:
            - generic [aria-hidden] [ref=e198]: ↗
      - generic [ref=e200]:
        - generic [ref=e201]:
          - generic [ref=e203]:
            - generic [ref=e204]: Énergie du skipper
            - generic [ref=e205]:
              - textbox "Énergie du skipper" [ref=e206]: "66.7"
              - generic [ref=e207]: "%"
            - slider "Énergie du skipper 66.7 %" [ref=e208] [cursor=pointer]: "66.7"
          - generic [ref=e210]:
            - generic [ref=e211]: True Wind Speed
            - generic [ref=e212]:
              - textbox "True Wind Speed" [ref=e213]: "10.0"
              - generic [ref=e214]: nds
            - slider "True Wind Speed 10.0 nds" [ref=e215] [cursor=pointer]: "10"
          - generic [ref=e217]:
            - generic [ref=e218]: Vitesse bateau
            - generic [ref=e219]:
              - textbox "Vitesse bateau" [ref=e220]: "5.0"
              - generic [ref=e221]: nds
            - slider "Vitesse bateau 5.0 nds" [ref=e222] [cursor=pointer]: "5"
        - table [ref=e223]:
          - rowgroup [ref=e224]:
            - row [ref=e225]:
              - columnheader "Manœuvre" [ref=e226]
              - columnheader "Temps" [ref=e227]
              - columnheader "Énergie" [ref=e228]
              - columnheader "Distance" [ref=e229]
          - rowgroup [ref=e230]:
            - row [ref=e231]:
              - rowheader "Virement / Empannage + voile" [ref=e232]
              - cell "192 s 3 min 12 s" [ref=e233]:
                - generic [ref=e234]:
                  - strong [ref=e235]: 192 s
                  - generic [ref=e236]: 3 min 12 s
              - cell "-26,0 %" [ref=e237]
              - cell "-0,13 nm" [ref=e238]
  - contentinfo [ref=e242]:
    - generic [ref=e243]:
      - generic [ref=e244]: © Copyright ITYC. All Rights Reserved
      - generic [ref=e245]: Designed by Skipper Du Mad
      - button "Remonter en haut de la page" [ref=e246] [cursor=pointer]: ↑
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
  34 |           await expect(page.locator('.autosail-chart > p').filter({ hasText: /^Calcul/ })).toHaveCount(0, { timeout: 25_000 })
  35 |           const emptyOverlap = page.locator('#autosail-chart-3 .autosail-chart > p').filter({ hasText: /^Pas de zones de recouvrement\.$/ })
  36 |           await expect(page.locator('.autosail-card canvas')).toHaveCount(await emptyOverlap.count() ? 3 : 4)
  37 |         }
  38 |         await page.waitForTimeout(500)
  39 | 
> 40 |         await expect(page).toHaveScreenshot(`${tool.name}-${viewport.name}.png`, {
     |                            ^ Error: expect(page).toHaveScreenshot(expected) failed
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