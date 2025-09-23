import './CSS/InputField.css'

let nextId = 0

export default function InputField({
  label = 'λ (lambda)',
  value,
  onChange,
  min = 0.05,
  max = 7,
  step = 0.1,
  formatValue = (v) => v.toFixed(2),
  dense = true,          // compact by default
  showScale = false,     // hide min/…/max row by default
}) {
  const id = `input-range-${++nextId}`

  const handleChange = (e) => {
    const v = Number(e.target.value)
    if (Number.isFinite(v)) onChange(Math.min(max, Math.max(min, v)))
  }

  return (
    <div className={`input-field ${dense ? 'input-field--dense' : ''}`}>
      <label className="input-field__label" htmlFor={id}>
        <span className="input-field__label-text">{label}</span>
        <span className="input-field__value">{formatValue(value)}</span>
      </label>

      <input
        id={id}
        className="input-field__range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        aria-label={label}
      />

      {showScale && (
        <div className="input-field__scale" aria-hidden="true">
          <span>{min}</span>
          <span>…</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  )
}

