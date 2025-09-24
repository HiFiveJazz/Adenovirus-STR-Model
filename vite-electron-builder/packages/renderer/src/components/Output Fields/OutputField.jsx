import './CSS/OutputField.css'

function fmtInt(n) {
  if (!Number.isFinite(n)) return '—'
  return Math.round(n).toLocaleString()
}
function fmtPct(p) {
  if (!Number.isFinite(p)) return '—'
  return `${(p * 100).toFixed(2)}%`
}
function fmtSci(n) {
  if (!Number.isFinite(n)) return '—'
  if (Math.abs(n) >= 1e7) return n.toExponential(3)
  return Math.round(n).toLocaleString()
}

export default function OutputField({
  day5CellDensity,            // number (cells/mL)
  infectionEfficiencyDay5,    // fraction (0..1)
  nonProductiveCellsDay7,     // fraction (0..1)
  projectedYieldDay7,         // number (vp/mL)
  title = 'Outputs',
  dense = true,               // compact by default
}) {
  return (
    <section
      className={`output-card ${dense ? 'output-card--dense' : ''}`}
      aria-labelledby="output-title"
    >
      <header className="output-header">
        <h2 className="output-title" id="output-title">{title}</h2>
      </header>

      <div className="output-grid">
        <div className="output-row">
          <div className="output-label">Cell Density (Day 5)</div>
          <div className="output-value">
            {fmtInt(day5CellDensity)} <span className="unit">cells/mL</span>
          </div>
        </div>

        <div className="output-row">
          <div className="output-label">Infection Efficiency (Day 5)</div>
          <div className="output-value">{fmtPct(infectionEfficiencyDay5)}</div>
        </div>

        <div className="output-row">
          <div className="output-label">Projected Yield (Day 7)</div>
          <div className="output-value">
            {fmtSci(projectedYieldDay7)} <span className="unit">vp/mL</span>
          </div>
        </div>

        <div className="output-row">
          <div className="output-label">Non-Productive Cells (Day 7)</div>
          <div className="output-value">{fmtPct(nonProductiveCellsDay7)}</div>
        </div>

      </div>
    </section>
  )
}

