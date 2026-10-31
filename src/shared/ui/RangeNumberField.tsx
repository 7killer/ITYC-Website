import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { useLocale } from '../i18n/LocaleContext'

type RangeNumberFieldProps = {
  id: string
  label: string
  shortLabel?: string
  max: number
  min: number
  onChange: (value: number) => void
  unit: string
  value: number
}

function clampToStep(value: number, min: number, max: number) {
  return Math.round(Math.min(max, Math.max(min, value)) * 10) / 10
}

export function RangeNumberField({ id, label, shortLabel, max, min, onChange, unit, value }: RangeNumberFieldProps) {
  const locale = useLocale()
  const [draft, setDraft] = useState(value.toFixed(1))
  const isEditing = useRef(false)
  const progress = `${Math.max(0, Math.min(100, (value - min) / (max - min) * 100))}%`

  useEffect(() => {
    if (!isEditing.current) setDraft(value.toFixed(1))
  }, [value])

  function updateDraft(raw: string) {
    if (!/^\d{0,3}([,.]\d?)?$/.test(raw)) return
    isEditing.current = true
    setDraft(raw)
    if (raw === '' || raw.endsWith('.') || raw.endsWith(',')) return

    const parsed = Number(raw.replace(',', '.'))
    if (Number.isFinite(parsed) && parsed >= min && parsed <= max) onChange(clampToStep(parsed, min, max))
  }

  function normalizeDraft() {
    const parsed = Number(draft.replace(',', '.'))
    isEditing.current = false
    if (!Number.isFinite(parsed)) {
      setDraft(value.toFixed(1))
      return
    }
    const normalized = clampToStep(parsed, min, max)
    onChange(normalized)
    setDraft(normalized.toFixed(1))
  }

  function changeWithKeyboard(delta: number) {
    const next = clampToStep(value + delta, min, max)
    isEditing.current = false
    setDraft(next.toFixed(1))
    onChange(next)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
      event.preventDefault()
      changeWithKeyboard(.1)
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
      event.preventDefault()
      changeWithKeyboard(-.1)
    } else if (event.key === 'PageUp') {
      event.preventDefault()
      changeWithKeyboard(1)
    } else if (event.key === 'PageDown') {
      event.preventDefault()
      changeWithKeyboard(-1)
    }
  }

  return (
    <label className="range-field" htmlFor={id}>
      <span title={shortLabel ? label : undefined}>{shortLabel ?? label}</span>
      <div className="range-input-row">
        <input
          aria-label={label}
          id={`${id}-number`}
          inputMode="decimal"
          onBlur={normalizeDraft}
          onChange={(event) => updateDraft(event.target.value)}
          onKeyDown={onKeyDown}
          pattern="[0-9]*[.,]?[0-9]?"
          type="text"
          value={draft}
        />
        <b>{locale === 'en' && unit === 'nds' ? 'kts' : unit}</b>
      </div>
      <input id={id} max={max} min={min} onChange={(event) => onChange(Number(event.target.value))} step=".1" style={{ '--range-progress': progress } as CSSProperties} type="range" value={value} />
    </label>
  )
}
