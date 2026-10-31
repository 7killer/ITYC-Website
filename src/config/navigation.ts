export type NavigationItem = {
  label: string
  href: string
  status?: 'available' | 'planned'
}

export const navigation: NavigationItem[] = [
  { label: 'Polaire', href: '#polaire', status: 'available' },
  { label: 'Pénalités', href: '#penalites', status: 'planned' },
  { label: 'Énergie', href: '#energie', status: 'planned' },
  { label: 'AutoSail', href: '#autosail', status: 'planned' },
]
