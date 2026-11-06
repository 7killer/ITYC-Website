import type { ChartPrecision } from '../charts/chartPrecision'

export function ChartPrecisionButton({ value, onChange, locale, label }: {
  value: ChartPrecision
  onChange: (value: ChartPrecision) => void
  locale: 'fr' | 'en'
  label?: string
}) {
  const fr = locale === 'fr'
  const next = value === '0.1' ? '0.01' : '0.1'
  const currentValue = fr ? value.replace('.', ',') : value
  const nextValue = fr ? next.replace('.', ',') : next
  const name = label ?? (fr ? 'Précision du calcul' : 'Calculation precision')
  const description = fr
    ? `${name} : ${currentValue}. Passer à ${nextValue}.`
    : `${name}: ${currentValue}. Switch to ${nextValue}.`

  return <button aria-label={description} className="icon-button chart-precision-button" onClick={() => onChange(next)} title={description} type="button">{currentValue}</button>
}
