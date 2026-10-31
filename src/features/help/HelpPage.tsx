import { memo, useEffect, useMemo, useState, type CSSProperties } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { SiteFooter } from '../../components/SiteFooter'
import { SiteHeader } from '../../components/SiteHeader'
import { getDocuments, helpHref, helpLink, readHelpRoute, slug, type HelpDocument, type HelpHeading } from './helpDocuments'
import { parseFigureOptions, type FigureMode } from './helpFigureOptions'
import { navigationHref } from '../../shared/navigation/siteLinks'
import { chapterChartHelpAnchor } from '../../shared/navigation/chartHelp'
import '../../styles/help.css'

type Locale = 'fr' | 'en'
type Props = { locale: Locale; onBackHome: () => void; onLocaleChange: (locale: Locale) => void; onThemeChange: (theme: 'dark' | 'light') => void; theme: 'dark' | 'light' }
const assets = new Set(Object.keys(import.meta.glob('/public/assets/help/**/*')).map(path => path.replace('/public', '')))
const searchable = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()

const HeadingText = memo(function HeadingText({ text }: { text: string }) {
  const inlineText = text.replace(/^(\s{0,3}\d+)([.)])(?=\s)/, '$1\\$2')
  return <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]} components={{ p: ({ children }) => <span>{children}</span> }}>{inlineText}</ReactMarkdown>
})

function Capture({ src, alt, theme, width }: { src?: string; alt?: string; theme: Props['theme']; width?: number }) {
  const dark = src?.replace(/\.(png|jpg|jpeg)$/i, '_b.$1')
  const selected = theme === 'dark' && dark && assets.has(decodeURI(dark)) ? dark : src
  return <figure className="help-figure" style={width ? { width: `${width}%` } : undefined}><a href={selected} target="_blank" rel="noreferrer" aria-label={alt}><img src={selected} alt={alt ?? ''} loading="lazy" /></a></figure>
}

const Markdown = memo(function Markdown({ source, theme, locale, headings = [] }: { source: string; theme: Props['theme']; locale: Locale; headings?: HelpHeading[] }) {
  const renderHeading = (level: number, title: string, children: React.ReactNode) => {
    const heading = headings.find(item => item.title === title)
    const content = <>{heading?.alias && <span id={heading.alias} className="help-anchor-alias" />}{children}</>
    return level === 3 ? <h4 id={heading?.id}>{content}</h4> : <h5 id={heading?.id}>{content}</h5>
  }
  const components: Components = {
    p: ({ children, node }) => node?.children.some(child => child.type === 'element' && child.tagName === 'img') ? <div className="help-image-paragraph">{children}</div> : <p>{children}</p>,
    img: ({ src, alt }) => <Capture src={typeof src === 'string' ? src : undefined} alt={alt} theme={theme} />,
    a: ({ href, title, children }) => {
      const destination = title === 'original' ? href : helpLink(href)
      const linkedTool = destination && ['#polaire', '#autosail', '#penalites', '#energie'].includes(destination)
      const finalHref = linkedTool ? navigationHref(destination, locale, theme) : destination
      return <a href={finalHref} {...(destination?.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}</a>
    },
  }
  const render = (markdown: string, key: number, tableStyle?: CSSProperties) => <ReactMarkdown skipHtml key={key} remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]} components={{ ...components,
    table: ({ children }) => <div className="help-table-scroll" tabIndex={0} style={tableStyle}><table>{children}</table></div>,
    h3: ({ children, node }) => renderHeading(3, markdown.split('\n')[(node?.position?.start.line ?? 1) - 1].replace(/^#+\s*/, ''), children),
    h4: ({ children, node }) => renderHeading(4, markdown.split('\n')[(node?.position?.start.line ?? 1) - 1].replace(/^#+\s*/, ''), children),
  }}>{markdown}</ReactMarkdown>
  return <>{source.split(/(^:::(?:figure (?:side|below|rows)[^\n]*|table(?:[ \t][^\n]*)?)\r?\n[\s\S]*?^:::\s*$)/m).map((block, index) => {
    const table = block.match(/^:::table(?:[ \t]+([^\n]*))?\r?\n([\s\S]*?)\r?\n:::\s*$/)
    if (table) {
      const width = Number(table[1]?.match(/(?:^|\s)width=(\d+(?:\.\d+)?)%(?=\s|$)/)?.[1])
      const options = table[1]?.trim().split(/\s+/) ?? []
      return render(table[2], index, {
        ...(width > 0 && width <= 100 ? { width: `${width}%` } : {}),
        ...(options.includes('align=center') ? { marginInline: 'auto' } : options.includes('align=right') ? { marginInlineStart: 'auto' } : {}),
      })
    }
    const figure = block.match(/^:::figure (side|below|rows)([^\n]*)\n([\s\S]*?)\n:::\s*$/)
    if (!figure) return render(block, index)
    const mode = figure[1] as FigureMode
    const images: Array<{ src: string; alt: string }> = []
    let remainder = figure[3]
    const imagePattern = mode === 'rows'
      ? /^!\[([^\]]*)\]\(([^\n]+)\)[ \t]*(?:\r?\n|$)\s*/
      : /^!\[([^\]]*)\]\(([^\n]+)\)\s*\n?/
    do {
      const image = remainder.match(imagePattern)
      if (!image) break
      images.push({ src: image[2], alt: image[1] })
      remainder = remainder.slice(image[0].length)
    } while (mode === 'rows')
    if (!images.length && mode !== 'rows') return render(figure[3], index)
    const parts = mode === 'rows' && !remainder.trim() ? [] : remainder.split(/\n---\n/)
    if (!images.length && !parts.length) return null
    const gallery = images.length > 1
    const options = parseFigureOptions(figure[2], mode, parts.length)
    const classes = ['help-illustrated', mode, options.preset, `image-${options.image}`,
      gallery && 'has-gallery',
      mode === 'side' && options.width && 'custom-width', options.blocks && 'custom-blocks',
      mode === 'side' && !options.preset && !options.blocks && parts.length > 1 && 'aligned',
    ].filter(Boolean).join(' ')
    const style = {
      ...(options.width && mode !== 'below' ? { '--help-image-width': `${options.width}%` } : {}),
      ...(options.blocks && mode === 'side' ? { '--help-block-rows': options.blocks.map(value => `minmax(0, ${value}fr)`).join(' ') } : {}),
      ...(mode === 'rows' && parts.length ? { '--help-block-columns': (options.blocks ?? parts.map(() => 1)).map(value => `minmax(0, ${value}fr)`).join(' ') } : {}),
      ...(gallery ? { '--help-image-columns': `repeat(${images.length}, minmax(0, 1fr))` } : {}),
    } as CSSProperties

    return <div className={classes} data-image-position={options.image} style={style} key={index}>
      {gallery ? <div className="help-image-row">{images.map((image, imageIndex) => <Capture src={image.src} alt={image.alt} theme={theme} key={imageIndex} />)}</div>
        : images.length > 0 && <Capture src={images[0].src} alt={images[0].alt} theme={theme} width={mode === 'below' ? options.width : undefined} />}
      {parts.length > 0 && <div className="help-figure-explanation">{parts.map((part, partIndex) => <div className="help-explanation-part" key={partIndex}>{render(part, partIndex)}</div>)}</div>}
    </div>
  })}</>
})

export function HelpPage({ locale, onBackHome, onLocaleChange, onThemeChange, theme }: Props) {
  const documents = useMemo(() => getDocuments(locale), [locale])
  const [route, setRoute] = useState(readHelpRoute)
  const [query, setQuery] = useState('')
  const [activeSection, setActiveSection] = useState('')
  const fr = locale === 'fr'
  const document = documents.find(item => item.id === route.article)
  const normalizedQuery = searchable(query.trim())
  const matches = useMemo(() => documents.filter(item => searchable(`${item.title} ${item.source}`).includes(normalizedQuery)), [documents, normalizedQuery])

  useEffect(() => {
    const onHashChange = () => { setRoute(readHelpRoute()); setQuery('') }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    if (!document || normalizedQuery) return
    let cancelled = false
    const position = async () => {
      setActiveSection(route.section ?? '')
      if (!route.section) { window.scrollTo({ top: 0 }); return }
      const target = window.document.getElementById(route.section) ?? window.document.getElementById(slug(route.section))
      if (!target) return
      if (target.classList.contains('help-chart-anchor')) setActiveSection(target.closest('.help-content-section')?.id ?? route.section)
      // Decode preceding captures so a deep link remains aligned after images load.
      const preceding = Array.from(window.document.querySelectorAll<HTMLImageElement>('.help-article img')).filter(image => Boolean(image.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING))
      preceding.forEach(image => { image.loading = 'eager' })
      await Promise.allSettled([window.document.fonts.ready, ...preceding.map(image => image.decode())])
      if (!cancelled) {
        const currentTarget = window.document.getElementById(route.section) ?? window.document.getElementById(slug(route.section))
        currentTarget?.scrollIntoView({ block: 'start', behavior: 'instant' })
      }
    }
    void position()
    return () => { cancelled = true }
  }, [document, route.section, normalizedQuery, theme])

  useEffect(() => {
    if (!document || normalizedQuery) return
    const headings = Array.from(window.document.querySelectorAll<HTMLElement>('.help-content-section, .help-content-section h4[id], .help-content-section h5[id]'))
    let frame: number | undefined
    const updateActiveSection = () => {
      frame = undefined
      const readingLine = Math.max(80, window.innerHeight * .1)
      let current = headings[0]
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > readingLine + 1) break
        current = heading
      }
      // A short final chapter may never reach the reading line above the footer.
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= window.document.documentElement.scrollHeight - 1) {
        current = headings[headings.length - 1]
      }
      if (current) setActiveSection(current.id)
    }
    const scheduleUpdate = () => {
      if (frame === undefined) frame = window.requestAnimationFrame(updateActiveSection)
    }
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    const observer = new ResizeObserver(scheduleUpdate)
    const article = window.document.querySelector('.help-article')
    if (article) observer.observe(article)
    scheduleUpdate()
    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      observer.disconnect()
      if (frame !== undefined) window.cancelAnimationFrame(frame)
    }
  }, [document, normalizedQuery])

  const navigation = <HelpNavigation documents={documents} selected={document?.id} activeSection={activeSection} locale={locale} />
  return <div className="tool-page help-page">
    <SiteHeader active="help" locale={locale} onLocaleChange={onLocaleChange} onThemeChange={onThemeChange} theme={theme} />
    <header className="help-heading"><div><p className="eyebrow">ITYC · Documentation</p><h1>{fr ? 'Aide' : 'Help'}</h1><p>{fr ? 'Tutoriels, calculs et fonctionnement des outils ITYC.' : 'Tutorials, calculations and how to use ITYC tools.'}</p></div>
      <label className="help-search"><span aria-hidden="true">⌕</span><input aria-label={fr ? 'Rechercher dans l’aide' : 'Search the documentation'} onChange={event => setQuery(event.target.value)} placeholder={fr ? 'Rechercher dans l’aide…' : 'Search the documentation…'} type="search" value={query} />{query && <button type="button" onClick={() => setQuery('')} aria-label={fr ? 'Effacer la recherche' : 'Clear search'}>×</button>}</label>
    </header>
    <main className={`help-layout${!document || normalizedQuery ? ' help-layout-index' : ''}`}>
      <aside className="help-sidebar" aria-label={fr ? 'Chapitres de l’aide' : 'Help chapters'}><div className="help-mobile-nav"><details key={route.article}><summary>{document?.group ?? (fr ? 'Parcourir l’aide' : 'Browse help')}</summary>{navigation}</details></div><div className="help-desktop-nav">{navigation}</div></aside>
      <article className="help-article">
        <nav className="help-breadcrumb" aria-label={fr ? 'Fil d’Ariane' : 'Breadcrumb'}><button onClick={onBackHome} type="button">ITYC</button><span>/</span><a href="#aide">{fr ? 'Aide' : 'Help'}</a>{document && !normalizedQuery && <><span>/</span><span>{document.group}</span></>}</nav>
        {normalizedQuery ? <><h2>{fr ? 'Résultats de recherche' : 'Search results'}</h2><p className="help-article-summary" role="status">{matches.length} {fr ? 'document(s)' : 'document(s)'}</p><div className="help-results">{matches.map(item => {
          const section = item.sections.find(part => searchable(`${part.title} ${part.content}`).includes(normalizedQuery))
          return <a className="help-result" href={helpHref(item.id, section?.id)} key={item.id} onClick={() => setQuery('')}><span>{item.group}</span><h3>{item.title}</h3>{section && <p>{section.title}</p>}</a>
        })}</div>{!matches.length && <p className="help-empty">{fr ? 'Aucun document ne correspond à cette recherche.' : 'No documents match your search.'}</p>}</> : document ? <>
          <p className="help-article-kicker">{document.group}</p><h2>{document.title}</h2>
          <details className="help-inline-toc"><summary>{fr ? 'Dans cet article' : 'On this page'}</summary><TableOfContents document={document} activeSection={activeSection} /></details>
          {document.intro && <div className="help-article-intro"><Markdown source={document.intro} theme={theme} locale={locale} /></div>}
          {document.sections.map((section, index) => <section className="help-content-section" id={section.id} key={section.id}>{section.alias && <span id={section.alias} className="help-anchor-alias" />}{chapterChartHelpAnchor(document.id, index) && <span id={chapterChartHelpAnchor(document.id, index)} className="help-anchor-alias help-chart-anchor" />}<h3><a className="help-heading-link" href={helpHref(document.id, section.id)}><HeadingText text={section.title} /></a></h3><Markdown source={section.content} theme={theme} locale={locale} headings={section.headings} /></section>)}
          <footer className="help-article-footer">{document.original && <a href={`https://ityc.fr/${document.id}${fr ? '' : 'En'}.html`} target="_blank" rel="noreferrer">{fr ? 'Consulter la page d’origine' : 'View the original page'} ↗</a>}<a href={navigationHref(document.tool, locale, theme)}>{fr ? 'Ouvrir l’outil' : 'Open the tool'} ↗</a></footer>
        </> : <><h2>{fr ? 'Documentation ITYC' : 'ITYC documentation'}</h2><p className="help-article-summary">{fr ? 'Retrouvez les explications des calculs et les tutoriels illustrés de chaque outil.' : 'Find calculation explanations and illustrated tutorials for each tool.'}</p><div className="help-index">{documents.map(item => <a className="help-index-entry" href={helpHref(item.id)} key={item.id}><span>{item.group}</span><h3>{item.title}</h3><p>{item.sections.map(section => section.title.replace(/^\d+\.\s*/, '')).join(' · ')}</p><b aria-hidden="true">→</b></a>)}</div></>}
      </article>
      {document && !normalizedQuery && <aside className="help-toc" aria-label={fr ? 'Dans cet article' : 'On this page'}><h2>{fr ? 'Dans cet article' : 'On this page'}</h2><TableOfContents document={document} activeSection={activeSection} collapseInactive /></aside>}
    </main><SiteFooter locale={locale} />
  </div>
}

function TableOfContents({ document, activeSection, collapseInactive = false }: { document: HelpDocument; activeSection: string; collapseInactive?: boolean }) {
  const activeChapter = document.sections.find(section => section.id === activeSection || section.alias === activeSection || section.headings.some(heading => heading.id === activeSection || heading.alias === activeSection)) ?? document.sections[0]
  const headings = document.toc.filter(section => section.level !== 4 && (!collapseInactive || section.level === 2 || activeChapter?.headings.some(heading => heading.id === section.id)))
  return <nav>{headings.map(section => <a data-level={section.level} aria-current={activeSection === section.id || activeSection === section.alias ? 'location' : undefined} href={helpHref(document.id, section.id)} key={section.id}><HeadingText text={section.title} /></a>)}</nav>
}
function HelpNavigation({ documents, selected, activeSection, locale }: { documents: HelpDocument[]; selected?: string; activeSection: string; locale: Locale }) {
  const activeGroup = documents.find(document => document.id === selected)?.group

  return <nav className="help-chapters">
    <a className="help-index-link" href="#aide" aria-current={!selected ? 'page' : undefined}>{locale === 'fr' ? 'Sommaire de l’aide' : 'Help overview'}</a>
    {[...new Set(documents.map(document => document.group))].map(group => {
      const articles = documents.filter(document => document.group === group)
      const isActive = group === activeGroup

      return <section data-active={isActive} key={group}>
        <h2><a className="help-group-link" href={helpHref(articles[0].id)} aria-current={isActive ? 'true' : undefined}>{group}</a></h2>
        {isActive && articles.map(document => <div className="help-navigation-article" key={document.id}>
          <a aria-current={selected === document.id ? 'page' : undefined} href={helpHref(document.id)}>{document.title}</a>
          {selected === document.id && <nav className="help-subsections" aria-label={locale === 'fr' ? `Sections de ${document.title}` : `Sections in ${document.title}`}>
            {document.sections.map(section => <a aria-current={activeSection === section.id ? 'location' : undefined} href={helpHref(document.id, section.id)} key={section.id}><HeadingText text={section.title} /></a>)}
          </nav>}
        </div>)}
      </section>
    })}
  </nav>
}
