# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.spec.ts >> mobile-360 >> polaires reste lisible
- Location: tests\visual\responsive.spec.ts:26:7

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  17624 pixels (ratio 0.02 of all image pixels) are different.

  Snapshot: polaires-mobile-360.png

Call log:
  - Expect "toHaveScreenshot(polaires-mobile-360.png)" with timeout 10000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 17624 pixels (ratio 0.02 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 17624 pixels (ratio 0.02 of all image pixels) are different.

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
            - button "Normal" [pressed] [ref=e123] [cursor=pointer]
            - button "Expert" [ref=e124] [cursor=pointer]
  - main [ref=e125]:
    - region "Courbes normales de Class 40 2021" [ref=e126]:
      - generic [ref=e127]:
        - article [ref=e128]:
          - generic [ref=e129]:
            - heading "Vitesse selon le TWA" [level=3] [ref=e131]
            - generic [ref=e132]:
              - generic [ref=e134]:
                - generic [ref=e135]: True Wind Speed
                - generic [ref=e136]:
                  - textbox "True Wind Speed" [ref=e137]: "18.0"
                  - generic [ref=e138]: nds
                - slider "True Wind Speed 18.0 nds" [ref=e139] [cursor=pointer]: "18"
              - button "Réinitialiser le zoom et le déplacement de Vitesse selon le TWA" [ref=e140] [cursor=pointer]: ↺
              - button "Afficher Vitesse selon le TWA en focus" [ref=e141] [cursor=pointer]:
                - generic [aria-hidden] [ref=e143]: ↗
          - 'generic "Zone de tracé : Vitesse selon le TWA" [ref=e144]'
        - article [ref=e147]:
          - generic [ref=e148]:
            - heading "Vitesse selon le TWS" [level=3] [ref=e150]
            - generic [ref=e151]:
              - generic [ref=e153]:
                - generic [ref=e154]: True Wind Angle
                - generic [ref=e155]:
                  - textbox "True Wind Angle" [ref=e156]: "120.0"
                  - generic [ref=e157]: °
                - slider "True Wind Angle 120.0 °" [ref=e158] [cursor=pointer]: "120"
              - button "Réinitialiser le zoom et le déplacement de Vitesse selon le TWS" [ref=e159] [cursor=pointer]: ↺
              - button "Afficher Vitesse selon le TWS en focus" [ref=e160] [cursor=pointer]:
                - generic [aria-hidden] [ref=e162]: ↗
          - 'generic "Zone de tracé : Vitesse selon le TWS" [ref=e163]'
        - article [ref=e166]:
          - generic [ref=e167]:
            - heading "BVMG" [level=3] [ref=e169]
            - generic [ref=e170]:
              - button "Réinitialiser le zoom et le déplacement de BVMG" [ref=e171] [cursor=pointer]: ↺
              - button "Afficher BVMG en focus" [ref=e172] [cursor=pointer]:
                - generic [aria-hidden] [ref=e174]: ↗
          - 'generic "Zone de tracé : BVMG" [ref=e175]'
        - article [ref=e178]:
          - generic [ref=e179]:
            - heading "Best Speed" [level=3] [ref=e181]
            - generic [ref=e182]:
              - button "Réinitialiser le zoom et le déplacement de Best Speed" [ref=e183] [cursor=pointer]: ↺
              - button "Afficher Best Speed en focus" [ref=e184] [cursor=pointer]:
                - generic [aria-hidden] [ref=e186]: ↗
          - 'generic "Zone de tracé : Best Speed" [ref=e187]'
        - article [ref=e190]:
          - generic [ref=e191]:
            - heading "VMG" [level=3] [ref=e193]
            - generic [ref=e194]:
              - button "Réinitialiser le zoom et le déplacement de VMG" [ref=e195] [cursor=pointer]: ↺
              - button "Afficher VMG en focus" [ref=e196] [cursor=pointer]:
                - generic [aria-hidden] [ref=e198]: ↗
          - 'generic "Zone de tracé : VMG" [ref=e199]'
        - article [ref=e202]:
          - generic [ref=e203]:
            - heading "Utilisation des voiles" [level=3] [ref=e205]
            - generic [ref=e206]:
              - button "Réinitialiser le zoom et le déplacement de Utilisation des voiles" [ref=e207] [cursor=pointer]: ↺
              - button "Afficher Utilisation des voiles en focus" [ref=e208] [cursor=pointer]:
                - generic [aria-hidden] [ref=e210]: ↗
          - 'generic "Zone de tracé : Utilisation des voiles" [ref=e211]'
  - contentinfo [ref=e214]:
    - generic [ref=e215]:
      - generic [ref=e216]: © Copyright ITYC. All Rights Reserved
      - generic [ref=e217]: Designed by Skipper Du Mad
      - button "Remonter en haut de la page" [ref=e218] [cursor=pointer]: ↑
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