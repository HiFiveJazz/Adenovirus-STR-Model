import { useMemo, useState } from 'react'
import { poisson } from './calculations'
import './CSS/Poisson.css'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
  Cell,
} from 'recharts'

export default function PoissonDemo({ lambda = 3, defaultX = 0, compact = false }) {
  const [x, setX] = useState(defaultX)

  const value = useMemo(() => {
    const xi = Number(x)
    const lam = Number(lambda)
    if (!Number.isFinite(xi) || xi < 0 || Math.floor(xi) !== xi) return NaN
    if (!Number.isFinite(lam) || lam <= 0) return NaN
    return poisson(xi, lam)
  }, [x, lambda])

  const dist = useMemo(() => {
    const lam = Number(lambda)
    if (!Number.isFinite(lam) || lam <= 0) return []
    return Array.from({ length: 13 }, (_, k) => ({
      k,
      pPct: poisson(k, lam) * 100,
    }))
  }, [lambda])

  const k0Color =
    getComputedStyle(document.documentElement).getPropertyValue('--poisson-k0')?.trim() || '#1f77b4'
  const kNColor =
    getComputedStyle(document.documentElement).getPropertyValue('--poisson-kN')?.trim() || '#ff7f0e'

  return (
    <div className={`poisson-card ${compact ? 'poisson-card--compact' : ''}`}>
      {/* Title: tiny caption in compact; full h2 otherwise */}
      {compact ? (
        <div className="poisson-mini-title">Cell Population (Day 5)</div>
      ) : (
        <h2 className="section-title">Cell Population (Day 5)</h2>
      )}

      <div className="poisson-chart">
        <div className="poisson-chart-inner">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dist}
              layout="vertical"
              margin={
                compact
                  // tighter margins; give a bit of left space for the vertical axis label
                  ? { top: 2, right: 30, bottom: 50, left: 12 }
                  : { top: 0, right: 30, bottom: 0, left: 0 }
              }
            >
              <CartesianGrid horizontal={false} vertical={false} strokeDasharray="3 3" />
              <XAxis type="number" hide domain={[0, 'dataMax']} />
              <YAxis
                type="category"
                dataKey="k"
                width={compact ? 34 : 50}   // a touch more than before so the label fits
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: compact ? 11 : 13 }}
                label={{
                  value: 'Infectious Events Per Cell',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 10,                 // small offset so it sits nicely
                  dy: 75,
                  dx: -5,
                  style: { fontSize: '0.8rem'},
                }}
              />
              <Tooltip
                formatter={(v) => [`${Number(v).toFixed(2)}%`, 'Percent']}
                labelFormatter={(label) => `k = ${label}`}
              />
              <Bar dataKey="pPct" barCategoryGap={compact ? '12%' : '10%'}>
                {dist.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.k === 0 ? k0Color : kNColor} />
                ))}
                <LabelList
                  dataKey="pPct"
                  position="right"
                  offset={compact ? 2 : 4}
                  formatter={(v) => `${Number(v).toFixed(2)}%`}
                  style={{ fontSize: compact ? '0.72rem' : '0.8rem', fontWeight: 300 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

