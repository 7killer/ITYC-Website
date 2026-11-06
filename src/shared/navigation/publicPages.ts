export type PublicLocale = 'fr' | 'en'
export type PublicAppRoute = 'home' | 'help' | 'dash' | 'polar' | 'autosail' | 'penalties' | 'energy'
export type PublicPage = {
  file: string
  route: PublicAppRoute
  article?: string
  titles: readonly [string, string]
}

export const siteOrigin = 'https://ityc.fr'

/** Public, indexable pages. Embedded views and compatibility aliases are separate. */
export const publicPages: readonly PublicPage[] = [
  { file: 'index', route: 'home', titles: ['Navigation, analyse, précision', 'Sailing, analysis, precision'] },
  { file: 'aide', route: 'help', titles: ['Aide et documentation', 'Help and documentation'] },
  { file: 'pena', route: 'penalties', titles: ['Pénalités', 'Penalties'] },
  { file: 'energy', route: 'energy', titles: ['Énergie', 'Energy'] },
  { file: 'polar', route: 'polar', titles: ['Polaires', 'Polars'] },
  { file: 'autoSail', route: 'autosail', titles: ['Voiles Automatiques', 'Auto Sails'] },
  { file: 'dash', route: 'dash', titles: ['Dashboard', 'Dashboard'] },
  { file: 'aide_pena', route: 'help', article: 'aide_pena', titles: ['Calcul des pénalités', 'Penalty calculations'] },
  { file: 'tuto_pena', route: 'help', article: 'tuto_pena', titles: ['Tutoriel pénalités', 'Penalties tutorial'] },
  { file: 'aide_energy', route: 'help', article: 'aide_energy', titles: ['Calcul de l’énergie', 'Energy calculations'] },
  { file: 'tuto_energy', route: 'help', article: 'tuto_energy', titles: ['Tutoriel énergie', 'Energy tutorial'] },
  { file: 'aide_polaire', route: 'help', article: 'aide_polaire', titles: ['Calcul des polaires', 'Polar calculations'] },
  { file: 'tuto_polaire', route: 'help', article: 'tuto_polaire', titles: ['Tutoriel polaires', 'Polars tutorial'] },
  { file: 'aide_autoSail', route: 'help', article: 'aide_autoSail', titles: ['Calcul des voiles automatiques', 'Auto sails calculations'] },
  { file: 'tuto_autoSail', route: 'help', article: 'tuto_autoSail', titles: ['Tutoriel voiles automatiques', 'Auto sails tutorial'] },
  { file: 'aide_dash', route: 'help', article: 'aide_dash', titles: ['Aide Dashboard', 'Dashboard help'] },
  { file: 'glossaire', route: 'help', article: 'glossaire', titles: ['Glossaire', 'Glossary'] },
]

export const embeddedPageFiles = ['penaDash.html', 'energyDash.html', 'polarDash.html', 'autoSailDash.html'] as const
export const publicPageAliases = [
  { file: 'webstore_dashEn.html', target: 'dash', locale: 'en' as const },
  { file: 'webstore_helpEn.html', target: 'aide_dash', locale: 'en' as const },
]

export function publicPageFile(page: PublicPage, locale: PublicLocale) {
  return `${page.file}${locale === 'en' ? 'En' : ''}.html`
}

export function publicPageUrl(page: PublicPage, locale: PublicLocale) {
  return `${siteOrigin}/${page.file === 'index' && locale === 'fr' ? '' : publicPageFile(page, locale)}`
}

export function readPublicPage(pathname: string): { page: PublicPage; locale: PublicLocale; alias?: boolean } | undefined {
  const filename = pathname.split('/').pop() || 'index.html'
  for (const page of publicPages) {
    if (filename === publicPageFile(page, 'fr')) return { page, locale: 'fr' }
    if (filename === publicPageFile(page, 'en')) return { page, locale: 'en' }
  }
  const alias = publicPageAliases.find(item => item.file === filename)
  const page = alias && publicPages.find(item => item.file === alias.target)
  return page && alias ? { page, locale: alias.locale, alias: true } : undefined
}
