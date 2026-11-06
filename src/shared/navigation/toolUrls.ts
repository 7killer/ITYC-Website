import { boats, sails, type BoatName, type SailId } from '../../features/polar/polarModel'
import { readPublicPage } from './publicPages'

export type ToolPage = 'polar' | 'autosail' | 'penalties' | 'energy'
type Locale = 'fr' | 'en'
type State = Record<string, unknown>
type Bounds = readonly [number, number]
type QueryEntry = { key: string; value: string; raw?: string }

export const TOOL_STATE_EVENT = 'ityc:tool-state-change'

const files: Record<ToolPage, string> = { polar: 'polar', autosail: 'autoSail', penalties: 'pena', energy: 'energy' }
const hashes: Record<string, ToolPage> = { polaire: 'polar', autosail: 'autosail', penalites: 'penalties', energie: 'energy' }
const boatTokens: Array<readonly [string, BoatName]> = [
  ['Cruiser_Racer', 'Cruiser Racer'], ['Class_40', 'Class 40 2021'], ['Figaro_III', 'Figaro 3'],
  ['Offshore_Racer', 'OffShore Racer'], ['Imoca', 'Imoca'], ['Mini_6.50', 'Mini 6.50'],
  ['MOD_70', 'Mod70'], ['Ocean_Fifty', 'Ocean 50 (Multi 50)'], ['Volvo_65', 'Volvo 65'],
  ['Super_Maxi 100', 'Super Maxi 100'], ['Tara', 'Tara'], ['Ultim_Crew', 'Ultim (Crew)'],
  ['Ultim_Solo', 'Ultim (Solo)'], ['Ultim_BP XI', 'Ultim BP XI'], ['Ultim_BP_11', 'Ultim BP XI'],
  ['Ultim', 'Ultim BP XI'], ['Olympus', 'Olympus'], ['Caravel', 'Caravelle'],
]
const sailAliases: Record<string, SailId> = {
  J: 'Jib', Jib: 'Jib', S: 'Spi', Spi: 'Spi', C0: 'Code0', Code0: 'Code0',
  LJ: 'LightJib', LightJib: 'LightJib', LG: 'LightGnk', LightGnk: 'LightGnk',
  HG: 'HeavyGnk', HeavyGnk: 'HeavyGnk', SS: 'Staysail', Stay: 'Staysail', Staysail: 'Staysail',
}
const sailTokens: Record<SailId, string> = { Jib: 'J', Spi: 'S', Code0: 'C0', LightJib: 'LJ', LightGnk: 'LG', HeavyGnk: 'HG', Staysail: 'SS' }
const allSails = sails.map(sail => sail.id)
const sailFields = ['sailForTwa', 'sailForTws', 'sailForRange', 'firstOverlapSail', 'secondOverlapSail'] as const
const optionFields = ['fullPack', 'foil', 'hull', 'winch', 'furler', 'jacket', 'pug'] as const
const focusMax: Record<ToolPage, number> = { polar: 6, autosail: 3, penalties: 2, energy: 1 }
const precisionChartIndexes: Record<ToolPage, readonly number[]> = {
  polar: [1, 2, 3, 4, 5, 6], autosail: [0, 2], penalties: [0, 1], energy: [0, 1],
}
const numericFields: Record<ToolPage, Record<string, Bounds>> = {
  polar: { twa: [0, 180], tws: [1, 40] },
  autosail: { twa: [0, 180], tws: [.1, 50], twsStart: [.1, 50], twsEnd: [.1, 50], twaStart: [0, 180], twaEnd: [0, 180] },
  penalties: {
    simpleEnergy: [0, 100], doubleEnergy: [0, 100], rentEnergy: [0, 100],
    simpleWind: [.1, 35], doubleWind: [.1, 35], rentWind: [.1, 35],
    simpleSpeed: [1, 45], doubleSpeed: [1, 45], withoutSpeed: [1, 45], withSpeed: [1, 45],
  },
  energy: { energy: [0, 99.9], lossWind: [.1, 35], recoveryWind: [.1, 35] },
}
const snapshots = new Map<ToolPage, State>()
let latestPage: ToolPage | undefined
let common: State = {}
let contextInitialized = false

const record = (value: unknown): State | undefined => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as State : undefined
const currentLocation = () => typeof window === 'undefined' ? { pathname: '', hash: '', search: '' } : window.location
const decode = (value: string) => { try { return decodeURIComponent(value.replace(/\+/g, ' ')) } catch { return value } }
const query = (search: string): QueryEntry[] => search.replace(/^\?/, '').split('&').filter(Boolean).map(raw => {
  const separator = raw.indexOf('=')
  return { key: decode(separator < 0 ? raw : raw.slice(0, separator)), value: decode(separator < 0 ? '' : raw.slice(separator + 1)), raw }
})
const valueOf = (entries: QueryEntry[], key: string) => {
  for (let index = entries.length - 1; index >= 0; index--) if (entries[index].key === key) return entries[index].value
  return undefined
}
const bool = (value: unknown): boolean | undefined => value === true || value === 'true' || value === '1' ? true
  : value === false || value === 'false' || value === '0' ? false : undefined
const finiteNumber = (value: unknown): number | undefined => {
  if (typeof value !== 'number' && (typeof value !== 'string' || !value.trim())) return undefined
  const parsed = Number(typeof value === 'string' ? value.trim().replace(',', '.') : value)
  return Number.isFinite(parsed) ? parsed : undefined
}
const number = (value: unknown, [min, max]: Bounds): number | undefined => {
  const parsed = finiteNumber(value)
  return parsed === undefined ? undefined : Math.min(max, Math.max(min, parsed))
}
// Shared conditions use a valid historical name first, then its state-name alias.
const condition = (entries: QueryEntry[], historical: 'ts' | 'ta', alias: 'tws' | 'twa') =>
  finiteNumber(valueOf(entries, historical)) ?? finiteNumber(valueOf(entries, alias))
const boat = (value: unknown): BoatName | undefined => {
  if (typeof value !== 'string') return undefined
  const name = decode(value)
  if ((boats as readonly string[]).includes(name)) return name as BoatName
  if (name === 'Figaro') return 'Figaro 3'
  if (name === 'Ultim BP 11') return 'Ultim BP XI'
  return boatTokens.find(([token]) => token === name)?.[1]
}
const sail = (value: unknown): SailId | undefined => typeof value === 'string' && Object.prototype.hasOwnProperty.call(sailAliases, value) ? sailAliases[value] : undefined
const sailList = (value: unknown): SailId[] | undefined => {
  const values = Array.isArray(value) ? value : typeof value === 'string' ? (value.trim() ? value.split(',').map(item => item.trim()) : []) : undefined
  if (!values) return undefined
  const parsed = values.map(sail)
  return parsed.some(item => item === undefined) ? undefined : [...new Set(parsed as SailId[])]
}

export function isToolPage(value: string): value is ToolPage {
  return Object.prototype.hasOwnProperty.call(files, value)
}

function fileRoute(pathname: string): { page: ToolPage; locale: Locale } | undefined {
  const filename = pathname.split('/').pop() ?? ''
  for (const page of Object.keys(files) as ToolPage[]) {
    if (filename === `${files[page]}.html`) return { page, locale: 'fr' }
    if (filename === `${files[page]}En.html`) return { page, locale: 'en' }
  }
  return undefined
}

function embeddedRoute(pathname: string): { page: ToolPage } | undefined {
  const filename = pathname.split('/').pop() ?? ''
  for (const page of Object.keys(files) as ToolPage[]) {
    if (filename === `${files[page]}Dash.html`) return { page }
  }
  return undefined
}

export function isEmbeddedToolPage(location: { pathname: string } = currentLocation()): boolean {
  return embeddedRoute(location.pathname) !== undefined
}

export function readToolRoute(location: { pathname: string; hash: string } = currentLocation()): { page: ToolPage; locale?: Locale } | undefined {
  const embedded = embeddedRoute(location.pathname)
  if (embedded) return embedded
  const path = fileRoute(location.pathname)
  const hash = location.hash.replace(/^#/, '').split('?')[0]
  const page = Object.prototype.hasOwnProperty.call(hashes, hash) ? hashes[hash] : undefined
  return page ? { page, ...(path?.locale ? { locale: path.locale } : {}) } : path
}

export function readUrlPreferences(): { locale?: Locale; theme?: 'dark' | 'light' } {
  const location = currentLocation()
  const entries = query(location.search)
  const requestedLocale = [valueOf(entries, 'locale'), valueOf(entries, 'lang')]
    .find(value => value === 'fr' || value === 'en') as Locale | undefined
  const theme = valueOf(entries, 'th')
  if (isEmbeddedToolPage(location)) {
    return { locale: requestedLocale ?? 'fr', theme: theme === 'light' || theme === 'dark' ? theme : 'dark' }
  }
  const filenameLocale = fileRoute(location.pathname)?.locale
  const siteLocale = location.pathname.split('/').pop() ? readPublicPage(location.pathname)?.locale : undefined
  const hash = location.hash.replace(/^#/, '').split('?')[0]
  // Non-tool pages can remain on an old tool filename during hash navigation.
  const locale = hash === 'aide' || hash === 'accueil' || hash === 'dash'
    ? requestedLocale ?? filenameLocale ?? siteLocale : filenameLocale ?? requestedLocale ?? siteLocale
  return { ...(locale ? { locale } : {}), ...(theme === 'dark' || theme === 'light' ? { theme } : {}) }
}

function optionState(value: unknown): State | undefined {
  if (typeof value !== 'string' || (value !== 'FP' && value !== 'AO' && !/^[FhRLHWMJPC]*$/.test(value))) return undefined
  const fullPack = value === 'FP' || value === 'AO'
  return {
    fullPack, foil: fullPack || value.includes('F'), hull: fullPack || value.includes('h'),
    winch: fullPack || value.includes('W'), furler: fullPack || value.includes('M'),
    jacket: fullPack || value.includes('J'), pug: fullPack || value.includes('P') || value.includes('C'),
    selectedSails: fullPack ? [...allSails] : [
      'Jib', 'Spi', ...(value.includes('R') ? ['Code0'] : []),
      ...(value.includes('L') ? ['LightGnk', 'LightJib'] : []), ...(value.includes('H') ? ['HeavyGnk', 'Staysail'] : []),
    ],
  }
}

function completeState(page: ToolPage, state: State): State {
  if (page === 'polar' || page === 'autosail') {
    const options = { foil: true, hull: true, fullPack: true, ...record(state.options) }
    const selected = sailList(state.selectedSails) ?? [...allSails]
    if (!options.foil || !options.hull || allSails.some(id => !selected.includes(id))) options.fullPack = false
    state.options = options
    state.selectedSails = selected
    if (page === 'polar') state.expertDisplay = { auto: true, foils: true, sails: true, ...record(state.expertDisplay) }
  } else if (state.fullPack === true) {
    const fields = page === 'energy' ? ['winch', 'furler', 'jacket', 'pug'] : ['winch', 'furler', 'jacket']
    if (fields.some(field => state[field] === false)) state.fullPack = false
  }
  return state
}

function cleanState(page: ToolPage, saved: object): State {
  const state: State = { ...saved }
  if ('boat' in state) { const parsed = boat(state.boat); if (parsed) state.boat = parsed; else delete state.boat }
  for (const [field, bounds] of Object.entries({ ...numericFields[page], focus: [0, focusMax[page]] as Bounds })) {
    if (!(field in state)) continue
    const parsed = number(state[field], bounds)
    if (parsed === undefined) delete state[field]
    else state[field] = field === 'focus' ? Math.round(parsed) : parsed
  }
  if ('layout' in state && state.layout !== 'grid' && state.layout !== 'focus') delete state.layout
  if ('level' in state && state.level !== 'normal' && state.level !== 'expert') delete state.level
  for (const field of optionFields) {
    if (!(field in state)) continue
    const parsed = bool(state[field]); if (parsed === undefined) delete state[field]; else state[field] = parsed
  }
  if ('options' in state) {
    const source = record(state.options)
    const options: State = {}
    for (const field of ['foil', 'hull', 'fullPack']) { const parsed = bool(source?.[field]); if (parsed !== undefined) options[field] = parsed }
    if (Object.keys(options).length) state.options = options; else delete state.options
  }
  if ('expertDisplay' in state) {
    const source = record(state.expertDisplay)
    const display: State = {}
    for (const field of ['auto', 'foils', 'sails']) { const parsed = bool(source?.[field]); if (parsed !== undefined) display[field] = parsed }
    if (Object.keys(display).length) state.expertDisplay = display; else delete state.expertDisplay
  }
  if ('selectedSails' in state) {
    const parsed = sailList(state.selectedSails); if (parsed) state.selectedSails = parsed; else delete state.selectedSails
  }
  for (const field of sailFields) { if (field in state) { const parsed = sail(state[field]); if (parsed) state[field] = parsed; else delete state[field] } }
  if ('overlapPrecision' in state && state.overlapPrecision !== '0.1' && state.overlapPrecision !== '0.01') delete state.overlapPrecision
  if ('chartPrecisions' in state) {
    const source = record(state.chartPrecisions)
    const precisions: State = {}
    for (const index of precisionChartIndexes[page]) {
      const value = source?.[index]
      if (value === '0.1' || value === '0.01') precisions[index] = value
    }
    state.chartPrecisions = precisions
  }
  return completeState(page, state)
}

export function applyToolUrlState<T extends object>(page: ToolPage, saved: Partial<T>, search = currentLocation().search): Partial<T> {
  const state = cleanState(page, saved)
  const entries = query(search)
  const get = (name: string) => valueOf(entries, name)
  const wind = condition(entries, 'ts', 'tws')
  const angle = condition(entries, 'ta', 'twa')
  const parsedBoat = boat(get('b'))
  if (parsedBoat) state.boat = parsedBoat
  const polar = page === 'polar' || page === 'autosail'
  const parsedOptions = optionState(get('o')) ?? (isEmbeddedToolPage() ? optionState('') : undefined)
  if (parsedOptions) {
    if (polar) {
      state.options = { ...record(state.options), foil: parsedOptions.foil, hull: parsedOptions.hull, fullPack: parsedOptions.fullPack }
      state.selectedSails = parsedOptions.selectedSails
    } else {
      for (const field of ['fullPack', 'winch', 'furler', 'jacket', ...(page === 'energy' ? ['pug'] : [])]) state[field] = parsedOptions[field]
    }
  }
  if (bool(get('fullPack')) === true) {
    const preset = optionState('FP')!
    if (polar) {
      state.options = { foil: true, hull: true, fullPack: true }
      state.selectedSails = [...allSails]
    } else {
      for (const field of ['fullPack', 'winch', 'furler', 'jacket', ...(page === 'energy' ? ['pug'] : [])]) state[field] = preset[field]
    }
  }
  const putNumber = (field: string, raw: unknown, absolute = false) => {
    const bounds = field === 'focus' ? [0, focusMax[page]] as Bounds : numericFields[page][field]
    if (!bounds) return
    const value = finiteNumber(raw)
    const source = absolute && value !== undefined ? Math.abs(value) : raw
    const parsed = number(source, bounds)
    if (parsed !== undefined) state[field] = field === 'focus' ? Math.round(parsed) : parsed
  }
  if (polar) { putNumber('tws', wind); putNumber('twa', angle, true) }
  if (page === 'penalties') {
    for (const field of ['simpleWind', 'doubleWind', 'rentWind']) putNumber(field, wind)
    for (const field of ['simpleEnergy', 'doubleEnergy', 'rentEnergy']) putNumber(field, get('se'))
    for (const field of ['simpleSpeed', 'doubleSpeed', 'withoutSpeed']) putNumber(field, get('bs'))
    const speed = number(get('bs'), [1, 45]); if (speed !== undefined) putNumber('withSpeed', speed + 2)
  }
  if (page === 'energy') {
    putNumber('lossWind', wind); putNumber('recoveryWind', wind); putNumber('energy', get('se'))
  }
  if (page === 'autosail') {
    const selected = sail(get('s')); if (selected) for (const field of sailFields) state[field] = selected
    if (wind !== undefined) {
      putNumber('twsStart', wind - 4); putNumber('twsEnd', wind + 4)
    }
    if (angle !== undefined) {
      const normalizedAngle = number(Math.abs(angle), [0, 180])!
      putNumber('twaStart', normalizedAngle - 10); putNumber('twaEnd', normalizedAngle + 10)
    }
  }
  // Conditions and aliases were resolved together above. Independent panel
  // fields and range endpoints still override their shared defaults.
  for (const field of Object.keys(numericFields[page])) {
    if (field === 'tws' || field === 'twa') continue
    putNumber(field, get(field))
  }
  putNumber('focus', get('focus'))
  if (get('layout') === 'grid' || get('layout') === 'focus') state.layout = get('layout')
  if (page === 'polar' && (get('level') === 'normal' || get('level') === 'expert')) state.level = get('level')
  for (const field of optionFields) {
    const parsed = bool(get(field)); if (parsed === undefined) continue
    if (polar && (field === 'foil' || field === 'hull' || field === 'fullPack')) state.options = { ...record(state.options), [field]: parsed }
    else if (!polar && field !== 'foil' && field !== 'hull' && (page === 'energy' || field !== 'pug')) state[field] = parsed
  }
  if (polar) {
    const selected = sailList(get('sails')); if (selected) state.selectedSails = selected
  }
  if (page === 'polar') {
    for (const [parameter, field] of [['displayAuto', 'auto'], ['displayFoils', 'foils'], ['displaySails', 'sails']]) {
      const parsed = bool(get(parameter)); if (parsed !== undefined) state.expertDisplay = { ...record(state.expertDisplay), [field]: parsed }
    }
  }
  if (page === 'autosail') {
    for (const field of sailFields) { const parsed = sail(get(field)); if (parsed) state[field] = parsed }
    const precision = get('precision') ?? get('overlapPrecision')
    if (precision === '0.1' || precision === '0.01') state.overlapPrecision = precision
  }
  for (const index of precisionChartIndexes[page]) {
    const precision = get(`${page}Precision${index}`)
    if (precision === '0.1' || precision === '0.01') {
      state.chartPrecisions = { ...record(state.chartPrecisions), [index]: precision }
    }
  }
  return completeState(page, state) as Partial<T>
}

function ensureContext() {
  if (contextInitialized) return
  contextInitialized = true
  const search = currentLocation().search
  const entries = query(search)
  common = { ...optionState(valueOf(entries, 'o')) }
  const parsedBoat = boat(valueOf(entries, 'b')); if (parsedBoat) common.boat = parsedBoat
  const parsedSail = sail(valueOf(entries, 's')); if (parsedSail) common.sail = parsedSail
  for (const [parameter, field, bounds] of [
    ['ts', 'tws', [.1, 50]], ['ta', 'twa', [0, 180]], ['bs', 'boatSpeed', [1, 45]], ['se', 'energy', [0, 100]],
  ] as const) {
    const raw = parameter === 'ts' ? condition(entries, 'ts', 'tws')
      : parameter === 'ta' ? condition(entries, 'ta', 'twa') : valueOf(entries, parameter)
    const value = finiteNumber(raw)
    const parsed = number(parameter === 'ta' && value !== undefined ? Math.abs(value) : raw, bounds)
    if (parsed !== undefined) common[field] = parsed
  }
  for (const field of optionFields) { const parsed = bool(valueOf(entries, field)); if (parsed !== undefined) common[field] = parsed }
  const selected = sailList(valueOf(entries, 'sails')); if (selected) common.selectedSails = selected
}

function latestNumber(state: State, previous: State | undefined, fields: string[]) {
  const changed = previous ? fields.filter(field => state[field] !== previous[field]) : []
  for (const field of [...changed, ...fields]) if (typeof state[field] === 'number') return state[field]
  return undefined
}

export function publishToolState(page: ToolPage, value: object) {
  ensureContext()
  const state = cleanState(page, value)
  const previous = snapshots.get(page)
  if (latestPage === page && JSON.stringify(previous) === JSON.stringify(state)) return
  if (state.boat !== undefined) common.boat = state.boat
  const windFields = page === 'penalties' ? ['simpleWind', 'doubleWind', 'rentWind'] : page === 'energy' ? ['lossWind', 'recoveryWind'] : ['tws']
  const energyFields = page === 'penalties' ? ['simpleEnergy', 'doubleEnergy', 'rentEnergy'] : page === 'energy' ? ['energy'] : []
  const wind = latestNumber(state, previous, windFields); if (wind !== undefined) common.tws = wind
  const energy = latestNumber(state, previous, energyFields); if (energy !== undefined) common.energy = energy
  if (state.twa !== undefined) common.twa = state.twa
  if (page === 'penalties') {
    const speed = latestNumber(state, previous, ['simpleSpeed', 'doubleSpeed', 'withoutSpeed', 'withSpeed'])
    if (speed !== undefined) common.boatSpeed = speed
  }
  if (page === 'autosail') {
    const changed = previous ? sailFields.find(field => state[field] !== previous[field]) : undefined
    const selected = sail(state[changed ?? 'sailForTwa']); if (selected) common.sail = selected
  }
  for (const [field, raw] of Object.entries({ ...state, ...record(state.options) })) {
    if ((optionFields as readonly string[]).includes(field) || field === 'selectedSails') common[field] = raw
  }
  snapshots.set(page, state)
  latestPage = page
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(TOOL_STATE_EVENT, { detail: { page } }))
}

function put(entries: QueryEntry[], key: string, value: unknown) {
  if (value === undefined) return
  const index = entries.findIndex(entry => entry.key === key)
  const entry: QueryEntry = { key, value: String(value) }
  if (index < 0) entries.push(entry)
  else {
    entries.splice(index, 1, entry)
    for (let cursor = entries.length - 1; cursor > index; cursor--) if (entries[cursor].key === key) entries.splice(cursor, 1)
  }
}

function writeState(entries: QueryEntry[], page: ToolPage, state: State) {
  for (const field of Object.keys(numericFields[page])) {
    if (field !== 'twa' && field !== 'tws') put(entries, field, state[field])
  }
  for (const field of ['layout', 'level', 'focus']) put(entries, field, state[field])
  const precisions = record(state.chartPrecisions)
  for (const index of precisionChartIndexes[page]) put(entries, `${page}Precision${index}`, precisions?.[index])
  if (page === 'polar') {
    const display = record(state.expertDisplay)
    for (const [parameter, field] of [['displayAuto', 'auto'], ['displayFoils', 'foils'], ['displaySails', 'sails']]) {
      if (display?.[field] !== undefined) put(entries, parameter, display[field] ? 1 : 0)
    }
  }
  if (page === 'autosail') {
    for (const field of sailFields) put(entries, field, state[field])
    put(entries, 'precision', state.overlapPrecision)
  }
}

function optionToken(state: State) {
  if (state.fullPack === true) return 'FP'
  const selected = sailList(state.selectedSails)
  return `${state.foil ? 'F' : ''}${state.hull ? 'h' : ''}${selected?.includes('Code0') ? 'R' : ''}${selected?.some(item => item === 'LightGnk' || item === 'LightJib') ? 'L' : ''}${selected?.some(item => item === 'HeavyGnk' || item === 'Staysail') ? 'H' : ''}${state.winch ? 'W' : ''}${state.furler ? 'M' : ''}${state.jacket ? 'J' : ''}${state.pug ? 'P' : ''}`
}

export function buildToolHref(page: ToolPage, locale?: Locale, theme?: 'dark' | 'light'): string {
  ensureContext()
  const embedded = isEmbeddedToolPage()
  const entries = query(currentLocation().search)
  const target = snapshots.get(page)
  if (target) writeState(entries, page, target)
  if (latestPage) writeState(entries, latestPage, snapshots.get(latestPage)!)
  const name = boat(common.boat)
  if (name && !embedded) put(entries, 'b', boatTokens.find(([, canonical]) => canonical === name)?.[0])
  if (common.sail !== undefined) put(entries, 's', sailTokens[common.sail as SailId])
  if (!embedded && (optionFields.some(field => common[field] !== undefined) || common.selectedSails !== undefined)) put(entries, 'o', optionToken(common))
  put(entries, 'ts', common.tws); put(entries, 'ta', common.twa)
  // Keep accepted aliases synchronized without adding them to legacy URLs.
  if (entries.some(entry => entry.key === 'tws')) put(entries, 'tws', common.tws)
  if (entries.some(entry => entry.key === 'twa')) put(entries, 'twa', common.twa)
  const preferences = readUrlPreferences()
  const selectedLocale = locale ?? preferences.locale
  if (embedded) {
    put(entries, 'lang', selectedLocale ?? 'fr')
    if (entries.some(entry => entry.key === 'locale')) put(entries, 'locale', selectedLocale ?? 'fr')
  }
  const selectedTheme = theme ?? preferences.theme
  if (selectedTheme) put(entries, 'th', selectedTheme)
  put(entries, 'bs', common.boatSpeed); put(entries, 'se', common.energy)
  // Embedded equipment/boat settings belong to the incoming context. A later
  // tool snapshot must not replace o (or override it through added flags).
  if (!embedded) {
    for (const field of optionFields) if (common[field] !== undefined) put(entries, field, common[field] ? 1 : 0)
    if (common.selectedSails !== undefined) put(entries, 'sails', (common.selectedSails as SailId[]).join(','))
  }
  const search = entries.map(entry => entry.raw ?? `${encodeURIComponent(entry.key)}=${encodeURIComponent(entry.value)}`).join('&')
  return `${files[page]}${embedded ? 'Dash' : selectedLocale === 'en' ? 'En' : ''}.html${search ? `?${search}` : ''}`
}
