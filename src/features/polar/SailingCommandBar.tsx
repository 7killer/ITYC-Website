import type { ReactNode } from 'react'
import { SegmentedControl } from '../../shared/ui/SegmentedControl'
import { ToggleField } from '../../shared/ui/ToggleField'
import { useLocale } from '../../shared/i18n/LocaleContext'
import { boats, getPolarUpdatedAt, sails, type ChartLayout, type PolarOptions, type SailId } from './polarModel'
import { getSailName } from './sailNames'

type SailingCommandBarProps = {
  boat: (typeof boats)[number]
  embedded?: boolean
  extraModeControl?: ReactNode
  layout: ChartLayout
  locale?: 'fr' | 'en'
  onBoatChange: (boat: (typeof boats)[number]) => void
  onLayoutChange: (layout: ChartLayout) => void
  onOptionChange: (option: keyof PolarOptions, checked: boolean) => void
  onSailChange: (sail: SailId, checked: boolean) => void
  options: PolarOptions
  selectedSails: ReadonlySet<SailId>
}

const sailGroups: Array<{ id: string; ids: SailId[]; label: string }> = [
  { id: 'heavy', ids: ['HeavyGnk', 'Staysail'], label: 'Brise' },
  { id: 'reach', ids: ['Code0'], label: 'Reaching' },
  { id: 'light', ids: ['LightJib', 'LightGnk'], label: 'Petit temps' },
]

const displayedSails = ['Jib', 'LightJib', 'HeavyGnk', 'Code0', 'Spi', 'LightGnk', 'Staysail'] as const

export function SailingCommandBar({
  boat,
  embedded = false,
  extraModeControl,
  layout,
  locale: requestedLocale,
  onBoatChange,
  onLayoutChange,
  onOptionChange,
  onSailChange,
  options,
  selectedSails,
}: SailingCommandBarProps) {
  const contextLocale = useLocale()
  const locale = requestedLocale ?? contextLocale
  const fr = locale === 'fr'
  const layoutOptions = [{ label: fr ? 'Grille' : 'Grid', value: 'grid' }, { label: 'Focus', value: 'focus' }] as const
  const layoutLabel = fr ? 'Disposition des courbes' : 'Chart layout'
  const groupLabels: Record<string, string> = { heavy: 'Heavy weather', reach: 'Reaching', light: 'Light wind' }
  if (embedded) return <section className="polar-toolbar sailing-toolbar embedded-toolbar" aria-label={fr ? 'Affichage des courbes' : 'Chart display'}>
    <span className="embedded-boat-name">{boat}</span>
    {extraModeControl}
    <SegmentedControl ariaLabel={layoutLabel} onChange={onLayoutChange} options={layoutOptions} value={layout} />
  </section>

  return <>
    <section className="polar-toolbar sailing-toolbar" aria-label={fr ? 'Contrôles de navigation' : 'Navigation controls'}>
      <div className="boat-selector"><select aria-label={fr ? 'Bateau' : 'Boat'} id="boat" onChange={(event) => onBoatChange(event.target.value as (typeof boats)[number])} value={boat}>{boats.map((item) => <option key={item}>{item}</option>)}</select></div>
      <p className="polar-update">{getPolarUpdatedAt(locale)}</p>
      <a className="tutorial-link" href="#aide">{fr ? 'Tutoriel' : 'Tutorial'}</a>
      <SegmentedControl ariaLabel={layoutLabel} onChange={onLayoutChange} options={layoutOptions} value={layout} />
    </section>

    <section className="polar-controls sailing-controls" aria-label={fr ? 'Réglages de calcul' : 'Calculation settings'}>
      <section className="control-panel options-panel" aria-label="Options">
        <h2>{fr ? 'Option' : 'Options'}</h2>
        <div className="control-panel-content options-grid">
          <ToggleField checked={options.fullPack} id="full-pack" label="Full Pack" onChange={(checked) => onOptionChange('fullPack', checked)} />
          <ToggleField checked={options.foil} id="foil" label="Foils" onChange={(checked) => onOptionChange('foil', checked)} />
          <ToggleField checked={options.hull} id="hull" label={fr ? 'Polish coque' : 'Hull polish'} onChange={(checked) => onOptionChange('hull', checked)} />
          {sailGroups.map((group) => <ToggleField checked={group.ids.every((id) => selectedSails.has(id))} id={group.id} key={group.id} label={fr ? group.label : groupLabels[group.id]} onChange={(checked) => group.ids.forEach((id) => onSailChange(id, checked))} />)}
        </div>
      </section>
      <section className="control-panel sails-panel" aria-label={fr ? 'Voiles' : 'Sails'}>
        <h2>{fr ? 'Voiles' : 'Sails'}</h2>
        <div className="control-panel-content inline-sails">
          {displayedSails.map((id) => {
            const sail = sails.find((item) => item.id === id)
            return sail && <ToggleField checked={selectedSails.has(sail.id)} color={sail.color} id={`sail-${sail.id}`} key={sail.id} label={getSailName(sail.id, locale)} onChange={(checked) => onSailChange(sail.id, checked)} />
          })}
        </div>
      </section>
      <section className="control-panel display-panel" aria-label={fr ? 'Modes d’affichage' : 'Display modes'}>
        {extraModeControl}
      </section>
    </section>
  </>
}
