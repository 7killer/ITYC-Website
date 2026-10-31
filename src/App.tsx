import { lazy, Suspense, useEffect, useState } from 'react'
import { HomePage } from './features/home/HomePage'
import { LocaleContext } from './shared/i18n/LocaleContext'
import { PolarPage } from './features/polar/PolarPage'
import { AutoSailPage } from './features/autosail/AutoSailPage'
import { PenaltiesPage } from './features/penalties/PenaltiesPage'
import { EnergyPage } from './features/energy/EnergyPage'
import { DashPage } from './features/dash/DashPage'
import { buildToolHref, isEmbeddedToolPage, isToolPage, readToolRoute, readUrlPreferences, type ToolPage } from './shared/navigation/toolUrls'
import { navigationHref } from './shared/navigation/siteLinks'
const HelpPage = lazy(() => import('./features/help/HelpPage').then(module => ({ default: module.HelpPage })))

type AppRoute = ToolPage | 'home' | 'help' | 'dash'

function routeFromLocation(): AppRoute {
  if (isEmbeddedToolPage()) return readToolRoute()?.page ?? 'home'
  if (/^#aide(?:\?|$)/.test(window.location.hash)) return 'help'
  if (window.location.hash === '#dash') return 'dash'
  if (window.location.hash === '#accueil') return 'home'
  return readToolRoute()?.page ?? 'home'
}

function storedPreference(key: string) {
  try { return localStorage.getItem(key) } catch { return null }
}

export default function App() {
  const embedded = isEmbeddedToolPage()
  const [route, setRoute] = useState(routeFromLocation)
  const [preferences] = useState(readUrlPreferences)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => preferences.theme ?? (storedPreference('theme') === 'light' ? 'light' : 'dark'))
  const [locale, setLocale] = useState<'fr' | 'en'>(() => preferences.locale ?? (storedPreference('locale') === 'en' ? 'en' : 'fr'))

  const updatePreferenceAddress = (nextLocale: 'fr' | 'en', nextTheme: 'dark' | 'light') => {
    if (isToolPage(route)) {
      window.history.replaceState(window.history.state, '', buildToolHref(route, nextLocale, nextTheme))
      return
    }
    const address = new URL(window.location.href)
    address.searchParams.set('lang', nextLocale)
    if (address.searchParams.has('locale')) address.searchParams.set('locale', nextLocale)
    address.searchParams.set('th', nextTheme)
    window.history.replaceState(window.history.state, '', address.href)
  }
  const changeLocale = (next: 'fr' | 'en') => {
    updatePreferenceAddress(next, theme)
    setLocale(next)
  }
  const changeTheme = (next: 'dark' | 'light') => {
    updatePreferenceAddress(locale, next)
    setTheme(next)
  }
  const backHome = () => { window.location.assign(navigationHref('#accueil', locale, theme)) }

  useEffect(() => {
    const onHashChange = () => setRoute(routeFromLocation())
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('popstate', onHashChange)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('popstate', onHashChange)
    }
  }, [])

  useEffect(() => {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [route])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    if (embedded) return
    try { localStorage.setItem('theme', theme) } catch { /* Preferences remain usable without storage. */ }
  }, [embedded, theme])

  useEffect(() => {
    document.documentElement.lang = locale
    if (embedded) return
    try { localStorage.setItem('locale', locale) } catch { /* Preferences remain usable without storage. */ }
  }, [embedded, locale])

  function renderPage() {
  if (route === 'polar') {
    return <PolarPage embedded={embedded} locale={locale} onBackHome={backHome} onLocaleChange={changeLocale} onThemeChange={changeTheme} theme={theme} />
  }

  if (route === 'autosail') {
    return <AutoSailPage embedded={embedded} locale={locale} onBackHome={backHome} onLocaleChange={changeLocale} onThemeChange={changeTheme} theme={theme} />
  }

  if (route === 'penalties') {
    return <PenaltiesPage embedded={embedded} locale={locale} onBackHome={backHome} onLocaleChange={changeLocale} onThemeChange={changeTheme} theme={theme} />
  }

  if (route === 'energy') {
    return <EnergyPage embedded={embedded} locale={locale} onBackHome={backHome} onLocaleChange={changeLocale} onThemeChange={changeTheme} theme={theme} />
  }

  if (route === 'dash') {
    return <DashPage locale={locale} onBackHome={backHome} onLocaleChange={changeLocale} onThemeChange={changeTheme} theme={theme} />
  }

  if (route === 'help') {
    return <Suspense fallback={<main role="status">{locale === 'fr' ? 'Chargement de l’aide…' : 'Loading documentation…'}</main>}><HelpPage locale={locale} onBackHome={backHome} onLocaleChange={changeLocale} onThemeChange={changeTheme} theme={theme} /></Suspense>
  }

  return <HomePage locale={locale} onLocaleChange={changeLocale} onThemeChange={changeTheme} theme={theme} />
  }

  return <LocaleContext.Provider value={locale}>{renderPage()}</LocaleContext.Provider>
}
