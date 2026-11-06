import type { HelpDocument } from './helpDocuments'

export type HelpSearchResult = {
  document: HelpDocument
  sectionId?: string
  title: string
  excerpt: string
  score: number
}

type SearchEntry = {
  document: HelpDocument
  sectionId?: string
  title: string
  text: string
  normalizedTitle: string
  normalizedDocumentTitle: string
  normalizedText: string
}

export type HelpSearchIndex = readonly SearchEntry[]

/** Use the same normalization for queries and the text indexed at page load. */
export function normalizeSearchText(text: string): string {
  return text.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/œ/gi, 'oe')
    .replace(/æ/gi, 'ae')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

function plainText(markdown: string): string {
  const entities: Record<string, string> = {
    amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
    ndash: '–', mdash: '—', hellip: '…',
  }
  return markdown
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/^[ \t]*:::[^\r\n]*$/gm, ' ')
    .replace(/^[ \t]*(?:`{3,}|~{3,})[^\r\n]*$/gm, ' ')
    .replace(/^[ \t]{0,3}\[[^\]]+\]:[^\r\n]*/gm, ' ')
    // Keep link labels and image descriptions, without their destinations or titles.
    .replace(/!?\[([^\]]*)\]\((?:\\.|[^\\()]|\([^()]*\))*\)/g, '$1')
    .replace(/!?\[([^\]]+)\]\[[^\]]*\]/g, '$1')
    .replace(/<\/?[a-z][^>]*>/gi, ' ')
    .replace(/(?:https?:\/\/|mailto:)[^\s<>()]+/gi, ' ')
    .replace(/^[ \t]{0,3}#{1,6}[ \t]+/gm, '')
    .replace(/^[ \t|:]*-{3,}[\t |:-]*$/gm, ' ')
    .replace(/^[ \t]*(?:[-*+] |\d+[.)][ \t]+)/gm, '')
    .replace(/^[ \t]*(?:>[ \t]*)+/gm, '')
    .replace(/\\([\\`*_{}[\]()#+\-.!|>$])/g, '$1')
    .replace(/\|/g, ' ')
    .replace(/[*_`~$]/g, '')
    .replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);/gi, (entity, name: string) => {
      if (!name.startsWith('#')) return entities[name.toLowerCase()] ?? entity
      const code = name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : Number(name.slice(1))
      return code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff) ? String.fromCodePoint(code) : ' '
    })
    .replace(/\s+/g, ' ')
    .trim()
}

export function createHelpSearchIndex(documents: HelpDocument[]): HelpSearchIndex {
  return documents.flatMap(document => {
    const documentTitle = plainText(document.title)
    const normalizedDocumentTitle = normalizeSearchText(documentTitle)
    const entry = (title: string, content: string, sectionId?: string): SearchEntry => {
      const text = plainText(content)
      const cleanTitle = plainText(title)
      return { document, sectionId, title: cleanTitle, text,
        normalizedTitle: normalizeSearchText(cleanTitle), normalizedDocumentTitle,
        normalizedText: normalizeSearchText(text) }
    }
    return [
      entry(documentTitle, document.intro),
      ...document.sections.map(section => entry(section.title, section.content, section.alias ?? section.id)),
    ]
  })
}

// Short acronyms such as RT and TWA should not match fragments inside other words.
function hasTerm(text: string, term: string): boolean {
  return term.length <= 3 ? ` ${text} `.includes(` ${term} `) : text.includes(term)
}

function hasPhrase(text: string, phrase: string): boolean {
  return ` ${text} `.includes(` ${phrase} `)
}

function excerpt(text: string, terms: string[]): string {
  const maximum = 200
  if (text.length <= maximum) return text
  const firstMatch = [...text.matchAll(/[\p{L}\p{N}]+/gu)]
    .find(match => terms.some(term => hasTerm(normalizeSearchText(match[0]), term)))
  let start = Math.max(0, (firstMatch?.index ?? 0) - Math.floor(maximum / 3))
  if (start > 0) {
    const nextSpace = text.indexOf(' ', start)
    if (nextSpace !== -1 && nextSpace < start + 25) start = nextSpace + 1
  }
  let end = Math.min(text.length, start + maximum)
  if (end < text.length) {
    const previousSpace = text.lastIndexOf(' ', end)
    if (previousSpace > end - 25) end = previousSpace
  }
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`
}

export function searchHelp(index: HelpSearchIndex, query: string): HelpSearchResult[] {
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) return []
  const terms = [...new Set(normalizedQuery.split(' '))]
  const results: HelpSearchResult[] = []

  for (const item of index) {
    const titleTerms = terms.filter(term => hasTerm(item.normalizedTitle, term))
    const bodyTerms = terms.filter(term => hasTerm(item.normalizedText, term))
    const documentTerms = terms.filter(term => hasTerm(item.normalizedDocumentTitle, term))
    if (!terms.every(term => titleTerms.includes(term) || bodyTerms.includes(term) || documentTerms.includes(term))) continue
    // A document title is useful context, but alone must not return every chapter.
    if (item.sectionId !== undefined && !titleTerms.length && !bodyTerms.length) continue
    if (item.sectionId !== undefined && documentTerms.length === terms.length
      && !terms.every(term => titleTerms.includes(term) || bodyTerms.includes(term))) continue

    let score = titleTerms.length * 45 + bodyTerms.length * 8
    if (item.normalizedTitle === normalizedQuery) score += 1000
    else if (hasPhrase(item.normalizedTitle, normalizedQuery)) score += 240
    if (item.normalizedTitle.startsWith(`${normalizedQuery} `)) score += 120
    if (titleTerms.length === terms.length) score += 160
    if (item.sectionId !== undefined) {
      score += documentTerms.length * 12
      if (item.normalizedDocumentTitle === normalizedQuery) score += 220
      else if (hasPhrase(item.normalizedDocumentTitle, normalizedQuery)) score += 70
    }
    if (hasPhrase(item.normalizedText, normalizedQuery)) score += 35
    // Cap repetition so a long article cannot outrank a precise title match.
    score += terms.reduce((bonus, term) => bonus + Math.min(3, item.normalizedText.split(' ').filter(word => hasTerm(word, term)).length), 0)
    results.push({ document: item.document, sectionId: item.sectionId,
      title: item.title, excerpt: excerpt(item.text, titleTerms.length === terms.length ? [] : terms), score })
  }

  return results.sort((left, right) => right.score - left.score)
}
