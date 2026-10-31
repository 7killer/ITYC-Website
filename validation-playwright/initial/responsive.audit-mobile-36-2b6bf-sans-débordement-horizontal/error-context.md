# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.audit.spec.ts >> mobile-360 >> penalites sans débordement horizontal
- Location: tests\visual\responsive.audit.spec.ts:26:7

# Error details

```
Error: largeur de page : 366px pour un viewport de 360px ; éléments : div.range-input-row (252→366), b.sans-classe (342→366), input.sans-classe (244→366), div.range-input-row (252→366), b.sans-classe (342→366), input.sans-classe (244→366)

expect(received).toBeLessThanOrEqual(expected)

Expected: <= 361
Received:    366
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
            - generic: Énergie du skipper
            - generic [ref=e138]:
              - textbox "Énergie du skipper" [ref=e139]: "66.7"
              - generic [ref=e140]: "%"
            - slider "Énergie du skipper 66.7 %" [ref=e141] [cursor=pointer]: "66.7"
          - generic [ref=e142]:
            - generic: True Wind Speed
            - generic [ref=e143]:
              - textbox "True Wind Speed" [ref=e144]: "10.0"
              - generic [ref=e145]: nds
            - slider "True Wind Speed 10.0 nds" [ref=e146] [cursor=pointer]: "10"
          - generic [ref=e147]:
            - generic: Vitesse sans changement
            - generic [ref=e148]:
              - textbox "Vitesse sans changement" [ref=e149]: "10.0"
              - generic [ref=e150]: nds
            - slider "Vitesse sans changement 10.0 nds" [ref=e151] [cursor=pointer]: "10"
          - generic [ref=e152]:
            - generic: Vitesse avec changement
            - generic [ref=e153]:
              - textbox "Vitesse avec changement" [ref=e154]: "12.0"
              - generic [ref=e155]: nds
            - slider "Vitesse avec changement 12.0 nds" [ref=e156] [cursor=pointer]: "12"
        - generic [ref=e157]:
          - table [ref=e159]:
            - rowgroup [ref=e160]:
              - row [ref=e161]:
                - columnheader "Manœuvre" [ref=e162]
                - columnheader "Temps" [ref=e163]
                - columnheader "Énergie" [ref=e164]
            - rowgroup [ref=e165]:
              - row [ref=e166]:
                - rowheader "Voile" [ref=e167]
                - cell "192 s 3 min 12 s" [ref=e168]:
                  - generic [ref=e169]:
                    - strong [ref=e170]: 192 s
                    - generic [ref=e171]: 3 min 12 s
                - cell "-16,0 %" [ref=e172]
          - table [ref=e173]:
            - rowgroup [ref=e174]:
              - row [ref=e175]:
                - rowheader "Rattrapage" [ref=e176]
                - cell "346 s 5 min 46 s" [ref=e177]:
                  - generic [ref=e178]:
                    - strong [ref=e179]: 346 s
                    - generic [ref=e180]: 5 min 46 s
              - row [ref=e181]:
                - rowheader "Distance" [ref=e182]
                - cell "0,96 nm" [ref=e183]
    - generic [ref=e187]:
      - generic [ref=e188]:
        - heading "Pénalités doubles" [level=2] [ref=e189]
        - generic [ref=e190]:
          - button "Réinitialiser le zoom de Pénalités doubles" [ref=e191] [cursor=pointer]: ↺
          - button "Afficher Pénalités doubles en focus" [ref=e192] [cursor=pointer]:
            - generic [aria-hidden] [ref=e194]: ↗
      - generic [ref=e196]:
        - generic [ref=e197]:
          - generic [ref=e199]:
            - generic [ref=e200]: Énergie du skipper
            - generic [ref=e201]:
              - textbox "Énergie du skipper" [ref=e202]: "66.7"
              - generic [ref=e203]: "%"
            - slider "Énergie du skipper 66.7 %" [ref=e204] [cursor=pointer]: "66.7"
          - generic [ref=e206]:
            - generic [ref=e207]: True Wind Speed
            - generic [ref=e208]:
              - textbox "True Wind Speed" [ref=e209]: "10.0"
              - generic [ref=e210]: nds
            - slider "True Wind Speed 10.0 nds" [ref=e211] [cursor=pointer]: "10"
          - generic [ref=e213]:
            - generic [ref=e214]: Vitesse bateau
            - generic [ref=e215]:
              - textbox "Vitesse bateau" [ref=e216]: "5.0"
              - generic [ref=e217]: nds
            - slider "Vitesse bateau 5.0 nds" [ref=e218] [cursor=pointer]: "5"
        - table [ref=e219]:
          - rowgroup [ref=e220]:
            - row [ref=e221]:
              - columnheader "Manœuvre" [ref=e222]
              - columnheader "Temps" [ref=e223]
              - columnheader "Énergie" [ref=e224]
              - columnheader "Distance" [ref=e225]
          - rowgroup [ref=e226]:
            - row [ref=e227]:
              - rowheader "Virement / Empannage + voile" [ref=e228]
              - cell "192 s 3 min 12 s" [ref=e229]:
                - generic [ref=e230]:
                  - strong [ref=e231]: 192 s
                  - generic [ref=e232]: 3 min 12 s
              - cell "-26,0 %" [ref=e233]
              - cell "-0,13 nm" [ref=e234]
  - contentinfo [ref=e238]:
    - generic [ref=e239]:
      - generic [ref=e240]: © Copyright ITYC. All Rights Reserved
      - generic [ref=e241]: Designed by Skipper Du Mad
      - button "Remonter en haut de la page" [ref=e242] [cursor=pointer]: ↑
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
  26 |       test(`${tool.name} sans débordement horizontal`, async ({ page }) => {
  27 |         await page.goto(`/${tool.hash}`)
  28 |         await expect(page.locator(tool.hash ? '.tool-page' : '.app-shell')).toBeVisible()
  29 |         await page.evaluate(async () => { await document.fonts.ready })
  30 | 
  31 |         const dimensions = await page.evaluate(() => {
  32 |           const viewportWidth = window.innerWidth
  33 |           const offenders = Array.from(document.body.querySelectorAll<HTMLElement>('*'))
  34 |             .map((element) => ({ element, rect: element.getBoundingClientRect() }))
  35 |             .filter(({ element, rect }) => !element.closest('.site-header') && (rect.right > viewportWidth + 1 || rect.left < -1))
  36 |             .sort((left, right) => right.rect.right - left.rect.right)
  37 |             .map(({ element, rect }) => `${element.tagName.toLowerCase()}.${element.className || 'sans-classe'} (${Math.round(rect.left)}→${Math.round(rect.right)})`)
  38 |             .slice(0, 8)
  39 |           return { documentWidth: document.documentElement.scrollWidth, offenders, viewportWidth }
  40 |         })
  41 |         expect(dimensions.documentWidth, `largeur de page : ${dimensions.documentWidth}px pour un viewport de ${dimensions.viewportWidth}px ; éléments : ${dimensions.offenders.join(', ')}`)
> 42 |           .toBeLessThanOrEqual(dimensions.viewportWidth + 1)
     |            ^ Error: largeur de page : 366px pour un viewport de 360px ; éléments : div.range-input-row (252→366), b.sans-classe (342→366), input.sans-classe (244→366), div.range-input-row (252→366), b.sans-classe (342→366), input.sans-classe (244→366)
  43 |       })
  44 |     }
  45 |   })
  46 | }
  47 | 
```