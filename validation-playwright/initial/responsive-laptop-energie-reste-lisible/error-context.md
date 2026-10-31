# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.spec.ts >> laptop >> energie reste lisible
- Location: tests\visual\responsive.spec.ts:26:7

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  25230 pixels (ratio 0.03 of all image pixels) are different.

  Snapshot: energie-laptop.png

Call log:
  - Expect "toHaveScreenshot(energie-laptop.png)" with timeout 10000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 25230 pixels (ratio 0.03 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 25230 pixels (ratio 0.03 of all image pixels) are different.

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
    - heading "Énergie" [level=1] [ref=e36]
    - paragraph [ref=e37]:
      - button "Accueil" [ref=e38] [cursor=pointer]
      - generic [ref=e39]: /
      - generic [ref=e40]: Énergie
  - generic [ref=e42]:
    - combobox "Bateau" [ref=e44]:
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
    - paragraph [ref=e45]: "MAJ : mardi 2 juillet 2024 20:33:41"
    - link "Tutoriel" [ref=e46] [cursor=pointer]:
      - /url: "#aide"
    - group "Mode d'affichage" [ref=e47]:
      - button "Grille" [pressed] [ref=e48] [cursor=pointer]
      - button "Focus" [ref=e49] [cursor=pointer]
    - generic [ref=e51]:
      - generic [ref=e52] [cursor=pointer]:
        - checkbox "Full Pack" [checked] [ref=e53]
        - generic [ref=e55]: Full Pack
      - generic [ref=e56] [cursor=pointer]:
        - checkbox "Winch" [checked] [ref=e57]
        - generic [ref=e59]: Winch
      - generic [ref=e60] [cursor=pointer]:
        - checkbox "Enrouleur" [checked] [ref=e61]
        - generic [ref=e63]: Enrouleur
      - generic [ref=e64] [cursor=pointer]:
        - checkbox "Veste" [checked] [ref=e65]
        - generic [ref=e67]: Veste
      - generic [ref=e68] [cursor=pointer]:
        - checkbox "Coussin" [checked] [ref=e69]
        - generic [ref=e71]: Coussin
  - main [ref=e72]:
    - generic [ref=e73]:
      - generic [ref=e74]:
        - heading "Énergie perdue" [level=2] [ref=e75]
        - generic [ref=e76]:
          - button "Réinitialiser le zoom de Énergie perdue" [ref=e77] [cursor=pointer]: ↺
          - button "Afficher Énergie perdue en focus" [ref=e78] [cursor=pointer]:
            - generic [aria-hidden] [ref=e80]: ↗
      - generic [ref=e82]:
        - generic [ref=e84]:
          - generic [ref=e85]: True Wind Speed
          - generic [ref=e86]:
            - textbox "True Wind Speed" [ref=e87]: "10.0"
            - generic [ref=e88]: nds
          - slider "True Wind Speed 10.0 nds" [ref=e89] [cursor=pointer]: "10"
        - table [ref=e91]:
          - rowgroup [ref=e92]:
            - row [ref=e93]:
              - columnheader "Manœuvre" [ref=e94]
              - columnheader "Énergie" [ref=e95]
              - columnheader "Récupération" [ref=e96]
          - rowgroup [ref=e97]:
            - row [ref=e98]:
              - rowheader "Virement / Empannage" [ref=e99]
              - cell "-10,0 %" [ref=e100]
              - cell "1 h 0 min" [ref=e101]
            - row [ref=e102]:
              - rowheader "Voile" [ref=e103]
              - cell "-16,0 %" [ref=e104]
              - cell "1 h 36 min" [ref=e105]
    - generic [ref=e109]:
      - generic [ref=e110]:
        - heading "Énergie récupérée" [level=2] [ref=e111]
        - generic [ref=e112]:
          - button "Réinitialiser le zoom de Énergie récupérée" [ref=e113] [cursor=pointer]: ↺
          - button "Afficher Énergie récupérée en focus" [ref=e114] [cursor=pointer]:
            - generic [aria-hidden] [ref=e116]: ↗
      - generic [ref=e118]:
        - generic [ref=e119]:
          - generic [ref=e120]:
            - generic [ref=e121]: Énergie du skipper
            - generic [ref=e122]:
              - textbox "Énergie du skipper" [ref=e123]: "66.7"
              - generic [ref=e124]: "%"
            - slider "Énergie du skipper 66.7 %" [ref=e125] [cursor=pointer]: "66.7"
          - generic [ref=e126]:
            - generic [ref=e127]: True Wind Speed
            - generic [ref=e128]:
              - textbox "True Wind Speed" [ref=e129]: "10.0"
              - generic [ref=e130]: nds
            - slider "True Wind Speed 10.0 nds" [ref=e131] [cursor=pointer]: "10"
        - table [ref=e133]:
          - rowgroup [ref=e134]:
            - row [ref=e135]:
              - rowheader "Énergie récupérée" [ref=e136]
              - cell "33,3 %" [ref=e137]
            - row [ref=e138]:
              - rowheader "Temps de récupération" [ref=e139]
              - cell "3 h 19 min 48 s" [ref=e140]
            - row [ref=e141]:
              - rowheader "Récupération par point" [ref=e142]
              - cell "6 min" [ref=e143]
  - contentinfo [ref=e147]:
    - generic [ref=e148]:
      - generic [ref=e149]: © Copyright ITYC. All Rights Reserved
      - generic [ref=e150]: Designed by Skipper Du Mad
      - button "Remonter en haut de la page" [ref=e151] [cursor=pointer]: ↑
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
  30 |         await page.waitForTimeout(500)
  31 | 
> 32 |         await expect(page).toHaveScreenshot(`${tool.name}-${viewport.name}.png`, {
     |                            ^ Error: expect(page).toHaveScreenshot(expected) failed
  33 |           animations: 'disabled',
  34 |           fullPage: true,
  35 |           maxDiffPixelRatio: .01,
  36 |         })
  37 |       })
  38 |     }
  39 |   })
  40 | }
  41 | 
```