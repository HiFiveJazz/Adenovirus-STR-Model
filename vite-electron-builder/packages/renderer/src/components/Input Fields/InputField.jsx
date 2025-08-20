import './CSS/InputField.css'

export default function InputField({
  label = 'λ (lambda)',
  value,
  onChange,
  min = 0.1,
  max = 18,
  step = 0.1,
}) {
  const handleChange = (e) => {
    const v = Number(e.target.value)
    if (Number.isFinite(v)) onChange(Math.min(max, Math.max(min, v)))
  }

  return (
    <div className="input-field">
      <label className="input-field__label">
        {label}: <span className="input-field__value">{value.toFixed(2)}</span>
      </label>
      <input
        className="input-field__range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
      />
      <div className="input-field__scale">
        <span>{min}</span>
        <span>…</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

