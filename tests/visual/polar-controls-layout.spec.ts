import { expect, test } from '@playwright/test'

for (const width of [1280, 1440]) {
  for (const tool of ['polaire', 'autosail']) {
    test(`les commandes de voiles restent distinctes du mode de détail sur ${tool} à ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`/#${tool}`)
      const controls = page.locator('.sailing-controls')
      await expect(controls).toBeVisible()
      await expect(controls.locator('.sails-panel .toggle-field')).toHaveCount(7)
      await page.evaluate(async () => { await document.fonts.ready })

      const display = controls.locator('.display-panel')
      if (tool === 'polaire') await expect(display.locator('.segmented-control')).toBeVisible()
      else await expect(display).toBeHidden()

      const geometry = await controls.evaluate(element => {
        const rect = (bounds: DOMRect) => ({ left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom })
        const sails = element.querySelector('.sails-panel')!
        const display = element.querySelector('.display-panel')!
        return {
          controls: rect(element.getBoundingClientRect()),
          sails: rect(sails.getBoundingClientRect()),
          display: getComputedStyle(display).display === 'none' ? null : rect(display.getBoundingClientRect()),
          toggles: [...sails.querySelectorAll('.toggle-field')].map(toggle => {
            const text = document.createRange()
            text.selectNodeContents(toggle.querySelector(':scope > span:last-child')!)
            return {
              field: rect(toggle.getBoundingClientRect()),
              track: rect(toggle.querySelector('.toggle-track')!.getBoundingClientRect()),
              text: rect(text.getBoundingClientRect()),
            }
          }),
        }
      })

      const within = (box: typeof geometry.sails, parent: typeof geometry.sails) => {
        expect(box.left).toBeGreaterThanOrEqual(parent.left - 1)
        expect(box.right).toBeLessThanOrEqual(parent.right + 1)
        expect(box.top).toBeGreaterThanOrEqual(parent.top - 1)
        expect(box.bottom).toBeLessThanOrEqual(parent.bottom + 1)
      }
      within(geometry.sails, geometry.controls)
      if (geometry.display) {
        within(geometry.display, geometry.controls)
        expect(geometry.sails.right <= geometry.display.left + 1 || geometry.sails.bottom <= geometry.display.top + 1,
          'les voiles et le mode de détail ne se chevauchent pas, en ligne ou empilés').toBe(true)
      }
      for (const toggle of geometry.toggles) {
        within(toggle.field, geometry.sails)
        within(toggle.track, geometry.sails)
        within(toggle.text, geometry.sails)
        expect(toggle.track.right).toBeLessThanOrEqual(toggle.text.left + 1)
      }
    })
  }
}
