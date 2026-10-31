export type PolarLevel = 'normal' | 'expert'
export type ChartLayout = 'grid' | 'focus'

export type SailId =
  | 'Jib'
  | 'Spi'
  | 'Code0'
  | 'LightJib'
  | 'LightGnk'
  | 'HeavyGnk'
  | 'Staysail'

export type PolarOptions = {
  foil: boolean
  fullPack: boolean
  hull: boolean
}

export const boats = [
  'Cruiser Racer',
  'Class 40 2021',
  'Figaro 3',
  'OffShore Racer',
  'Imoca',
  'Mini 6.50',
  'Mod70',
  'Ocean 50 (Multi 50)',
  'Volvo 65',
  'Super Maxi 100',
  'Tara',
  'Ultim (Crew)',
  'Ultim (Solo)',
  'Ultim BP XI',
  'Olympus',
  'Caravelle',
] as const

export type BoatName = (typeof boats)[number]

export const sails: ReadonlyArray<{ id: SailId; label: string; group: string; color: string }> = [
  { id: 'Jib', label: 'Foc (J)', group: 'Classiques', color: '#cd0342' },
  { id: 'Spi', label: 'Spi (S)', group: 'Classiques', color: '#00ff00' },
  { id: 'Code0', label: 'Code 0', group: 'Classiques', color: '#00a000' },
  { id: 'LightJib', label: 'Génois léger (LJ)', group: 'Petit temps', color: '#f67876' },
  { id: 'LightGnk', label: 'Spi léger (LG)', group: 'Petit temps', color: '#d77900' },
  { id: 'HeavyGnk', label: 'Spi lourd (HG)', group: 'Brise', color: '#b00000' },
  { id: 'Staysail', label: 'Trinquette (SS)', group: 'Brise', color: '#0000ff' },
]

export const polarUpdatedAt = 'MAJ : mardi 2 juillet 2024 20:33:41'
export const getPolarUpdatedAt = (locale: 'fr' | 'en') => locale === 'fr'
  ? polarUpdatedAt : 'Updated: Tuesday, 2 July 2024 20:33:41'

export const normalCharts = [
  'Vitesse selon le TWA',
  'Vitesse selon le TWS',
  'BVMG',
  'VMG',
  'BSPD',
  'VSPD',
  'Utilisation des voiles',
] as const

const normalChartsEn = ['Speed by TWA', 'Speed by TWS', 'BVMG', 'VMG', 'BSPD', 'VSPD', 'Sail usage'] as const
export const getNormalCharts = (locale: 'fr' | 'en') => locale === 'fr' ? normalCharts : normalChartsEn

export const polarUnit = (locale: 'fr' | 'en') => locale === 'fr' ? 'nds' : 'kts'
export const formatPolarNumber = (value: number, digits: number, locale: 'fr' | 'en') => locale === 'fr'
  ? value.toFixed(digits).replace('.', ',') : value.toFixed(digits)

/** Localize calculated labels at presentation time; workers keep their cached results. */
export function localizePolarText(text: string, locale: 'fr' | 'en'): string {
  if (locale === 'fr') return text
  const translations: Record<string, string> = {
    'Vitesse bateau': 'Boat speed',
    'Le calcul a échoué': 'Calculation failed',
    'Le calcul de la carte a échoué': 'Sail usage calculation failed',
    'Chargement de la polaire impossible': 'Unable to load the polar',
    'Chargement impossible': 'Unable to load the polar',
    'Format de polaire invalide': 'Invalid polar data',
    'Erreur de calcul inconnue': 'Unknown calculation error',
    'Erreur de calcul de la carte des voiles': 'Sail usage calculation error',
  }
  return (translations[text] ?? text.replace(/^Polaire indisponible\s*:\s*/, 'Polar unavailable: ')).replace(/\bnds\b/g, 'kts')
}

export const expertCharts = [
  'Polaire visuelle',
  'TWA · voiles Auto',
  'TWS · voiles Auto',
  'BVMG détaillé',
  'Meilleur cap',
  'VMG',
] as const
