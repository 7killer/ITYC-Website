import { useEffect, useState } from 'react'
import { TOOL_STATE_EVENT } from '../shared/navigation/toolUrls'
import { navigationHref } from '../shared/navigation/siteLinks'

type Locale = 'fr' | 'en'

type SiteHeaderProps = {
  active?: string
  embedded?: boolean
  locale: Locale
  onLocaleChange: (locale: Locale) => void
  onThemeChange: (theme: 'dark' | 'light') => void
  theme: 'dark' | 'light'
}

type PrimaryNavigationItem = {
  dropdown?: boolean
  en: string
  fr: string
  href: string
  key?: string
}

const primaryNavigation: readonly PrimaryNavigationItem[] = [
  { fr: 'Accueil', en: 'Home', href: '#accueil', key: 'home' },
  { fr: 'Pénalités', en: 'Penalties', href: '#penalites' },
  { fr: 'Énergie', en: 'Energy', href: '#energie' },
  { fr: 'Polaires', en: 'Polars', href: '#polaire', key: 'polaire' },
  { fr: 'Voiles Auto', en: 'Auto Sails', href: '#autosail', key: 'autosail' },
  { fr: 'Dash', en: 'Dash', href: '#dash', key: 'dash' },
  { fr: 'Aide', en: 'Help', href: '#aide', key: 'help' },
] as const

export function SiteHeader({ active, embedded = false, locale, onLocaleChange, onThemeChange, theme }: SiteHeaderProps) {
  const [, refreshLinks] = useState(0)
  useEffect(() => {
    const refresh = () => refreshLinks(value => value + 1)
    window.addEventListener(TOOL_STATE_EVENT, refresh)
    return () => window.removeEventListener(TOOL_STATE_EVENT, refresh)
  }, [])
  const navigation = embedded
    ? primaryNavigation.filter(item => ['#penalites', '#energie', '#polaire', '#autosail'].includes(item.href))
    : primaryNavigation

  return (
    <header className={`site-header${embedded ? ' embedded-site-header' : ''}`}>
      <div className="site-header-inner">
        <div className="header-leading">
          {embedded ? <span className="brand">ITYC</span> : <a className="brand" href={navigationHref('#accueil', locale, theme)} aria-label={locale === 'fr' ? 'ITYC, accueil' : 'ITYC, home'}>ITYC</a>}
          {!embedded && <div className="language-switcher" aria-label={locale === 'fr' ? 'Langue' : 'Language'}>
            <button aria-label="Français" aria-pressed={locale === 'fr'} onClick={() => onLocaleChange('fr')} type="button"><span aria-hidden="true">🇫🇷</span></button>
            <button aria-label="English" aria-pressed={locale === 'en'} onClick={() => onLocaleChange('en')} type="button"><span aria-hidden="true">🇬🇧</span></button>
          </div>}
        </div>

        <nav aria-label={locale === 'fr' ? 'Navigation principale' : 'Main navigation'}>
          <ul className="main-navigation">
            {navigation.map((item) => (
              <li key={item.href}>
                <a className={active === item.key || (active === 'penalites' && item.href === '#penalites') || (active === 'energie' && item.href === '#energie') ? 'active' : undefined} href={navigationHref(item.href, locale, theme)}>
                  {item[locale]}{item.dropdown && <span aria-hidden="true">⌄</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {!embedded && <div className="header-trailing">
          <label className="theme-switch" htmlFor="theme-toggle">
            <input checked={theme === 'dark'} id="theme-toggle" onChange={(event) => onThemeChange(event.target.checked ? 'dark' : 'light')} type="checkbox" />
            <span aria-hidden="true" />
            <b>{theme === 'dark' ? 'Light' : 'Dark'}</b>
          </label>

          <a className="support-link" href="https://fr.tipeee.com/itycfr">{locale === 'fr' ? 'Soutenez ITYC.FR' : 'Support ITYC.FR'}</a>
        </div>}
      </div>
    </header>
  )
}
