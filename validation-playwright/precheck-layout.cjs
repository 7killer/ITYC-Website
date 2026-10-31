const { chromium } = require('@playwright/test')
const fs = require('node:fs/promises')
const path = require('node:path')

;(async () => {
  const output = path.join(__dirname, 'precheck-layout')
  await fs.mkdir(output, { recursive: true })
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  const results = []
  const fields = []
  try {
    for (const locale of ['fr', 'en']) {
    for (const width of [360, 390, 820, 1000, 1440]) {
      for (const layout of ['grid', 'focus']) {
        const page = await browser.newPage({ viewport: { width, height: width < 500 ? 900 : 1180 } })
        await page.goto(`http://127.0.0.1:4173/polar${locale === 'en' ? 'En' : ''}.html?b=Class_40&o=FP&level=expert&layout=${layout}`)
        const canvas = page.locator('.expert-polar-diagram')
        await canvas.waitFor()
        await page.evaluate(() => document.fonts.ready)
        await canvas.scrollIntoViewIfNeeded()
        await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))))
        const bounds = await canvas.evaluate(element => {
          const box = element.getBoundingClientRect()
          const panel = element.closest('.expert-polar-panel')
          const info = panel.querySelector('.expert-info-panel').getBoundingClientRect()
          return { width: box.width, height: box.height, left: box.left, right: box.right,
            stacked: info.top >= box.bottom - 2, documentWidth: document.documentElement.scrollWidth,
            centerVisible: document.elementFromPoint(box.left + box.width / 2, Math.min(innerHeight - 2, box.top + box.height / 2)) === element }
        })
        results.push({ locale, viewport: width, layout, ...bounds })
        if (width <= 390) await page.screenshot({ path: path.join(output, `polar-${locale}-${layout}-${width}.png`) })
        await page.close()
      }
    }
    for (const width of [360, 390, 768, 820, 1000, 1280, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } })
      await page.goto(`http://127.0.0.1:4173/autoSail${locale === 'en' ? 'En' : ''}.html?o=FP&layout=grid`)
      await page.locator('#autosail-tws-number').waitFor()
      await page.evaluate(() => document.fonts.ready)
      for (const id of ['autosail-twa', 'autosail-tws']) {
        const geometry = await page.locator(`label[for="${id}"]`).evaluate(element => {
          const label = element.querySelector('span')
          const value = element.querySelector('.range-input-row')
          const text = label.getBoundingClientRect(), box = value.getBoundingClientRect()
          return { label: label.textContent, title: label.title, gap: box.left - text.right,
            documentWidth: document.documentElement.scrollWidth }
        })
        fields.push({ locale, viewport: width, id, ...geometry })
      }
      await page.close()
    }
    }
  } finally { await browser.close() }
  await fs.writeFile(path.join(output, 'geometry.json'), JSON.stringify(results, null, 2))
  console.log(JSON.stringify(results))
  await fs.writeFile(path.join(output, 'fields.json'), JSON.stringify(fields, null, 2))
  console.log(JSON.stringify(fields))
  if (results.some(result => result.width < 260 || result.documentWidth > result.viewport + 1 || (result.viewport <= 390 && (!result.stacked || result.height < result.width * 1.9)))) process.exitCode = 1
  if (fields.some(field => field.gap < -1 || field.documentWidth > field.viewport + 1 || !['TWA', 'TWS'].includes(field.label))) process.exitCode = 1
})().catch(error => { console.error(error); process.exitCode = 1 })
