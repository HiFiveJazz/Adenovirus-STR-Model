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

  return (
    <>
      {/* <div className="card poisson-card"> */}
      {/*   <label> */}
      {/*     x (non-negative integer):{' '} */}
      {/*     <input */}
      {/*       type="number" */}
      {/*       min="0" */}
      {/*       step="1" */}
      {/*       value={x} */}
      {/*       onChange={(e) => */}
      {/*         setX(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber) */}
      {/*       } */}
      {/*     /> */}
      {/*   </label> */}
      {/**/}
      {/*   <div> */}
      {/*     <strong>P(X = {x}, λ = {lambda.toFixed ? lambda.toFixed(2) : lambda})</strong> */}
      {/*     <div className="mono"> */}
      {/*       {Number.isNaN(value) ? '—' : `${(value * 100).toFixed(2)}%`} */}
      {/*     </div> */}
      {/*   </div> */}
      {/* </div> */}

      <h2 className="section-title">Percent of Cell Population (Day 5)</h2>

      <div className="poisson-chart">
        <ResponsiveContainer>
          <BarChart
            data={dist}
            layout="vertical"
            margin={{ top: 10, right: 80, bottom: 10, left: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" hide domain={[0, 'dataMax']} />
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
              {dist.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.k === 0 ? '#1f77b4' : '#ff7f0e'} />
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

