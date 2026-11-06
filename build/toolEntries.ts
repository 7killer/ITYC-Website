import type { Plugin } from 'vite'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { embeddedPageFiles, publicPageAliases, publicPageFile, publicPages, publicPageUrl, type PublicLocale, type PublicPage } from '../src/shared/navigation/publicPages.ts'

const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

function sitemap() {
  const entries = publicPages.flatMap(page => (['fr', 'en'] as const).map(locale => {
    const alternates = (['fr', 'en'] as const).map(language => `    <xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(publicPageUrl(page, language))}" />`).join('\n')
    const priority = page.file === 'index' && locale === 'fr' ? '1.00' : locale === 'fr' ? '0.80' : '0.64'
    return `  <url>\n    <loc>${escapeXml(publicPageUrl(page, locale))}</loc>\n${alternates}\n    <priority>${priority}</priority>\n  </url>`
  }))
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`
}

export function toolEntriesPlugin(): Plugin {
  let root = ''
  const titleFor = async (page: PublicPage, locale: PublicLocale) => {
    if (page.article) {
      const source = await readFile(resolve(root, 'src/features/help/content', locale, `${page.article}.md`), 'utf8')
      const title = source.match(/^# (.+)$/m)?.[1]
      if (title) return title
    }
    return page.titles[locale === 'fr' ? 0 : 1]
  }
  const pageHtml = async (html: string, page: PublicPage, locale: PublicLocale, noindex = false) => {
    const title = await titleFor(page, locale)
    const description = locale === 'fr' ? `${title} : outils et documentation ITYC pour Virtual Regatta.` : `${title}: ITYC tools and documentation for Virtual Regatta.`
    const links = [
      `<link rel="canonical" href="${escapeXml(publicPageUrl(page, locale))}" />`,
      ...(['fr', 'en'] as const).map(language => `<link rel="alternate" hreflang="${language}" href="${escapeXml(publicPageUrl(page, language))}" />`),
      ...(noindex ? ['<meta name="robots" content="noindex, follow" />'] : []),
    ].map(tag => `    ${tag}`).join('\n')
    return html.replace(/(<html\b[^>]*\blang=")[^"]*(")/i, `$1${locale}$2`)
      .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeXml(title)} — ITYC</title>`)
      .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escapeXml(description)}" />`)
      .replace(/<\/head>/i, `${links}\n  </head>`)
  }
  return {
    name: 'ityc-tool-entries',
    apply: 'build',
    enforce: 'post',
    configResolved(config) { root = config.root },
    generateBundle: {
      order: 'post',
      async handler(_options, bundle) {
        const index = bundle['index.html']
        if (!index || index.type !== 'asset') {
          this.error('Les entrées des outils nécessitent le fichier index.html compilé.')
        }
        // All entries share the built JS/CSS; only their document metadata differs.
        const template = String(index.source)
        for (const page of publicPages) {
          for (const locale of ['fr', 'en'] as const) {
            const fileName = publicPageFile(page, locale)
            const source = await pageHtml(template, page, locale)
            if (fileName === 'index.html') index.source = source
            else this.emitFile({ type: 'asset', fileName, source })
          }
        }
        for (const fileName of embeddedPageFiles) {
          const page = publicPages.find(item => `${item.file}Dash.html` === fileName)!
          this.emitFile({ type: 'asset', fileName, source: await pageHtml(template, page, 'fr', true) })
        }
        for (const alias of publicPageAliases) {
          const page = publicPages.find(item => item.file === alias.target)!
          this.emitFile({ type: 'asset', fileName: alias.file, source: await pageHtml(template, page, alias.locale, true) })
        }
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap() })
      },
    },
  }
}
