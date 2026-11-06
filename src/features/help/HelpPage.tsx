import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { SiteFooter } from '../../components/SiteFooter'
import { SiteHeader } from '../../components/SiteHeader'
import { getDocuments, helpHref, helpLink, readHelpRoute, slug, type HelpDocument, type HelpHeading } from './helpDocuments'
import { parseFigureOptions, type FigureMode } from './helpFigureOptions'
import { createHelpSearchIndex, normalizeSearchText, searchHelp } from './helpSearch'
import { navigationHref } from '../../shared/navigation/siteLinks'
import { chapterChartHelpAnchor } from '../../shared/navigation/chartHelp'
import '../../styles/help.css'

type Locale = 'fr' | 'en'
type Props = { locale: Locale; onBackHome: () => void; onLocaleChange: (locale: Locale) => void; onThemeChange: (theme: 'dark' | 'light') => void; theme: 'dark' | 'light' }
const assets = new Set(Object.keys(import.meta.glob('/public/assets/help/**/*')).map(path => path.replace('/public', '')))
const sectionHref = (document: HelpDocument, section: HelpHeading) => helpHref(document.id, document.id === 'glossaire' ? section.alias ?? section.id : section.id)

function inlineIconSize(title?: string): string | undefined {
  if (title === 'icon') return '1em'
  const value = title?.match(/^icon:(\d+(?:\.\d+)?|\.\d+)em$/)?.[1]
  const size = Number(value)
  return Number.isFinite(size) && size > 0 ? `${size}em` : undefined
}

function helpImageSource(src: string | undefined, theme: Props['theme']) {
  const dark = src?.replace(/\.(png|jpg|jpeg)$/i, '_b.$1')
  return theme === 'dark' && dark && assets.has(decodeURI(dark)) ? dark : src
}

const HeadingText = memo(function HeadingText({ text }: { text: string }) {
  const inlineText = text.replace(/^(\s{0,3}\d+)([.)])(?=\s)/, '$1\\$2')
  return <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]} components={{ p: ({ children }) => <span>{children}</span> }}>{inlineText}</ReactMarkdown>
})

function Capture({ src, alt, theme, width }: { src?: string; alt?: string; theme: Props['theme']; width?: number }) {
  const selected = helpImageSource(src, theme)
  return <figure className="help-figure" style={width ? { width: `${width}%` } : undefined}><a href={selected} target="_blank" rel="noreferrer" aria-label={alt}><img src={selected} alt={alt ?? ''} loading="lazy" /></a></figure>
}

const Markdown = memo(function Markdown({ source, theme, locale, headings = [] }: { source: string; theme: Props['theme']; locale: Locale; headings?: HelpHeading[] }) {
  const renderHeading = (level: number, title: string, children: React.ReactNode) => {
    const heading = headings.find(item => item.title.trim() === title.trim())
    const content = <>{heading?.alias && <span id={heading.alias} className="help-anchor-alias" />}{children}</>
    return level === 3 ? <h4 id={heading?.id}>{content}</h4> : <h5 id={heading?.id}>{content}</h5>
  }
  const components: Components = {
    p: ({ children, node }) => node?.children.some(child => child.type === 'element' && child.tagName === 'img'
      && !inlineIconSize(typeof child.properties.title === 'string' ? child.properties.title : undefined))
      ? <div className="help-image-paragraph">{children}</div> : <p>{children}</p>,
    img: ({ src, alt, title }) => {
      const source = typeof src === 'string' ? src : undefined
      const size = inlineIconSize(title)
      return size
        ? <img className="help-inline-icon" src={helpImageSource(source, theme)} alt={alt ?? ''} loading="lazy" style={{ height: size }} />
        : <Capture src={source} alt={alt} theme={theme} />
    },
    a: ({ href, title, children }) => {
      const destination = title === 'original' ? href : helpLink(href)
      const linkedTool = destination && ['#polaire', '#autosail', '#penalites', '#energie'].includes(destination)
      const finalHref = linkedTool ? navigationHref(destination, locale, theme) : destination
      return <a href={finalHref} {...(destination?.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}</a>
    },
  }
  const render = (markdown: string, key: number, tableStyle?: CSSProperties) => <ReactMarkdown skipHtml key={key} remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]} components={{ ...components,
    table: ({ children }) => <div className="help-table-scroll" tabIndex={0} style={tableStyle}><table>{children}</table></div>,
    h3: ({ children, node }) => renderHeading(3, markdown.split('\n')[(node?.position?.start.line ?? 1) - 1].replace(/^#+\s*/, '').trim(), children),
    h4: ({ children, node }) => renderHeading(4, markdown.split('\n')[(node?.position?.start.line ?? 1) - 1].replace(/^#+\s*/, '').trim(), children),
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
  const searchInput = useRef<HTMLInputElement>(null)
  const [activeSection, setActiveSection] = useState('')
  const fr = locale === 'fr'
  const document = documents.find(item => item.id === route.article)
  const normalizedQuery = normalizeSearchText(query).trim()
  const searchIndex = useMemo(() => createHelpSearchIndex(documents), [documents])
  const matches = useMemo(() => searchHelp(searchIndex, query), [searchIndex, query])

  const changeLocale = (next: Locale) => {
    const translatedDocument = getDocuments(next).find(item => item.id === document?.id)
    const headingIndex = route.section ? document?.toc.findIndex(heading => heading.id === route.section || heading.alias === route.section) ?? -1 : -1
    const heading = headingIndex >= 0 ? document?.toc[headingIndex] : undefined
    const matchingAliases = heading?.alias ? translatedDocument?.toc.filter(item => item.alias === heading.alias) ?? [] : []
    const translatedHeading = heading && (matchingAliases.length === 1 ? matchingAliases[0] : translatedDocument?.toc[headingIndex])
    if (translatedHeading && translatedHeading.level === heading?.level && translatedDocument) {
      const section = matchingAliases.length === 1 ? translatedHeading.alias ?? translatedHeading.id : translatedHeading.id
      window.history.replaceState(window.history.state, '', helpHref(translatedDocument.id, section))
      setRoute({ article: translatedDocument.id, section })
    }
    onLocaleChange(next)
  }

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
    <SiteHeader active="help" locale={locale} onLocaleChange={changeLocale} onThemeChange={onThemeChange} theme={theme} />
    <header className="help-heading"><div><p className="eyebrow">ITYC · Documentation</p><h1>{fr ? 'Aide' : 'Help'}</h1><p>{fr ? 'Tutoriels, calculs et fonctionnement des outils ITYC.' : 'Tutorials, calculations and how to use ITYC tools.'}</p></div>
      <label className="help-search"><span aria-hidden="true">⌕</span><input ref={searchInput} aria-label={fr ? 'Rechercher dans l’aide' : 'Search the documentation'} onChange={event => setQuery(event.target.value)} placeholder={fr ? 'Rechercher dans l’aide…' : 'Search the documentation…'} type="search" value={query} aria-controls={normalizedQuery ? 'help-search-results' : undefined} />{query && <button type="button" onClick={() => { setQuery(''); searchInput.current?.focus() }} aria-label={fr ? 'Effacer la recherche' : 'Clear search'}>×</button>}</label>
    </header>
    <main className={`help-layout${!document || normalizedQuery ? ' help-layout-index' : ''}`}>
      <aside className="help-sidebar" aria-label={fr ? 'Chapitres de l’aide' : 'Help chapters'}><div className="help-mobile-nav"><details key={route.article}><summary>{document?.group ?? (fr ? 'Parcourir l’aide' : 'Browse help')}</summary>{navigation}</details></div><div className="help-desktop-nav">{navigation}</div></aside>
      <article className="help-article">
        <nav className="help-breadcrumb" aria-label={fr ? 'Fil d’Ariane' : 'Breadcrumb'}><button onClick={onBackHome} type="button">ITYC</button><span>/</span><a href="#aide">{fr ? 'Aide' : 'Help'}</a>{document && !normalizedQuery && <><span>/</span><span>{document.group}</span></>}</nav>
        {normalizedQuery ? <><h2>{fr ? 'Résultats de recherche' : 'Search results'}</h2><p className="help-article-summary" role="status">{fr ? `${matches.length} résultat${matches.length === 1 ? '' : 's'}` : `${matches.length} result${matches.length === 1 ? '' : 's'}`}</p><div className="help-results" id="help-search-results">{matches.map(item => <a className="help-result" href={helpHref(item.document.id, item.sectionId)} key={`${item.document.id}:${item.sectionId ?? ''}`} onClick={() => setQuery('')}><span>{item.document.group}{item.document.title !== item.document.group && ` · ${item.document.title}`}</span><h3>{item.title}</h3>{item.excerpt && <p>{item.excerpt}</p>}</a>)}</div>{!matches.length && <p className="help-empty">{fr ? 'Aucun résultat. Essayez un autre terme ou une abréviation, par exemple « TWA ».' : 'No results. Try another term or an abbreviation, such as “TWA”.'}</p>}</> : document ? <>
          <p className="help-article-kicker">{document.group}</p><h2>{document.title}</h2>
          <details className="help-inline-toc"><summary>{fr ? 'Dans cet article' : 'On this page'}</summary><TableOfContents document={document} activeSection={activeSection} /></details>
          {document.intro && <div className="help-article-intro"><Markdown source={document.intro} theme={theme} locale={locale} /></div>}
          {document.sections.map((section, index) => <section className="help-content-section" id={section.id} key={section.id}>{section.alias && <span id={section.alias} className="help-anchor-alias" />}{chapterChartHelpAnchor(document.id, index) && <span id={chapterChartHelpAnchor(document.id, index)} className="help-anchor-alias help-chart-anchor" />}<h3><a className="help-heading-link" href={sectionHref(document, section)}><HeadingText text={section.title} /></a></h3><Markdown source={section.content} theme={theme} locale={locale} headings={section.headings} /></section>)}
          {(document.original || document.tool) && <footer className="help-article-footer">{document.original && <a href={`https://ityc.fr/${document.id}${fr ? '' : 'En'}.html`} target="_blank" rel="noreferrer">{fr ? 'Consulter la page d’origine' : 'View the original page'} ↗</a>}{document.tool && <a href={navigationHref(document.tool, locale, theme)}>{fr ? 'Ouvrir l’outil' : 'Open the tool'} ↗</a>}</footer>}
        </> : <><h2>{fr ? 'Documentation ITYC' : 'ITYC documentation'}</h2><p className="help-article-summary">{fr ? 'Retrouvez les explications des calculs et les tutoriels illustrés de chaque outil.' : 'Find calculation explanations and illustrated tutorials for each tool.'}</p><div className="help-index">{documents.map(item => <a className="help-index-entry" href={helpHref(item.id)} key={item.id}><span>{item.group}</span><h3>{item.title}</h3><p>{item.sections.map(section => section.title.replace(/^\d+\.\s*/, '')).join(' · ')}</p><b aria-hidden="true">→</b></a>)}</div></>}
      </article>
      {document && !normalizedQuery && <aside className="help-toc" aria-label={fr ? 'Dans cet article' : 'On this page'}><h2>{fr ? 'Dans cet article' : 'On this page'}</h2><TableOfContents document={document} activeSection={activeSection} collapseInactive /></aside>}
    </main><SiteFooter locale={locale} />
  </div>
}

function TableOfContents({ document, activeSection, collapseInactive = false }: { document: HelpDocument; activeSection: string; collapseInactive?: boolean }) {
  const activeChapter = document.sections.find(section => section.id === activeSection || section.alias === activeSection || section.headings.some(heading => heading.id === activeSection || heading.alias === activeSection)) ?? document.sections[0]
  const chapterHeadings = activeChapter?.headings ?? []
  const activeHeadingIndex = chapterHeadings.findIndex(heading => heading.id === activeSection || heading.alias === activeSection)
  const activeSubchapter = chapterHeadings.slice(0, activeHeadingIndex + 1).reverse().find(heading => heading.level === 3)
  let parentSubchapter: HelpHeading | undefined
  const headings = document.toc.filter(section => {
    if (section.level === 2) parentSubchapter = undefined
    if (section.level === 3) parentSubchapter = section
    if (section.level === 4) return collapseInactive && Boolean(activeSubchapter && parentSubchapter?.id === activeSubchapter.id)
    return !collapseInactive || section.level === 2 || chapterHeadings.some(heading => heading.id === section.id)
  })
  return <nav>{headings.map(section => <a data-level={section.level} aria-current={activeSection === section.id || activeSection === section.alias ? 'location' : undefined} href={sectionHref(document, section)} key={section.id}><HeadingText text={section.title} /></a>)}</nav>
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
            {document.sections.map(section => <a aria-current={activeSection === section.id || activeSection === section.alias ? 'location' : undefined} href={sectionHref(document, section)} key={section.id}><HeadingText text={section.title} /></a>)}
          </nav>}
        </div>)}
      </section>
    })}
  </nav>
}
