import { SiteHeader } from '../../components/SiteHeader'
import { SiteFooter } from '../../components/SiteFooter'
import { navigationHref } from '../../shared/navigation/siteLinks'

type Locale = 'fr' | 'en'
type Props = {
  locale: Locale
  onLocaleChange: (locale: Locale) => void
  onThemeChange: (theme: 'dark' | 'light') => void
  theme: 'dark' | 'light'
}

const copy = {
  fr: {
    welcome: 'Bienvenue à l’Inter Team Yacht Club',
    objective: 'Notre objectif :',
    mission: 'Vous fournir des informations de qualité pour vous aider à devenir un meilleur virtual skipper !',
    sectionsLabel: 'Les outils ITYC',
    visit: 'Première visite ?',
    visitQuestions: ['Comment fonctionne ITYC.fr ?', 'Quels outils propose ITYC.fr ?', 'Besoin d’explications ?'],
    visitLink: 'Consultez notre page d’aide et de tutoriels.',
    dashboard: 'Envie de connaître les informations réelles de votre bateau et votre position par rapport à la côte ?',
    dashboardQuestions: ['Essayez notre dashboard !', 'Évitez tous les pièges !'],
    dashboardLink: 'Retrouvez les téléchargements sur notre page dédiée à la dashboard.',
    penalties: 'Calculez facilement les pénalités dues aux manœuvres !',
    penaltyQuestions: [
      'Combien de temps de pénalité sera appliqué si vous changez de voile ?',
      'Quelle distance allez-vous perdre dans une manœuvre ?',
      'Vous souhaitez savoir si cette manœuvre sera rentable ?',
      'Une manœuvre non voulue : combien avez-vous perdu ?',
    ],
    penaltiesLink: 'Consultez notre page sur les pénalités.',
    autoSails: 'Évitez les changements de voile intempestifs !',
    autoSailsQuestions: ['Quand votre voile va-t-elle changer avec le système de gestion automatique des voiles ?', 'Tirez avantage du coefficient de changement de voile !'],
    autoSailsLink: 'Consultez notre page d’analyse des changements de voile automatiques.',
    energy: 'Calculez rapidement les pertes d’énergie après une manœuvre !',
    energyQuestions: ['Découvrez en un clic combien de temps il vous faudra pour retrouver un skipper en pleine forme.'],
    energyLink: 'Consultez notre page sur la stamina (énergie).',
    polars: 'Analysez rapidement les polaires des bateaux !',
    polarQuestions: ['Détectez facilement les « trous » dans les polaires !', 'Trouvez rapidement les angles au vent les plus avantageux !'],
    polarsLink: 'Consultez notre page d’analyse des polaires.',
    tutorial: 'Besoin d’aide sur cette page ? Le tutoriel est',
    here: 'ici',
    labels: ['Aide', 'Dashboard', 'Pénalités', 'Voiles automatiques', 'Énergie', 'Polaires'],
  },
  en: {
    welcome: 'Welcome to the Inter Team Yacht Club',
    objective: 'Our objective:',
    mission: 'To provide quality information that helps you become a better virtual skipper!',
    sectionsLabel: 'ITYC tools',
    visit: 'First visit?',
    visitQuestions: ['How does ITYC.fr work?', 'What tools does ITYC.fr offer?', 'Need an explanation?'],
    visitLink: 'Read our help pages and tutorials.',
    dashboard: 'Want real information about your boat and its position relative to the coast?',
    dashboardQuestions: ['Try our dashboard!', 'Avoid the pitfalls!'],
    dashboardLink: 'Find the downloads on our dashboard page.',
    penalties: 'Easily calculate the penalties caused by manoeuvres!',
    penaltyQuestions: [
      'How much penalty time will a sail change incur?',
      'How much distance will you lose during a manoeuvre?',
      'Want to know whether the manoeuvre will pay off?',
      'An unwanted manoeuvre: how much have you lost?',
    ],
    penaltiesLink: 'Visit our penalties page.',
    autoSails: 'Avoid unwanted sail changes!',
    autoSailsQuestions: ['When will your sail change under the automatic sail management system?', 'Make use of the sail change coefficient!'],
    autoSailsLink: 'Visit our automatic sail change analysis page.',
    energy: 'Quickly calculate the energy lost after a manoeuvre!',
    energyQuestions: ['Find out in one click how long it will take to get your skipper back to full fitness.'],
    energyLink: 'Visit our stamina (energy) page.',
    polars: 'Quickly analyse boat polars!',
    polarQuestions: ['Easily spot gaps in the polars!', 'Quickly find the most advantageous wind angles!'],
    polarsLink: 'Visit our polar analysis page.',
    tutorial: 'Need help with this page? The tutorial is',
    here: 'here',
    labels: ['Help', 'Dashboard', 'Penalties', 'Automatic sails', 'Energy', 'Polars'],
  },
}

export function HomePage({ locale, onLocaleChange, onThemeChange, theme }: Props) {
  const text = copy[locale]
  const href = (destination: string) => navigationHref(destination, locale, theme)
  const help = (article: string) => `${href('#aide').split('#')[0]}#aide?${new URLSearchParams({ article })}`
  const sections = [
    { title: text.visit, paragraphs: text.visitQuestions, destination: '#aide', link: text.visitLink },
    { title: text.dashboard, paragraphs: text.dashboardQuestions, destination: '#dash', link: text.dashboardLink, tutorial: 'aide_dash' },
    { title: text.penalties, paragraphs: text.penaltyQuestions, destination: '#penalites', link: text.penaltiesLink, tutorial: 'tuto_pena' },
    { title: text.autoSails, paragraphs: text.autoSailsQuestions, destination: '#autosail', link: text.autoSailsLink, tutorial: 'tuto_autoSail' },
    { title: text.energy, paragraphs: text.energyQuestions, destination: '#energie', link: text.energyLink, tutorial: 'tuto_energy' },
    { title: text.polars, paragraphs: text.polarQuestions, destination: '#polaire', link: text.polarsLink, tutorial: 'tuto_polaire' },
  ]

  return <div className="app-shell home-page" id="accueil">
    <SiteHeader active="home" locale={locale} onLocaleChange={onLocaleChange} onThemeChange={onThemeChange} theme={theme} />
    <main className="home-workspace">
      <section className="home-about" aria-labelledby="home-title">
        <h1 id="home-title">{text.welcome}</h1>
        <p><strong>{text.objective}</strong> <em>{text.mission}</em></p>
      </section>
      <section className="home-sections" aria-label={text.sectionsLabel}>
        {sections.map((section, index) => <article className="home-section" key={section.destination}>
          <p className="home-section-label">{text.labels[index]}</p>
          <h2><a href={href(section.destination)}>{section.title}</a></h2>
          {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          <p className="home-section-link"><a href={href(section.destination)}>{section.link}</a></p>
          {section.tutorial && <p className="home-tutorial">{text.tutorial} <a href={help(section.tutorial)}>{text.here}</a>.</p>}
        </article>)}
      </section>
    </main>
    <SiteFooter locale={locale} />
  </div>
}
