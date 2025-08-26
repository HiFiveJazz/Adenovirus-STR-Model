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

export default function PoissonDemo({ lambda = 3, defaultX = 0 }) {
  const [x, setX] = useState(defaultX)

  const value = useMemo(() => {
    const xi = Number(x)
    const lam = Number(lambda)
    if (!Number.isFinite(xi) || xi < 0 || Math.floor(xi) !== xi) return NaN
    if (!Number.isFinite(lam) || lam <= 0) return NaN
    return poisson(xi, lam)
  }, [x, lambda])

  // k = 0..12, store percent values (p * 100)
  const dist = useMemo(() => {
    const lam = Number(lambda)
    if (!Number.isFinite(lam) || lam <= 0) return []
    return Array.from({ length: 13 }, (_, k) => ({
      k,
      pPct: poisson(k, lam) * 100,
    }))
  }, [lambda])

  // Colors from CSS variables (styling lives in CSS)
  const k0Color =
    getComputedStyle(document.documentElement)
      .getPropertyValue('--poisson-k0')
      ?.trim() || '#1f77b4'
  const kNColor =
    getComputedStyle(document.documentElement)
      .getPropertyValue('--poisson-kN')
      ?.trim() || '#ff7f0e'


  function YAxisTitle({ viewBox }) {
    const { x, y, height } = viewBox || {};
    const cx = (x ?? 0) - 36;            // how far left from the axis line
    const cy = (y ?? 0) + (height ?? 0) / 2; // vertical center of the axis
    return (
      <text
        x={cx}
        y={cy}
        transform={`rotate(-90, ${cx}, ${cy})`}
        textAnchor="middle"
        dominantBaseline="middle"
        className="y-axis-title"
      >
        Infectious Events
      </text>
    );
  }

  return (
    <>
      <h2 className="section-title">Percent of Cell Population (Day 5)</h2>

      <div className="poisson-chart">
        <div className="poisson-chart-inner">
          <ResponsiveContainer>
            <BarChart
              data={dist}
              layout="vertical"
              /* Give the SVG room for the left axis label & right value labels */
              margin={{ top: 0, right: 30, bottom: 0, left: 0 }}
            >
              <CartesianGrid horizontal={false} vertical={false} strokeDasharray="3 3" />
              <XAxis
                type="number"
                // tickLine={false}
                // axisLine={false}
                // tick = {false}
                hide
                domain={[0, 'dataMax']}
              />
              <YAxis
                type="category"
                dataKey="k"
                width={50} /* reserve space for ticks + the rotated label */
                // tickLine={false}
                axisLine={false}
                label={{
                  value: 'Infectious Events',  // shorter label helps in 200px tall charts
                  angle: -90,
                  position: 'insideLeft',
                  offset: 20,                  // pushes text off the axis so it centers nicely
                  dy: 60,
                }}
              />
              <Tooltip
                formatter={(v) => [`${Number(v).toFixed(2)}%`, 'Percent']}
                labelFormatter={(label) => `k = ${label}`}
              />
              <Bar dataKey="pPct">
                {dist.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.k === 0 ? k0Color : kNColor} />
                ))}
                <LabelList
                  dataKey="pPct"
                  position="right"
                  offset={8} /* nudge the label inside the margin so it doesn't clip */
                  formatter={(v) => `${Number(v).toFixed(2)}%`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}

