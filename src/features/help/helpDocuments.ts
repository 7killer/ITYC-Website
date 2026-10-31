type Locale = 'fr' | 'en'
export type HelpHeading = { id: string; title: string; alias?: string; level?: number }
type HelpSection = HelpHeading & { content: string; headings: HelpHeading[] }
export type HelpDocument = { id: string; title: string; group: string; tool: string; original: boolean; source: string; intro: string; sections: HelpSection[]; toc: HelpHeading[] }
const sources = import.meta.glob('./content/*/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const catalog = [
  { id: 'aide_pena', group: ['Pénalités', 'Penalties'], tool: '#penalites' },
  { id: 'tuto_pena', group: ['Pénalités', 'Penalties'], tool: '#penalites' },
  { id: 'aide_energy', group: ['Énergie', 'Energy'], tool: '#energie' },
  { id: 'tuto_energy', group: ['Énergie', 'Energy'], tool: '#energie' },
  { id: 'tuto_polaire', group: ['Polaires', 'Polars'], tool: '#polaire' },
  { id: 'tuto_autoSail', group: ['Voiles Auto', 'Auto Sails'], tool: '#autosail' },
  { id: 'aide_dash', group: ['Dashboard', 'Dashboard'], tool: '#dash' },
]
export const slug = (title: string) => title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const helpHref = (article: string, section?: string) => `#aide?${new URLSearchParams({ article, ...(section ? { section } : {}) }).toString()}`
export function readHelpRoute() {
  const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  return { article: params.get('article') ?? '', section: params.get('section') ?? undefined }
}
export function helpLink(href?: string) {
  if (!href) return href
  const match = href.match(/^(?:https?:\/\/ityc\.fr\/|\.\/|\/)?(aide(?:_pena|_energy|_dash)?|tuto_(?:pena|energy|polaire|autoSail))(?:En)?\.html(?:#(.*))?$/)
  if (match) return match[1] === 'aide' ? '#aide' : helpHref(match[1], match[2])
  const tools: Record<string, string> = { 'pena.html': '#penalites', 'energy.html': '#energie', 'polar.html': '#polaire', 'autoSail.html': '#autosail', 'dash.html': '#dash', 'index.html': '#accueil' }
  return tools[href.replace('En.html', '.html')] ?? href
}
export function getDocuments(locale: Locale): HelpDocument[] {
  return catalog.flatMap(item => {
    const source = sources[`./content/${locale}/${item.id}.md`]
    if (!source) return []
    const title = source.match(/^# (.+)$/m)?.[1] ?? item.id
    const body = source.replace(/^# .+\n*/, '')
    const headings = [...body.matchAll(/^(?:<!-- anchor:([^>]+?) -->\r?\n)?## (.+)$/gm)]
    const used = new Map<string, number>()
    const sections = headings.map((heading, index) => {
      const base = slug(heading[2]), count = used.get(base) ?? 0
      used.set(base, count + 1)
      const id = count ? `${base}-${count + 1}` : base
      const content = body.slice(heading.index! + heading[0].length, headings[index + 1]?.index).trim()
      const subheadings = [...content.matchAll(/^(?:<!-- anchor:([^>]+?) -->\r?\n)?(#{3,4}) (.+)$/gm)].map((match, subindex) => ({ id: `${id}-${slug(match[3])}-${subindex + 1}`, title: match[3], alias: match[1], level: match[2].length }))
      return { id, alias: heading[1], title: heading[2], content, headings: subheadings, level: 2 }
    })
    return [{ ...item, group: item.group[locale === 'fr' ? 0 : 1], original: item.id !== 'nouvelle-interface', title, source, intro: body.slice(0, headings[0]?.index ?? body.length).trim(), sections, toc: sections.flatMap(section => [section, ...section.headings]) }]
  })
}
