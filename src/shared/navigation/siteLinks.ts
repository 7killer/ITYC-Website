import { buildToolHref, type ToolPage } from './toolUrls'

const toolsByHash: Record<string, ToolPage> = {
  '#polaire': 'polar', '#autosail': 'autosail', '#penalites': 'penalties', '#energie': 'energy',
}

/** Use the public HTML entry points while carrying the current tool context. */
export function navigationHref(href: string, locale: 'fr' | 'en', theme: 'dark' | 'light') {
  const tool = toolsByHash[href]
  if (tool) return buildToolHref(tool, locale, theme)
  if (!['#accueil', '#aide', '#dash'].includes(href)) return href

  const context = new URL(buildToolHref('polar', locale, theme), window.location.href).searchParams
  context.set('lang', locale)
  if (context.has('locale')) context.set('locale', locale)
  const query = context.toString()
  return `index.html${query ? `?${query}` : ''}${href}`
}
