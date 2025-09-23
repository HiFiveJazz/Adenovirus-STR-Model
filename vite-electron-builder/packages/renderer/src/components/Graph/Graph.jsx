// src/components/Graph/Graph.jsx
import { useMemo } from 'react'
import './CSS/Graph.css'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Line,
} from 'recharts'

export default function Graph({
  lambda,
  doubTime,
  cellDensity,
  infectionHour = 120,     // 5.00 days (kept as-is for reference)
  endHour = 168,
  stepHours = 6,
  title = 'Cells Over Time',
}) {
  const data = useMemo(() => {
    const rows = []

    const infFrac = (Number.isFinite(lambda) && lambda >= 0) ? 1 - Math.exp(-lambda) : NaN
    const uninfFrac = Number.isFinite(infFrac) ? (1 - infFrac) : NaN

    const DT = (Number.isFinite(doubTime) && doubTime > 0) ? doubTime : NaN
    const N0 = (Number.isFinite(cellDensity) && cellDensity > 0) ? cellDensity : NaN

    // ⇩ New: infected “starts” at 5.25 days = 126 h
    const splitHour = infectionHour  // 0.25 day * 24 h = 6 h
    const popAtSplit = (Number.isFinite(N0) && Number.isFinite(DT))
      ? N0 * Math.pow(2, splitHour / DT)
      : NaN

    for (let h = 0; h <= endHour; h += stepHours) {
      let uninfected, infected

      if (h <= splitHour) {
        // Before split: everyone is still “uninfected”
        uninfected = (Number.isFinite(N0) && Number.isFinite(DT))
          ? N0 * Math.pow(2, h / DT)
          : NaN
        infected = 0
      } else {
        // After split:
        // Uninfected keep doubling from the uninfected portion at split
        const uninfAtSplit = (Number.isFinite(popAtSplit) && Number.isFinite(uninfFrac))
          ? popAtSplit * uninfFrac
          : NaN
        uninfected = (Number.isFinite(uninfAtSplit) && Number.isFinite(DT))
          ? uninfAtSplit * Math.pow(2, (h - splitHour) / DT)
          : NaN

        // Infected start at split, then decay 7%/day
        const infAtSplit = (Number.isFinite(popAtSplit) && Number.isFinite(infFrac))
          ? popAtSplit * infFrac
          : NaN
        const daysSinceSplit = (h - splitHour) / 24
        infected = (Number.isFinite(infAtSplit))
          ? infAtSplit * Math.pow(0.93, daysSinceSplit)
          : NaN
      }

      rows.push({
        hour: h,
        day: h / 24,
        uninfected,
        infected,
        total: (Number.isFinite(uninfected) && Number.isFinite(infected)) ? (uninfected + infected) : NaN,
      })
    }
    return rows
  }, [lambda, doubTime, cellDensity, infectionHour, endHour, stepHours])

  return (
    <div className="graph-card">
      <h2 className="graph-title">{title}</h2>
      <div className="graph-container">

        {/* <ResponsiveContainer> */}
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 24, bottom: 10, left: 16 }}
          >
            <defs>
              <linearGradient id="fillUninf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1f77b4" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#1f77b4" stopOpacity={0.15} />
              </linearGradient>
              <linearGradient id="fillInf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff7f0e" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#ff7f0e" stopOpacity={0.15} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="day"
              type="number"
              domain={[0, endHour / 24]}
              tickCount={8}
              tickFormatter={(d) => d.toFixed(1)}
              label={{ value: 'Days', position: 'insideBottom', offset: -4 }}
            />

            {/* Y axis in millions */}
            <YAxis
              tickFormatter={(v) => (Number.isFinite(v) ? (v / 1_000_000).toFixed(1) : '')}
              label={{
                value: 'Cells/mL (millions)',
                angle: -90, position: 'insideLeft',
                dy: 50,
                dx: -10,
              }}
            />

            <Tooltip
              formatter={(v, name) => [Math.round(v).toLocaleString(), name]}
              labelFormatter={(label) => `Day ${label.toFixed(2)}`}
            />
            <Legend />

            {/* ⇩ Move the vertical marker to 5.25 days */}
            <ReferenceLine
              x={(infectionHour) / 24}
              stroke="#8884d8"
              strokeDasharray="4 4"
              label={{ value: 'Infection Begins', position: 'top' }}
            />

            {/* Stacked areas */}
            <Area
              type="monotone"
              dataKey="uninfected"
              name="Uninfected"
              stackId="cells"
              stroke="#1f77b4"
              fill="url(#fillUninf)"
              isAnimationActive
              animationDuration={500}
              animationEasing="ease-in-out"
            />
            <Area
              type="monotone"
              dataKey="infected"
              name="Infected"
              stackId="cells"
              stroke="#ff7f0e"
              fill="url(#fillInf)"
              isAnimationActive
              animationDuration={500}
              animationEasing="ease-in-out"
            />

            {/* Optional thin line for total */}
            <Line
              type="monotone"
              dataKey="total"
              name="Total Cells"
              stroke="#333"
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={500}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

