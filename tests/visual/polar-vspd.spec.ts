import { expect, test, type Frame, type Page } from '@playwright/test'
import type { Chart } from 'chart.js'

// Two distinct maxima make a swapped angle/speed curve or a stale sail/options
// result observable without relying on the production boat data.
const polar = {
  twa: [0, 60, 90, 120, 180],
  tws: [0, 2, 4],
  hull: { speedRatio: 1.1 },
  foil: { speedRatio: 1.5, twaMin: 110, twaMax: 140, twaMerge: 10, twsMin: 0, twsMax: 4, twsMerge: 1 },
  sail: [
    { name: 'Jib', speed: [[0, 0, 0], [0, 6, 12], [0, 5, 10], [0, 2, 4], [0, 1, 2]] },
    { name: 'Code0', speed: [[0, 0, 0], [0, 3, 6], [0, 4, 8], [0, 8, 16], [0, 2, 4]] },
  ],
}

type Scope = Frame | Page
const query = 'b=Class_40&ts=2&ta=90&foil=false&hull=false&fullPack=false&sails=Jib,Code0&layout=grid&level=normal'

test.use({ viewport: { width: 1440, height: 1100 } })

test.beforeEach(async ({ page }) => {
  await page.route('**/data/export/class40_2021.json', route => route.fulfill({
    contentType: 'application/json', body: JSON.stringify(polar),
  }))
})

async function readChart(scope: Scope, chartIndex: number, x = 2) {
  return scope.evaluate(async ({ chartIndex, x }) => {
    const source = await (await fetch('/src/shared/charts/InteractiveLineChart.tsx')).text()
    const moduleUrl = source.match(/from\s+["']([^"']*\/chart__js\.js[^"']*)["']/)?.[1]
    if (!moduleUrl) throw new Error('Module Chart.js du rendu introuvable')
    const { Chart: ChartConstructor } = await import(moduleUrl) as typeof import('chart.js')
    const canvas = document.querySelector<HTMLCanvasElement>(`#polar-chart-${chartIndex} canvas`)
    const chart = canvas && ChartConstructor.getChart(canvas) as Chart<'line'> | undefined
    if (!chart) return undefined
    const points = chart.data.datasets[0].data as Array<{ x: number; y: number }>
    const dataIndex = points.findIndex(point => Math.abs(point.x - x) < .00001)
    if (dataIndex < 0) throw new Error(`TWS ${x} absent de la courbe ${chartIndex}`)
    const point = chart.getDatasetMeta(0).data[dataIndex]
    chart.tooltip!.setActiveElements([{ datasetIndex: 0, index: dataIndex }], { x: point.x, y: point.y })
    chart.update('none')
    return {
      datasetCount: chart.data.datasets.length,
      point: points[dataIndex],
      points,
      xAxis: chart.options.scales!.x!.title!.text,
      yAxis: chart.options.scales!.y!.title!.text,
      labels: chart.tooltip!.body.map(body => [...body.before, ...body.lines, ...body.after].join(' ')),
    }
  }, { chartIndex, x })
}

for (const context of [
  { name: 'page en français', embedded: false, locale: 'fr' },
  { name: 'iframe en anglais', embedded: true, locale: 'en' },
] as const) {
  test(`BVMG, VMG, BSPD, VSPD et les voiles gardent leur ordre dans les quatre modes : ${context.name}`, async ({ page }) => {
    let scope: Scope = page
    if (context.embedded) {
      await page.goto('/')
      await page.setContent(`<iframe name="polar-frame" title="Polaires intégrées" src="/polarDash.html?${query}&lang=en" width="1400" height="1000"></iframe>`)
      await expect(page.frameLocator('iframe').locator('#polaire')).toBeVisible()
      scope = page.frame({ name: 'polar-frame' })!
      await expect(scope.locator('.embedded-page')).toBeVisible()
    } else {
      await page.goto(`/polar.html?${query}&lang=fr`)
    }

    const fr = context.locale === 'fr'
    const expectedTitles = [
      fr ? 'Vitesse selon le TWA' : 'Speed by TWA',
      fr ? 'Vitesse selon le TWS' : 'Speed by TWS',
      'BVMG', 'VMG', 'BSPD', 'VSPD', fr ? 'Utilisation des voiles' : 'Sail usage',
    ]
    for (const level of ['normal', 'expert'] as const) {
      await scope.getByRole('group', { name: fr ? 'Niveau de détail' : 'Detail level', exact: true })
        .getByRole('button', { name: level === 'normal' ? 'Normal' : 'Expert', exact: true }).click()
      for (const layout of ['grid', 'focus'] as const) {
        await scope.getByRole('group', { name: fr ? 'Disposition des courbes' : 'Chart layout', exact: true })
          .getByRole('button', { name: layout === 'focus' ? 'Focus' : fr ? 'Grille' : 'Grid', exact: true }).click()
        await expect(scope.locator('#polaire')).toHaveAttribute('data-polar-level', level)
        await expect(scope.locator('.chart-workspace')).toHaveClass(new RegExp(`layout-${layout}`))
        await expect(scope.locator('.chart-card-heading h3')).toHaveText(expectedTitles)
        expect(await scope.locator('.chart-card').evaluateAll(cards => cards.map(card => card.id)))
          .toEqual(expectedTitles.map((_, index) => `polar-chart-${index}`))
        await expect(scope.locator('.chart-card canvas')).toHaveCount(7)
        await expect(scope.locator('#polar-chart-6 .polar-sail-map canvas')).toHaveCount(1)
      }
    }

    const help = scope.locator('#polar-chart-5 .chart-help-button')
    const href = (await help.getAttribute('href'))!
    expect(href).toContain('section=chart-help-polar-vspd')
    if (context.embedded) {
      await expect(help).toHaveAttribute('target', '_blank')
      await page.goto(new URL(href, scope.url()).href)
    } else {
      await help.click()
    }
    const helpSection = page.locator('.help-content-section').filter({ has: page.locator('#chart-help-polar-vspd') })
    await expect(helpSection.locator(':scope > h3')).toHaveText(fr ? /Vitesse du bateau BestSpeed/ : /BestSpeed boat speed/)
  })
}

test('VSPD donne le maximum bateau au même angle que BSPD et suit les voiles, options et langues', async ({ page }) => {
  await page.goto(`/polar.html?${query}&lang=fr`)
  await expect(page.locator('.chart-card canvas')).toHaveCount(7)

  const speed = (await readChart(page, 5))!
  const angle = (await readChart(page, 4))!
  expect(speed.datasetCount).toBe(1)
  expect(angle.datasetCount).toBe(1)
  expect(speed.points).toHaveLength(31)
  expect(angle.points.map(point => point.x)).toEqual(speed.points.map(point => point.x))
  // The synthetic Code 0 reaches exactly 4 × TWS at 120°, including winds
  // interpolated between the source rows. This is speed, rather than VMG.
  for (const [index, point] of speed.points.entries()) {
    expect(point.y).toBeCloseTo(4 * point.x, 8)
    expect(angle.points[index].y).toBe(120)
  }
  expect(speed.xAxis).toBe('True Wind Speed (nds)')
  expect(speed.yAxis).toBe('Vitesse bateau (nds)')
  expect(angle.yAxis).toBe('True Wind Angle (°)')
  expect(speed.labels).toEqual(['VSPD : 8.0 nds (TWA : 120.0°) Code 0'])
  expect(angle.labels).toEqual(['BSPD : 120.0° (8.00000 nds) Code 0'])

  await page.locator('label[for="hull"]').click()
  await expect.poll(async () => (await readChart(page, 5))?.point.y).toBeCloseTo(8.8, 8)
  await page.locator('label[for="foil"]').click()
  await expect.poll(async () => (await readChart(page, 5))?.point.y).toBeCloseTo(13.2, 8)
  await page.locator('label[for="sail-Code0"]').click()
  await expect.poll(async () => (await readChart(page, 5))?.point.y).toBeCloseTo(6.6, 8)
  await expect.poll(async () => (await readChart(page, 4))?.point.y).toBe(60)
  expect((await readChart(page, 5))!.labels).toEqual(['VSPD : 6.6 nds (TWA : 60.0°) Foc (J)'])

  await page.getByRole('button', { name: 'English', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect.poll(async () => (await readChart(page, 5))?.labels)
    .toEqual(['VSPD : 6.6 kts (TWA : 60.0°) Jib'])
  expect((await readChart(page, 5))!.yAxis).toBe('Boat speed (kts)')
  expect((await readChart(page, 4))!.labels).toEqual(['BSPD : 60.0° (6.60000 kts) Jib'])
})
