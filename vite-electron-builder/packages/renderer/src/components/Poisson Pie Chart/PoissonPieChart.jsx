import { useMemo } from 'react'
import { poisson } from '../Poisson Graph/calculations'
import './CSS/PoissonPieChart.css'

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts'

const RADIAN = Math.PI / 180;

// custom label: inside for normal slices; just outside for tiny ones
function renderSliceLabel({
  cx, cy, midAngle, innerRadius, outerRadius, percent, name,
}) {
  const pct = (percent * 100).toFixed(1) + '%'
  const tiny = percent < 0.06

  // position
  const r = tiny ? outerRadius + 16 : (innerRadius + outerRadius) / 2
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      textAnchor={x >= cx ? 'start' : 'end'}
      dominantBaseline="central"
      className={tiny ? 'pie-label pie-label--outside' : 'pie-label pie-label--inside'}
    >
      {tiny ? `${name}: ${pct}` : pct}
    </text>
  )
}

export default function PoissonPieChart({
  lambda = 3,
  title = 'Infection Effeciency',
}) {
  const data = useMemo(() => {
    const lam = Number(lambda)
    const p0 = Number.isFinite(lam) && lam >= 0 ? poisson(0, lam) : NaN
    const uninfectedPct = Number.isNaN(p0) ? 0 : Math.max(0, Math.min(100, p0 * 100))
    const infectedPct = 100 - uninfectedPct
    return [
      { name: 'Uninfected (k = 0)', value: uninfectedPct },
      { name: 'Infected (k ≥ 1)', value: infectedPct },
    ]
  }, [lambda])

  // use CSS vars directly (works in SVG fill)
  const COLORS = ['var(--pie-uninfected)', 'var(--pie-infected)']

  return (
    <div className="poisson-pie">
      <h2 className="section-title">{title}</h2>

      <div className="poisson-pie-chart">
        <ResponsiveContainer>
          <PieChart margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              // full pie (no donut)
              innerRadius={0}
              outerRadius="80%"
              // custom labels to avoid clipping
              label={renderSliceLabel}
              labelLine={false}
              isAnimationActive={false}
            >
              {data.map((entry, i) => (
                <Cell key={`slice-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip formatter={(v, n) => [`${Number(v).toFixed(2)}%`, n]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
