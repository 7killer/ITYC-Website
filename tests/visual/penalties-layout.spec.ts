import { expect, test } from '@playwright/test'

test('les vues Pénalités affichent les temps convertis et conservent leur disposition par mode', async ({ page }) => {
  await page.setViewportSize({ width: 1640, height: 960 })
  await page.addInitScript(() => sessionStorage.clear())
  await page.goto('/#penalites')
  const cardTitles = () => page.locator('.analysis-card-heading h2').allTextContents()
  await expect.poll(cardTitles).toEqual(['Pénalités simples', 'Rentabilité', 'Pénalités doubles'])

  const simpleCard = page.locator('#analysis-card-0')
  const rentCard = page.locator('#analysis-card-2')
  const gridChartGeometry = await Promise.all([simpleCard, rentCard].map((card) => card.locator('.analysis-chart').boundingBox()))
  expect(gridChartGeometry[0]).not.toBeNull()
  expect(gridChartGeometry[1]).not.toBeNull()
  expect(Math.abs(gridChartGeometry[0]!.y - gridChartGeometry[1]!.y)).toBeLessThanOrEqual(8)
  expect(Math.abs(gridChartGeometry[0]!.height - gridChartGeometry[1]!.height)).toBeLessThanOrEqual(8)
  const rentGridAlignment = await rentCard.locator('.penalty-rent-settings').evaluate((settings) => {
    const bounds = (selector: string) => settings.querySelector(selector)!.getBoundingClientRect()
    const without = bounds('.penalty-rent-fields > .range-field:nth-child(3)')
    const withChange = bounds('.penalty-rent-fields > .range-field:nth-child(4)')
    const penalty = bounds('.penalty-rent-penalty')
    const summary = bounds('.penalty-rent-summary')
    return { speedAlignment: Math.abs(without.left - withChange.left), tablesRow: Math.abs(penalty.top - summary.top) }
  })
  expect(rentGridAlignment.speedAlignment).toBeLessThanOrEqual(1)
  expect(rentGridAlignment.tablesRow).toBeLessThanOrEqual(1)
  const simpleGridResults = simpleCard.locator('.penalty-grid-results')
  await expect(simpleGridResults).toBeVisible()
  await expect(simpleGridResults.locator('thead th')).toHaveText(['Manœuvre', 'Temps', 'Énergie', 'Distance'])
  await expect(simpleGridResults.locator('.penalty-time-value strong').first()).toHaveText('180 s')
  await expect(simpleGridResults.locator('.penalty-time-value small').first()).toHaveText('3 min')
  const timeType = await simpleGridResults.locator('.penalty-time-value').first().evaluate((group) => {
    const secondsStyle = getComputedStyle(group.querySelector('strong')!)
    const convertedStyle = getComputedStyle(group.querySelector('small')!)
    return { secondsSize: secondsStyle.fontSize, convertedSize: convertedStyle.fontSize, secondsWeight: secondsStyle.fontWeight, convertedWeight: convertedStyle.fontWeight, gap: getComputedStyle(group).columnGap }
  })
  expect(timeType.convertedSize).toBe(timeType.secondsSize)
  expect(timeType.convertedWeight).toBe(timeType.secondsWeight)
  expect(timeType.gap).not.toBe('0px')
  await expect(simpleGridResults.locator('thead th').nth(1)).toHaveCSS('text-align', 'center')
  const gridAlignment = await simpleCard.locator('.penalty-settings').evaluate((settings) => {
    const top = (selector: string) => settings.querySelector(selector)!.getBoundingClientRect().top
    return { energy: top('.penalty-field-energy .range-field'), wind: top('.penalty-field-wind .range-field'), speed: top('.penalty-field-speed .range-field'), table: top('.penalty-grid-results') }
  })
  expect(gridAlignment.energy).toBe(gridAlignment.wind)
  expect(gridAlignment.wind).toBe(gridAlignment.speed)
  expect(gridAlignment.table).toBeGreaterThan(gridAlignment.speed)
  const sliderWidths = await simpleCard.locator('.penalty-settings').evaluate((settings) => ['energy', 'wind', 'speed'].map((name) => settings.querySelector(`.penalty-field-${name} input[type="range"]`)!.getBoundingClientRect().width))
  expect(Math.max(...sliderWidths) - Math.min(...sliderWidths)).toBeLessThanOrEqual(1)

  await simpleCard.getByRole('button', { name: 'Afficher Pénalités simples en focus' }).click()
  await expect(simpleCard.locator('.penalty-focus-time')).toBeVisible()
  await expect(simpleCard.locator('.penalty-focus-distance')).toBeVisible()
  await expect(simpleCard.locator('.penalty-grid-results')).toBeHidden()
  const focusOrder = await simpleCard.locator('.penalty-settings').evaluate((settings) => {
    const bounds = (selector: string) => settings.querySelector(selector)!.getBoundingClientRect().top
    return [bounds('.penalty-field-energy .range-field'), bounds('.penalty-field-wind .range-field'), bounds('.penalty-focus-time'), bounds('.penalty-field-speed .range-field'), bounds('.penalty-focus-distance')]
  })
  expect(focusOrder).toEqual([...focusOrder].sort((a, b) => a - b))
  const focusAlignment = await simpleCard.locator('.penalty-settings').evaluate((settings) => {
    const geometry = (selector: string) => {
      const field = settings.querySelector(selector)!
      const input = field.querySelector('.range-input-row input')!.getBoundingClientRect()
      const unit = field.querySelector('.range-input-row b')!.getBoundingClientRect()
      const slider = field.querySelector('input[type="range"]')!.getBoundingClientRect()
      return { inputLeft: Math.round(input.left), textAlign: getComputedStyle(field.querySelector('.range-input-row input')!).textAlign, unitRight: Math.round(unit.right), sliderRight: Math.round(slider.right) }
    }
    return [geometry('.penalty-field-energy'), geometry('.penalty-field-wind'), geometry('.penalty-field-speed')]
  })
  expect(focusAlignment[0].inputLeft).toBe(focusAlignment[1].inputLeft)
  expect(focusAlignment[1].inputLeft).toBe(focusAlignment[2].inputLeft)
  for (const field of focusAlignment) {
    expect(field.unitRight).toBe(field.sliderRight)
    expect(field.textAlign).toBe('right')
  }
  const focusSpacing = await simpleCard.locator('.penalty-settings').evaluate((settings) => ({
    topPadding: parseFloat(getComputedStyle(settings).paddingTop),
    speedGap: parseFloat(getComputedStyle(settings.querySelector('.penalty-field-speed .range-field')!).marginTop),
  }))
  expect(focusSpacing.topPadding).toBeGreaterThanOrEqual(16)
  expect(focusSpacing.speedGap).toBeGreaterThanOrEqual(19)
  await simpleCard.getByRole('button', { name: 'Revenir à la grille' }).click()
  const doubleCard = page.locator('#analysis-card-1')
  await expect(doubleCard.locator('.penalty-grid-results')).toBeVisible()
  await doubleCard.getByRole('button', { name: 'Afficher Pénalités doubles en focus' }).click()
  await expect(doubleCard.locator('.penalty-focus-time')).toBeVisible()
  await expect(doubleCard.locator('.penalty-focus-distance')).toBeVisible()

  await rentCard.getByRole('button', { name: 'Revenir à la grille' }).click()
  const rentGridLayout = await rentCard.locator('.analysis-card-content').evaluate((content) => getComputedStyle(content).display)
  expect(rentGridLayout).toBe('flex')
  await rentCard.getByRole('button', { name: 'Afficher Rentabilité en focus' }).click()
  await expect.poll(cardTitles).toEqual(['Pénalités simples', 'Rentabilité', 'Pénalités doubles'])
  await expect(rentCard.locator('.penalty-rent-settings')).toBeVisible()
  await expect(rentCard.locator('.penalty-rent-results')).toContainText('3 min 12 s')
  const rentLayout = await rentCard.locator('.analysis-card-content').evaluate((content) => getComputedStyle(content).display)
  expect(rentLayout).toBe('grid')
  const rentFocusOrder = await rentCard.locator('.penalty-rent-settings').evaluate((settings) => {
    const top = (selector: string) => settings.querySelector(selector)!.getBoundingClientRect().top
    return [top('.penalty-rent-fields > .range-field:nth-child(1)'), top('.penalty-rent-fields > .range-field:nth-child(2)'), top('.penalty-rent-penalty'), top('.penalty-rent-fields > .range-field:nth-child(3)'), top('.penalty-rent-fields > .range-field:nth-child(4)'), top('.penalty-rent-summary')]
  })
  expect(rentFocusOrder).toEqual([...rentFocusOrder].sort((a, b) => a - b))
})
