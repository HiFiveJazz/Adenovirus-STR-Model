import './CSS/OutputField.css'

function fmtInt(n) {
  if (!Number.isFinite(n)) return '—'
  // compact but readable for large counts
  return Math.round(n).toLocaleString()
}

function fmtPct(p) {
  if (!Number.isFinite(p)) return '—'
  return `${(p * 100).toFixed(2)}%`
}

function fmtSci(n) {
  if (!Number.isFinite(n)) return '—'
  // show vp/mL in scientific notation if very large, else with separators
  if (Math.abs(n) >= 1e7) return n.toExponential(3)
  return Math.round(n).toLocaleString()
}

export default function OutputField({
  day5CellDensity,            // number (cells/mL)
  infectionEfficiencyDay5,    // fraction (0..1)
  nonProductiveCellsDay7,     // number (cells/mL)
  projectedYieldDay7,         // number (vp/mL)
  title = 'Outputs',
}) {
  return (
    <div className="output-card">
      <h2 className="output-title">{title}</h2>
      <div className="output-grid">
        <div className="output-row">
          <div className="output-label">Day 5 Cell Density:</div>
          <div className="output-value">{fmtInt(day5CellDensity)} <span className="unit">cells/mL</span></div>
        </div>
        <div className="output-row">
          <div className="output-label">Infection Efficiency (Day 5):</div>
          <div className="output-value">{fmtPct(infectionEfficiencyDay5)}</div>
        </div>
        <div className="output-row">
          <div className="output-label">Non-Productive Cells (Day 7):</div>
          <div className="output-value">{fmtPct(nonProductiveCellsDay7)}</div>
        </div>
        <div className="output-row">
          <div className="output-label">Projected yield on Day 7 (vp/mL):</div>
          <div className="output-value">{fmtSci(projectedYieldDay7)} <span className="unit">vp/mL</span></div>
        </div>
      </div>
    </div>
  )
}
