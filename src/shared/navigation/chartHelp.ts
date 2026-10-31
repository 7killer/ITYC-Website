// Stable, language-independent destinations. Chapter positions follow the
// French reference documents, whose structure is retained in translations.
export const chartHelpTopics = {
  'polar-diagram': { article: 'tuto_polaire', chapter: 4 },
  'polar-speed-twa': { article: 'tuto_polaire', chapter: 6 },
  'polar-speed-tws': { article: 'tuto_polaire', chapter: 5 },
  'polar-bvmg': { article: 'tuto_polaire', chapter: 7 },
  'polar-vmg': { article: 'tuto_polaire', chapter: 8 },
  'polar-best-speed': { article: 'tuto_polaire', chapter: 9 },
  'polar-vspd': { article: 'tuto_polaire', chapter: 10 },
  'polar-sails': { article: 'tuto_polaire', chapter: 11 },
  'autosail-twa': { article: 'tuto_autoSail', chapter: 3 },
  'autosail-tws': { article: 'tuto_autoSail', chapter: 4 },
  'autosail-usage': { article: 'tuto_autoSail', chapter: 5 },
  'autosail-overlap': { article: 'tuto_autoSail', chapter: 6 },
  'penalties-simple': { article: 'tuto_pena', chapter: 3 },
  'penalties-rentability': { article: 'tuto_pena', chapter: 4 },
  'penalties-double': { article: 'tuto_pena', chapter: 5 },
  'energy-loss': { article: 'tuto_energy', chapter: 3 },
  'energy-recovery': { article: 'tuto_energy', chapter: 4 },
} as const

export type ChartHelpTopic = keyof typeof chartHelpTopics
export const chartHelpAnchor = (topic: ChartHelpTopic) => `chart-help-${topic}`

export function chapterChartHelpAnchor(article: string, chapter: number) {
  const topic = (Object.keys(chartHelpTopics) as ChartHelpTopic[])
    .find(key => chartHelpTopics[key].article === article && chartHelpTopics[key].chapter === chapter)
  return topic ? chartHelpAnchor(topic) : undefined
}
