import { useMemo, useState } from 'react'
import { poisson } from './calculations'

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

  const dist = useMemo(() => {
    const lam = Number(lambda)
    if (!Number.isFinite(lam) || lam <= 0) return []
    return Array.from({ length: 11 }, (_, k) => ({ k, p: poisson(k, lam) }))
  }, [lambda])

  return (
    <>
      <h1>Poisson demo (React + Electron)</h1>

      <div className="card" style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <label>
          x (non-negative integer):{' '}
          <input
            type="number"
            min="0"
            step="1"
            value={x}
            onChange={(e) => setX(Number.isNaN(e.target.valueAsNumber) ? '' : e.target.valueAsNumber)}
          />
        </label>

        <label>
          λ (lambda, &gt; 0):{' '}
          <input
            type="number"
            min="0"
            step="0.1"
            value={lambda}
            onChange={(e) => setLambda(Number.isNaN(e.target.valueAsNumber) ? '' : e.target.valueAsNumber)}
          />
        </label>

        <div>
          <strong>P(X = {x || 0}, λ = {lambda || 0})</strong>
          <div style={{ fontFamily: 'monospace' }}>
            {Number.isNaN(value) ? '—' : value.toFixed(12)}
          </div>
        </div>
      </div>

      <h2 style={{ marginTop: 24 }}>Distribution (k = 0..10)</h2>
      <table style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', paddingRight: 12 }}>k</th>
            <th style={{ textAlign: 'left' }}>P(X = k)</th>
          </tr>
        </thead>
        <tbody>
          {dist.map(({ k, p }) => (
            <tr key={k}>
              <td style={{ paddingRight: 12 }}>{k}</td>
              <td style={{ fontFamily: 'monospace' }}>{p.toFixed(12)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
