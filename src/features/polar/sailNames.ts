import type { PolarSailId } from './engine/polarTypes'

// Names from assets/vendor/toxxct/polars_reader_101.js (PolarsReader.sailsNames).
const sailNames: Record<PolarSailId, Record<'fr' | 'en', string>> = {
  Jib: { fr: 'Foc (J)', en: 'Jib' },
  Spi: { fr: 'Spi (S)', en: 'Spi' },
  Staysail: { fr: 'Trinquette (SS)', en: 'Staysail' },
  LightJib: { fr: 'Génois léger (LJ)', en: 'Light jib' },
  Code0: { fr: 'Code 0', en: 'Code 0' },
  HeavyGnk: { fr: 'Spi lourd (HG)', en: 'Heavy Gennaker' },
  LightGnk: { fr: 'Spi léger (LG)', en: 'Light Gennaker' },
}

export function getSailName(sail: PolarSailId, locale: 'fr' | 'en'): string {
  return sailNames[sail][locale]
}
