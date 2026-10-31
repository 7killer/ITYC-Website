# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.spec.ts >> desktop >> polaires reste lisible
- Location: tests\visual\responsive.spec.ts:26:7

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  34654 pixels (ratio 0.02 of all image pixels) are different.

  Snapshot: polaires-desktop.png

Call log:
  - Expect "toHaveScreenshot(polaires-desktop.png)" with timeout 10000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 34654 pixels (ratio 0.02 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 34654 pixels (ratio 0.02 of all image pixels) are different.

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
    - generic [ref=e36]:
      - heading "Polaires" [level=1] [ref=e38]
      - paragraph [ref=e39]:
        - button "Accueil" [ref=e40] [cursor=pointer]
        - generic [ref=e41]: /
        - text: Polaires
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
        - region "Modes d’affichage" [ref=e123]:
          - group "Niveau de détail" [ref=e124]:
            - button "Normal" [pressed] [ref=e125] [cursor=pointer]
            - button "Expert" [ref=e126] [cursor=pointer]
  - main [ref=e127]:
    - region "Courbes normales de Class 40 2021" [ref=e128]:
      - generic [ref=e129]:
        - article [ref=e130]:
          - generic [ref=e131]:
            - heading "Vitesse selon le TWA" [level=3] [ref=e133]
            - generic [ref=e134]:
              - generic [ref=e136]:
                - generic [ref=e137]: True Wind Speed
                - generic [ref=e138]:
                  - textbox "True Wind Speed" [ref=e139]: "18.0"
                  - generic [ref=e140]: nds
                - slider "True Wind Speed 18.0 nds" [ref=e141] [cursor=pointer]: "18"
              - button "Réinitialiser le zoom et le déplacement de Vitesse selon le TWA" [ref=e142] [cursor=pointer]: ↺
              - button "Afficher Vitesse selon le TWA en focus" [ref=e143] [cursor=pointer]:
                - generic [aria-hidden] [ref=e145]: ↗
          - 'generic "Zone de tracé : Vitesse selon le TWA" [ref=e146]'
        - article [ref=e149]:
          - generic [ref=e150]:
            - heading "Vitesse selon le TWS" [level=3] [ref=e152]
            - generic [ref=e153]:
              - generic [ref=e155]:
                - generic [ref=e156]: True Wind Angle
                - generic [ref=e157]:
                  - textbox "True Wind Angle" [ref=e158]: "120.0"
                  - generic [ref=e159]: °
                - slider "True Wind Angle 120.0 °" [ref=e160] [cursor=pointer]: "120"
              - button "Réinitialiser le zoom et le déplacement de Vitesse selon le TWS" [ref=e161] [cursor=pointer]: ↺
              - button "Afficher Vitesse selon le TWS en focus" [ref=e162] [cursor=pointer]:
                - generic [aria-hidden] [ref=e164]: ↗
          - 'generic "Zone de tracé : Vitesse selon le TWS" [ref=e165]'
        - article [ref=e168]:
          - generic [ref=e169]:
            - heading "BVMG" [level=3] [ref=e171]
            - generic [ref=e172]:
              - button "Réinitialiser le zoom et le déplacement de BVMG" [ref=e173] [cursor=pointer]: ↺
              - button "Afficher BVMG en focus" [ref=e174] [cursor=pointer]:
                - generic [aria-hidden] [ref=e176]: ↗
          - 'generic "Zone de tracé : BVMG" [ref=e177]'
        - article [ref=e180]:
          - generic [ref=e181]:
            - heading "Best Speed" [level=3] [ref=e183]
            - generic [ref=e184]:
              - button "Réinitialiser le zoom et le déplacement de Best Speed" [ref=e185] [cursor=pointer]: ↺
              - button "Afficher Best Speed en focus" [ref=e186] [cursor=pointer]:
                - generic [aria-hidden] [ref=e188]: ↗
          - 'generic "Zone de tracé : Best Speed" [ref=e189]'
        - article [ref=e192]:
          - generic [ref=e193]:
            - heading "VMG" [level=3] [ref=e195]
            - generic [ref=e196]:
              - button "Réinitialiser le zoom et le déplacement de VMG" [ref=e197] [cursor=pointer]: ↺
              - button "Afficher VMG en focus" [ref=e198] [cursor=pointer]:
                - generic [aria-hidden] [ref=e200]: ↗
          - 'generic "Zone de tracé : VMG" [ref=e201]'
        - article [ref=e204]:
          - generic [ref=e205]:
            - heading "Utilisation des voiles" [level=3] [ref=e207]
            - generic [ref=e208]:
              - button "Réinitialiser le zoom et le déplacement de Utilisation des voiles" [ref=e209] [cursor=pointer]: ↺
              - button "Afficher Utilisation des voiles en focus" [ref=e210] [cursor=pointer]:
                - generic [aria-hidden] [ref=e212]: ↗
          - 'generic "Zone de tracé : Utilisation des voiles" [ref=e213]'
  - contentinfo [ref=e216]:
    - generic [ref=e217]:
      - generic [ref=e218]: © Copyright ITYC. All Rights Reserved
      - generic [ref=e219]: Designed by Skipper Du Mad
      - button "Remonter en haut de la page" [ref=e220] [cursor=pointer]: ↑
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