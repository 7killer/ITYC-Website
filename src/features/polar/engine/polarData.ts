import type { PolarData } from './polarTypes'
import type { BoatName } from '../polarModel'

const polarFiles: Record<BoatName, string> = {
  'Class 40 2021': 'class40_2021.json',
  'Cruiser Racer': 'cruiserracer.json',
  'Figaro 3': 'figaro3.json',
  'Imoca': 'imoca_60_foils.json',
  'Mini 6.50': 'mini_6_50_v2.json',
  'Mod70': 'mod70.json',
  'Ocean 50 (Multi 50)': 'multi_50.json',
  'OffShore Racer': 'offshoreracer.json',
  'Super Maxi 100': 'super_maxi_100.json',
  'Tara': 'Tara.json',
  'Ultim (Crew)': 'maxi_trimaran_x10percent.json',
  'Ultim (Solo)': 'maxi_trimaran.json',
  'Ultim BP XI': 'Ultim_BP_XI.json',
  'Olympus': 'Happy.json',
  'Caravelle': 'Caravel.json',
  'Volvo 65': 'vo65.json',
}

const cache = new Map<BoatName, PolarData>()

function parseLegacyPolar(source: string): PolarData {
  const match = source.match(/=\s*'([\s\S]*)'\s*;?\s*$/)
  const raw = match?.[1] ?? source
  const value = JSON.parse(raw)
  const polar = Array.isArray(value) ? value[0] : value
  if (!polar?.sail || !polar?.twa || !polar?.tws) throw new Error('Format de polaire invalide')
  return polar as PolarData
}

export async function loadPolarData(boat: BoatName) {
  const cached = cache.get(boat)
  if (cached) return cached
  const response = await fetch(`${import.meta.env.BASE_URL}data/export/${polarFiles[boat]}`, { cache: 'no-cache' })
  if (!response.ok) throw new Error(`Polaire indisponible : ${polarFiles[boat]}`)
  const source = await response.text()
  const polar = parseLegacyPolar(source)
  cache.set(boat, polar)
  return polar
}
