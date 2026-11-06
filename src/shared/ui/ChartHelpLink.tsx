import { chartHelpAnchor, chartHelpTopics, type ChartHelpTopic } from '../navigation/chartHelp'
import { navigationHref } from '../navigation/siteLinks'
import { ChartActionIcon } from './ChartActionIcon'
export type { ChartHelpTopic } from '../navigation/chartHelp'

export function ChartHelpLink({ topic, locale, theme, embedded = false }: {
  topic: ChartHelpTopic
  locale: 'fr' | 'en'
  theme: 'dark' | 'light'
  embedded?: boolean
}) {
  const label = locale === 'fr' ? 'Aide sur ce graphique' : 'Help for this chart'
  const section = new URLSearchParams({ article: chartHelpTopics[topic].article, section: chartHelpAnchor(topic) })
  const href = `${navigationHref('#aide', locale, theme).split('#')[0]}#aide?${section}`
  return <a aria-label={label} title={label} className="icon-button chart-help-button" href={href}
    {...(embedded ? { target: '_blank', rel: 'noreferrer' } : {})}><ChartActionIcon action="help" /></a>
}
