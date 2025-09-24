// src/components/Graph/Graph.jsx
import { useMemo, memo, useEffect, useRef, useState } from 'react'
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

const CHART_MARGIN = { top: 10, right: 24, bottom: 10, left: 16 }

const CustomLegend = memo(function CustomLegend({ payload, dx = 0, dy = 0 }) {
  return (
    <div
      style={{
        position: 'relative',
        transform: `translate(${dx}px, ${dy}px)`,
        display: 'flex',
        gap: 16,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '0.85rem',
        lineHeight: 1,
      }}
    >
      {payload?.map((item) => (
        <div key={item.value} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 10, height: 10, borderRadius: '50%',
              background: item.color, display: 'inline-block'
            }}
          />
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  )
})

export default function Graph({
  lambda,
  doubTime,
  cellDensity,
  infectionHour = 120,
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

    const splitHour = infectionHour
    const popAtSplit = (Number.isFinite(N0) && Number.isFinite(DT))
      ? N0 * Math.pow(2, splitHour / DT)
      : NaN

    for (let h = 0; h <= endHour; h += stepHours) {
      let uninfected, infected

      if (h <= splitHour) {
        uninfected = (Number.isFinite(N0) && Number.isFinite(DT))
          ? N0 * Math.pow(2, h / DT)
          : NaN
        infected = 0
      } else {
        const uninfAtSplit = (Number.isFinite(popAtSplit) && Number.isFinite(uninfFrac))
          ? popAtSplit * uninfFrac
          : NaN
        uninfected = (Number.isFinite(uninfAtSplit) && Number.isFinite(DT))
          ? uninfAtSplit * Math.pow(2, (h - splitHour) / DT)
          : NaN

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
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart
            data={data}
            margin={CHART_MARGIN}
            // Optional: disable any chart-level animation too
            isAnimationActive={false}
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
              label={{ value: 'Days', position: 'insideBottom', offset: -2 }}
            />

            <YAxis
              tickFormatter={(v) => (Number.isFinite(v) ? (v / 1_000_000).toFixed(1) : '')}
              label={{
                value: 'Cells/mL (millions)',
                angle: -90, position: 'insideLeft',
                dy: 50, dx: -50,
              }}
            />

            <Tooltip
              wrapperStyle={{ zIndex: 9999 }}
              contentStyle={{
                background: 'rgba(255,255,255,0.96)',
                border: '1px solid rgba(0,0,0,0.15)',
                borderRadius: 8,
                color: '#111',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              }}
              labelStyle={{ color: '#111', fontWeight: 600 }}
              itemStyle={{ color: '#111' }}
              formatter={(v, name) => [Math.round(v).toLocaleString(), name]}
              labelFormatter={(label) => `Day ${label.toFixed(2)}`}
            />

            <Legend content={<CustomLegend dx={30} dy={15} />} />

            <ReferenceLine
              x={infectionHour / 24}
              stroke="#8884d8"
              strokeDasharray="4 4"
              label={{ value: 'Infection Begins', position: 'top' }}
            />

            {/* Disable series animations for instant updates */}
            <Area
              type="monotone"
              dataKey="uninfected"
              name="Uninfected"
              stackId="cells"
              stroke="#1f77b4"
              fill="url(#fillUninf)"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="infected"
              name="Infected"
              stackId="cells"
              stroke="#ff7f0e"
              fill="url(#fillInf)"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="total"
              name="Total Cells"
              stroke="#333"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

