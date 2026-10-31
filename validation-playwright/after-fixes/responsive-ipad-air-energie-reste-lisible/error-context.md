# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.spec.ts >> ipad-air >> energie reste lisible
- Location: tests\visual\responsive.spec.ts:26:7

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  Expected an image 820px by 2233px, received 820px by 2275px. 70485 pixels (ratio 0.04 of all image pixels) are different.

  Snapshot: energie-ipad-air.png

Call log:
  - Expect "toHaveScreenshot(energie-ipad-air.png)" with timeout 10000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Expected an image 820px by 2233px, received 820px by 2275px. 70485 pixels (ratio 0.04 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - Expected an image 820px by 2233px, received 820px by 2275px. 70485 pixels (ratio 0.04 of all image pixels) are different.

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
    - heading "Énergie" [level=1] [ref=e34]
    - paragraph [ref=e35]:
      - button "Accueil" [ref=e36] [cursor=pointer]
      - generic [ref=e37]: /
      - generic [ref=e38]: Énergie
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
      - generic [ref=e66] [cursor=pointer]:
        - checkbox "Coussin" [checked] [ref=e67]
        - generic [ref=e69]: Coussin
  - main [ref=e70]:
    - generic [ref=e71]:
      - generic [ref=e72]:
        - heading "Énergie perdue" [level=2] [ref=e73]
        - generic [ref=e74]:
          - button "Réinitialiser le zoom de Énergie perdue" [ref=e75] [cursor=pointer]: ↺
          - button "Afficher Énergie perdue en focus" [ref=e76] [cursor=pointer]:
            - generic [aria-hidden] [ref=e78]: ↗
      - generic [ref=e80]:
        - generic [ref=e82]:
          - generic [ref=e83]: True Wind Speed
          - generic [ref=e84]:
            - textbox "True Wind Speed" [ref=e85]: "10.0"
            - generic [ref=e86]: nds
          - slider "True Wind Speed 10.0 nds" [ref=e87] [cursor=pointer]: "10"
        - table [ref=e89]:
          - rowgroup [ref=e90]:
            - row [ref=e91]:
              - columnheader "Manœuvre" [ref=e92]
              - columnheader "Énergie" [ref=e93]
              - columnheader "Récupération" [ref=e94]
          - rowgroup [ref=e95]:
            - row [ref=e96]:
              - rowheader "Virement / Empannage" [ref=e97]
              - cell "-10,0 %" [ref=e98]
              - cell "1 h 0 min" [ref=e99]
            - row [ref=e100]:
              - rowheader "Voile" [ref=e101]
              - cell "-16,0 %" [ref=e102]
              - cell "1 h 36 min" [ref=e103]
    - generic [ref=e107]:
      - generic [ref=e108]:
        - heading "Énergie récupérée" [level=2] [ref=e109]
        - generic [ref=e110]:
          - button "Réinitialiser le zoom de Énergie récupérée" [ref=e111] [cursor=pointer]: ↺
          - button "Afficher Énergie récupérée en focus" [ref=e112] [cursor=pointer]:
            - generic [aria-hidden] [ref=e114]: ↗
      - generic [ref=e116]:
        - generic [ref=e117]:
          - generic [ref=e118]:
            - generic [ref=e119]: Énergie du skipper
            - generic [ref=e120]:
              - textbox "Énergie du skipper" [ref=e121]: "66.7"
              - generic [ref=e122]: "%"
            - slider "Énergie du skipper 66.7 %" [ref=e123] [cursor=pointer]: "66.7"
          - generic [ref=e124]:
            - generic [ref=e125]: True Wind Speed
            - generic [ref=e126]:
              - textbox "True Wind Speed" [ref=e127]: "10.0"
              - generic [ref=e128]: nds
            - slider "True Wind Speed 10.0 nds" [ref=e129] [cursor=pointer]: "10"
        - table [ref=e131]:
          - rowgroup [ref=e132]:
            - row [ref=e133]:
              - rowheader "Énergie récupérée" [ref=e134]
              - cell "33,3 %" [ref=e135]
            - row [ref=e136]:
              - rowheader "Temps de récupération" [ref=e137]
              - cell "3 h 19 min 48 s" [ref=e138]
            - row [ref=e139]:
              - rowheader "Récupération par point" [ref=e140]
              - cell "6 min" [ref=e141]
  - contentinfo [ref=e145]:
    - generic [ref=e146]:
      - generic [ref=e147]: © Copyright ITYC. All Rights Reserved
      - generic [ref=e148]: Designed by Skipper Du Mad
      - button "Remonter en haut de la page" [ref=e149] [cursor=pointer]: ↑
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
  34 |           await expect(page.locator('.autosail-chart > p').filter({ hasText: /^Calcul/ })).toHaveCount(0)
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