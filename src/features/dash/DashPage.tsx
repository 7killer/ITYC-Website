import { useEffect, useState } from 'react'
import { SiteFooter } from '../../components/SiteFooter'
import { SiteHeader } from '../../components/SiteHeader'
import '../../styles/dash.css'
import { navigationHref } from '../../shared/navigation/siteLinks'

type Locale = 'fr' | 'en'
type Props = {
  locale: Locale
  onBackHome: () => void
  onLocaleChange: (locale: Locale) => void
  onThemeChange: (theme: 'dark' | 'light') => void
  theme: 'dark' | 'light'
}

type Feature = {
  image: string
  imageDark?: string
  text: Record<Locale, { description: string[]; intro: string; title: string }>
}

const storeUrl = 'https://chrome.google.com/webstore/detail/vr-dashboard-ityc/mhgineegmgpjljjpmocmnlaonmegjkdg'

const features: readonly Feature[] = [
  {
    image: '/assets/img/dash/vr_slider.png', imageDark: '/assets/img/dash/vr_slider_b.png',
    text: {
      fr: { title: 'Intégration à la page du jeu', intro: 'Toutes les informations nécessaires à une prise de décision rapide, en un coup d’œil.', description: ['Grâce à son intégration à la page du jeu, la dashboard réunit les informations nécessaires au suivi précis de votre bateau.', 'TWS, TWA, cap, voile, Best VMG, Best Speed, position précise, énergie et pénalités.'] },
      en: { title: 'Game page integration', intro: 'Everything needed for quick decisions, at a glance.', description: ['The dashboard is integrated into the game page, bringing together the information needed to monitor your boat precisely.', 'TWS, TWA, heading, sail, Best VMG, Best Speed, precise position, stamina and penalties.'] },
    },
  },
  {
    image: '/assets/img/dash/cotes_detail.png',
    text: {
      fr: { title: 'Traits de côtes', intro: 'Frôlez les côtes comme les pros, en limitant les risques d’échouage.', description: ['Affichez les traits de côtes sur la zone souhaitée de la carte et visualisez vos waypoints pour optimiser vos trajectoires.'] },
      en: { title: 'Coastlines', intro: 'Sail close to the coast while reducing the risk of grounding.', description: ['Display coastlines over the chosen area of the map and view your waypoints to optimise your route.'] },
    },
  },
  {
    image: '/assets/img/dash/draw_route_marker.png', imageDark: '/assets/img/dash/draw_route_marker_b.png',
    text: {
      fr: { title: 'Import de routage', intro: 'Comparez facilement les routages issus de différents routeurs.', description: ['Importez en quelques clics vos routages créés avec Zezo, Avalon, VRZEN, QtVlm ou Weather4VR.', 'Les formats CSV (Avalon, VRZEN) et GPX sont pris en charge.'] },
      en: { title: 'Route import', intro: 'Easily compare routes from different routing tools.', description: ['Import routes created with Zezo, Avalon, VRZEN, QtVlm or Weather4VR in just a few clicks.', 'CSV (Avalon, VRZEN) and GPX formats are supported.'] },
    },
  },
  {
    image: '/assets/img/dash/fleet_full.png', imageDark: '/assets/img/dash/fleet_full_b.png',
    text: {
      fr: { title: 'Onglet flotte étendu', intro: 'Toutes les informations de la flotte, en un coup d’œil.', description: ['Retrouvez les informations des bateaux de la flotte dans une mise en page conçue pour une lecture rapide.', 'Les équipes et options des joueurs sont centralisées, les colonnes sont personnalisables.'] },
      en: { title: 'Extended fleet tab', intro: 'All fleet information, at a glance.', description: ['Find fleet information in a layout designed for quick reading.', 'Teams and player options are centralised, with customisable columns.'] },
    },
  },
  {
    image: '/assets/img/dash/graph.png', imageDark: '/assets/img/dash/graph_b.png',
    text: {
      fr: { title: 'Graphiques', intro: 'Visualisez facilement les variations des paramètres essentiels.', description: ['TWS, TWD, TWA, cap, vitesse du bateau et énergie sont disponibles sous forme de graphiques pour une analyse plus rapide.', 'Les courbes suivent la couleur des voiles et les données sont exportables au format CSV.'] },
      en: { title: 'Charts', intro: 'Visualise changes in essential data with ease.', description: ['TWS, TWD, TWA, heading, boat speed and stamina are available as charts for faster analysis.', 'Lines use sail colours and data can be exported as CSV.'] },
    },
  },
  {
    image: '/assets/img/dash/infosityc.png', imageDark: '/assets/img/dash/infosityc_b.png',
    text: {
      fr: { title: 'Informations ITYC intégrées', intro: 'Les informations ITYC directement dans votre tableau de bord.', description: ['Retrouvez les angles et vitesses de Best VMG et Best Speed calculés à partir de vos paramètres de navigation, ainsi que le coefficient de recouvrement.', 'Pour chaque pénalité : temps, distance perdue, énergie perdue et temps de récupération, avec un accès direct aux voiles automatiques préremplies.'] },
      en: { title: 'Built-in ITYC information', intro: 'ITYC information, directly in your dashboard.', description: ['Get Best VMG and Best Speed angles and speeds calculated from your sailing settings, as well as the overlap coefficient.', 'For every penalty: time, distance lost, stamina lost and recovery time, with direct access to pre-filled Auto Sails.'] },
    },
  },
] as const

const contributors: Record<Locale, readonly string[]> = {
  fr: [
    'Big Bird (Cvetan Ivanov), Hardtack (Michael Kappert).',
    'Xeelee (Patrick Guelat), Patg, GeGaX (Romain Le Lamer), toxcct (Nicolas Guittet), mcmgj (Guy Juy).',
    'Amoutiers, Xpillons, Valgit.',
    'Helios (Michel), David05320 (David), SailSmurf (Franck), Kurun56 (JY).',
    'Tous les contributeurs inconnus !',
    'Votre serviteur !',
    'Tous mes joueurs amis proches qui ont dû supporter toutes les versions intermédiaires.',
    'Ma team et ma famille pour leur patience !',
    'Et un certain StAnDo (Dom) sans qui rien de tout n’existerait !',
  ],
  en: [
    'Big Bird (Cvetan Ivanov), Hardtack (Michael Kappert).',
    'Xeelee (Patrick Guelat), Patg, GeGaX (Romain Le Lamer), toxcct (Nicolas Guittet), mcmgj (Guy Juy).',
    'Amoutiers, Xpillons, Valgit.',
    'Helios (Michel), David05320 (David), SailSmurf (Franck), Kurun56 (JY).',
    'All unknown contributors!',
    'Your humble servant!',
    'All my close gamer friends who supported every intermediate version.',
    'My team and my family for their patience!',
    'And StAnDo (Dom), without whom none of this would exist!',
  ],
}

export function DashPage({ locale, onBackHome, onLocaleChange, onThemeChange, theme }: Props) {
  const [selectedFeature, setSelectedFeature] = useState(0)
  const feature = features[selectedFeature]
  const copy = feature.text[locale]
  const isFrench = locale === 'fr'

  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return <div className="tool-page dash-page">
    <SiteHeader active="dash" locale={locale} onLocaleChange={onLocaleChange} onThemeChange={onThemeChange} theme={theme} />
    <div className="page-heading">
      <h1>{isFrench ? 'Dashboard' : 'Dashboard'}</h1>
      <p><button onClick={onBackHome} type="button">ITYC</button><span>/</span><span>{isFrench ? 'Dashboard' : 'Dashboard'}</span></p>
    </div>

    <main className="dash-workspace">
      <div className="dash-overview-grid">
      <section className="dash-intro" aria-labelledby="dash-overview">
        <p className="eyebrow">VR Dashboard · ITYC</p>
        <h2 id="dash-overview">{isFrench ? 'Naviguez avec toutes les données essentielles.' : 'Sail with every essential data point at hand.'}</h2>
        <div className="dash-intro-copy">
          <p>{isFrench ? <>Grâce à une poignée de joueurs passionnés, l’idée de la dashboard a été mise au point et l’original est disponible sur le Chrome Web Store <a href="https://chrome.google.com/webstore/detail/vr-dashboard/amknkhejaogpekncjekiaolgldbejjan/" rel="noreferrer" target="_blank">ici</a>. Naturellement, les contributeurs originaux sont vivement remerciés.</> : <>Thanks to a handful of passionate players, the dashboard concept was developed and the original is available on the Chrome Web Store <a href="https://chrome.google.com/webstore/detail/vr-dashboard/amknkhejaogpekncjekiaolgldbejjan/" rel="noreferrer" target="_blank">here</a>. The original contributors are warmly thanked.</>}</p>
          <p>{isFrench ? 'Basée sur leur excellent travail, I.T.Y.C. vous propose aujourd’hui une version plus évoluée. Vous la trouverez sur le Chrome Web Store ou pourrez la télécharger et l’installer manuellement.' : 'Based on their excellent work, I.T.Y.C. now offers a more advanced version. You can find it on the Chrome Web Store or download and install it manually.'}</p>
          <p>{isFrench ? 'En installant l’extension depuis le store, vous bénéficierez automatiquement des mises à jour.' : 'By installing the extension from the store, you will receive updates automatically.'}</p>
        </div>
        <div className="dash-actions">
          <a className="button button-primary" href={`${storeUrl}?hl=${locale}`} rel="noreferrer" target="_blank">{isFrench ? 'Installer depuis le Chrome Web Store' : 'Install from the Chrome Web Store'} <span aria-hidden="true">↓</span></a>
          <a className="button button-secondary" href="https://ityc.fr/ITYC_Dash.zip">{isFrench ? 'Télécharger (installation manuelle)' : 'Download (manual installation)'} <span aria-hidden="true">↓</span></a>
          <a className="button button-secondary" href="#dash-features">{isFrench ? 'Découvrir les fonctionnalités' : 'Explore features'}</a>
        </div>
      </section>

      <section className="dash-community" aria-labelledby="dash-community-title">
        <div><p className="eyebrow">{isFrench ? 'Communauté' : 'Community'}</p><h2 id="dash-community-title">{isFrench ? 'Remerciements' : 'Acknowledgements'}</h2><p>{isFrench ? 'La dashboard existe grâce aux contributions de passionnés de Virtual Regatta.' : 'The dashboard exists thanks to contributions from Virtual Regatta enthusiasts.'}</p></div>
        <ul>{contributors[locale].map((contributor) => <li key={contributor}>{contributor}</li>)}</ul>
      </section>
      </div>

      <section className="dash-help" aria-labelledby="dash-help-title"><p className="eyebrow">{isFrench ? 'Besoin d’aide ?' : 'Need help?'}</p><h2 id="dash-help-title">{isFrench ? 'Installation et documentation' : 'Installation and documentation'}</h2><p>{isFrench ? 'Consultez le manuel d’installation et l’aide complète de la dashboard.' : 'Read the installation guide and full dashboard help.'}</p><div className="dash-actions"><a className="button button-secondary" href={`${navigationHref('#aide', locale, theme)}?article=aide_dash`}>{isFrench ? 'Consulter l’aide' : 'View help'}</a><a className="button button-secondary" href="https://github.com/7killer/ITYC-Dashboard" rel="noreferrer" target="_blank">{isFrench ? 'Voir le code source' : 'View source code'} <span aria-hidden="true">↗</span></a></div></section>

      <section className="dash-features" id="dash-features" aria-labelledby="dash-features-title">
        <div className="dash-section-heading"><h2 id="dash-features-title">{isFrench ? 'Fonctionnalités' : 'Features'}</h2></div>
        <div className="dash-feature-layout">
          <div className="dash-feature-tabs" role="tablist" aria-label={isFrench ? 'Fonctionnalités de la dashboard' : 'Dashboard features'}>
            {features.map((item, index) => <button aria-controls={`dash-panel-${index}`} aria-selected={selectedFeature === index} className={selectedFeature === index ? 'is-active' : undefined} id={`dash-tab-${index}`} key={item.image} onClick={() => setSelectedFeature(index)} role="tab" type="button">{item.text[locale].title}</button>)}
          </div>
          <article aria-labelledby={`dash-tab-${selectedFeature}`} className="dash-feature-panel" id={`dash-panel-${selectedFeature}`} role="tabpanel">
            <div className="dash-feature-copy"><h3>{copy.title}</h3><p className="dash-feature-intro">{copy.intro}</p>{copy.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            <img alt={copy.title} className="dash-feature-image" src={theme === 'dark' && feature.imageDark ? feature.imageDark : feature.image} />
          </article>
        </div>
      </section>

    </main>
    <SiteFooter locale={locale} />
  </div>
}
