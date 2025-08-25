
import { useMemo } from 'react'
import './CSS/Graph.css'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts'

/**
 * Plots uninfected cells over time.
 * Props:
 *  - lambda: number (MOI-style, used to compute infected fraction = 1 - e^-lambda)
 *  - doubTime: number (hours)
 *  - cellDensity: number (Day 0 cells/mL)
 *  - infectionHour: number (default 120)
 *  - endHour: number (default 168)
 *  - stepHours: number (default 6)
 */

export default function Graph({
  lambda,
  doubTime,
  cellDensity,
  infectionHour = 120,
  endHour = 168,
  stepHours = 6,
  title = 'Uninfected Cells Over Time',
}) {
  const data = useMemo(() => {
    const rows = []
    const infFrac = (Number.isFinite(lambda) && lambda >= 0) ? 1 - Math.exp(-lambda) : NaN
    const uninfFrac = Number.isFinite(infFrac) ? (1 - infFrac) : NaN

    const safeDT = (Number.isFinite(doubTime) && doubTime > 0) ? doubTime : NaN
    const safeN0 = (Number.isFinite(cellDensity) && cellDensity > 0) ? cellDensity : NaN

    const day5Pop =
      (Number.isFinite(safeN0) && Number.isFinite(safeDT))
        ? safeN0 * Math.pow(2, infectionHour / safeDT)
        : NaN

    for (let h = 0; h <= endHour; h += stepHours) {
      let uninfected
      if (h <= infectionHour) {
        uninfected =
          (Number.isFinite(safeN0) && Number.isFinite(safeDT))
            ? safeN0 * Math.pow(2, h / safeDT)
            : NaN
      } else {
        // Uninfected at infection time, then continue doubling
        const uninfAtInfection =
          (Number.isFinite(day5Pop) && Number.isFinite(uninfFrac))
            ? day5Pop * uninfFrac // == day5Pop * Math.exp(-lambda)
            : NaN
        uninfected =
          (Number.isFinite(uninfAtInfection) && Number.isFinite(safeDT))
            ? uninfAtInfection * Math.pow(2, (h - infectionHour) / safeDT)
            : NaN
      }

      rows.push({
        hour: h,
        day: h / 24,
        uninfected,
      })
    }
    return rows
  }, [lambda, doubTime, cellDensity, infectionHour, endHour, stepHours])

  return (
    <div className="graph-card">
      <h2 className="graph-title">{title}</h2>
      <div className="graph-container">
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 10, right: 24, bottom: 10, left: 16 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              type="number"
              domain={[0, endHour / 24]}
              tickCount={8}
              tickFormatter={(d) => d.toFixed(1)}
              label={{ value: 'Days', position: 'insideBottom', offset: -4 }}
            />
            <YAxis
              tickFormatter={(v) => {
                if (!Number.isFinite(v)) return ''
                // compact formatting for large cell counts
                return v >= 1e7 ? `${(v / 1e6).toFixed(1)}M` :
                       v >= 1e4 ? `${Math.round(v).toLocaleString()}` :
                       Math.round(v).toString()
              }}
              label={{ value: 'Cells/mL (uninfected)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              formatter={(v, n) => {
                if (n === 'Uninfected Cells') {
                  return [Math.round(v).toLocaleString(), n]
                }
                return [v, n]
              }}
              labelFormatter={(label) => `Day ${label.toFixed(2)}`}
            />
            <Legend />
            {/* vertical marker at infection time (day 5) */}
            <ReferenceLine
              x={infectionHour / 24}
              stroke="#8884d8"
              strokeDasharray="4 4"
              label={{ value: 'Infection', position: 'top' }}
            />
            <Line
              type="monotone"
              dataKey="uninfected"
              name="Uninfected Cells"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
