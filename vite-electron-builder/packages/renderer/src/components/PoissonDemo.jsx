// src/components/PoissonDemo.jsx
import { useMemo, useState } from 'react'
import { poisson } from './calculations'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
  Cell,                // ⬅️ add this
} from 'recharts'

export default function PoissonDemo({ defaultX = 0, defaultLambda = 3 }) {
  const [x, setX] = useState(defaultX)
  const [lambda, setLambda] = useState(defaultLambda)

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

  return (
    <>
      <h1>Poisson demo (React + Electron)</h1>

      <div className="card" style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
        <label>
          x (non-negative integer):{' '}
          <input
            type="number"
            min="0"
            step="1"
            value={x}
            onChange={(e) =>
              setX(Number.isNaN(e.target.valueAsNumber) ? '' : e.target.valueAsNumber)
            }
          />
        </label>

        <label>
          λ (lambda, &gt; 0):{' '}
          <input
            type="number"
            min="0"
            step="0.1"
            value={lambda}
            onChange={(e) =>
              setLambda(Number.isNaN(e.target.valueAsNumber) ? '' : e.target.valueAsNumber)
            }
          />
        </label>

        <div>
          <strong>P(X = {x || 0}, λ = {lambda || 0})</strong>
          <div style={{ fontFamily: 'monospace' }}>
            {Number.isNaN(value) ? '—' : `${(value * 100).toFixed(2)}%`}
          </div>
        </div>
      </div>

      <h2 style={{ marginTop: 24 }}>Percent of Cell Population (Day 5)</h2>

      <div style={{ width: '100%', height: 480, maxWidth: 720 }}>
        <ResponsiveContainer>
          <BarChart
            data={dist}
            layout="vertical"
            margin={{ top: 10, right: 80, bottom: 10, left: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            {/* hidden x-axis (numeric), still used for scaling */}
            <XAxis type="number" hide domain={[0, 'dataMax']} />

            {/* y-axis categories (k) with custom label */}
            <YAxis
              type="category"
              dataKey="k"
              width={40}
              label={{
                value: 'Infectious Events per Cell',
                angle: -90,
                position: 'insideLeft',
              }}
            />

            <Tooltip
              formatter={(v) => [`${Number(v).toFixed(2)}%`, 'Percent']}
              labelFormatter={(label) => `k = ${label}`}
            />

            <Bar dataKey="pPct">
              {/* color k=0 blue, others orange */}
              {dist.map((entry, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={entry.k === 0 ? '#1f77b4' : '#ff7f0e'}
                />
              ))}
              <LabelList
                dataKey="pPct"
                position="right"
                formatter={(v) => `${Number(v).toFixed(2)}%`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

