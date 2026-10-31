import type { CSSProperties } from 'react'

type ToggleFieldProps = {
  checked: boolean
  color?: string
  id: string
  label: string
  onChange: (checked: boolean) => void
}

export function ToggleField({ checked, color, id, label, onChange }: ToggleFieldProps) {
  return (
    <label className="toggle-field" htmlFor={id} style={color ? { '--toggle-color': color } as CSSProperties : undefined}>
      <input
        checked={checked}
        id={id}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span aria-hidden="true" className="toggle-track"><span /></span>
      <span>{label}</span>
    </label>
  )
}
