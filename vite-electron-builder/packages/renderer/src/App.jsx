// src/App.jsx
import { useMemo, useState } from 'react'
import './App.css'

import PoissonDemo from './components/Poisson Graph/PoissonDemo'
import PoissonPieChart from './components/Poisson Pie Chart/PoissonPieChart'
import InputField from './components/Input Fields/InputField'
import OutputField from './components/Output Fields/OutputField'
import Graph from './components/Graph/Graph'
import PopUp from './components/Pop Up/PopUp' // keep this path if your folder name has a space

export default function App() {
  // ✅ missing state restored
  const [lambda, setLambda] = useState(3)
  const [doubTime, setDoubTime] = useState(27.7)

  const [showAssumptions, setShowAssumptions] = useState(false)
  const [cellDensity, setCellDensity] = useState(3e6)
  const [burstSize, setBurstSize] = useState(100)

  const {
    day5CellDensity,
    infectionEfficiencyDay5,
    nonProductiveCellsDay7,
    projectedYieldDay7,
  } = useMemo(() => {
    const INFECTION_HOUR = 120
    const FINAL_HOUR = 168

    const growth = (N0, hours, dt) =>
      (Number.isFinite(N0) && Number.isFinite(hours) && Number.isFinite(dt) && dt > 0)
        ? N0 * Math.pow(2, hours / dt)
        : NaN

    const N5 = growth(cellDensity, INFECTION_HOUR, doubTime)

    const infFrac = (Number.isFinite(lambda) && lambda >= 0) ? 1 - Math.exp(-lambda) : NaN
    const uninfFrac = Number.isFinite(infFrac) ? (1 - infFrac) : NaN

    const initInfCd   = (Number.isFinite(N5) && Number.isFinite(infFrac))   ? N5 * infFrac   : NaN
    const initUninfCd = (Number.isFinite(N5) && Number.isFinite(uninfFrac)) ? N5 * uninfFrac : NaN

    const gf = (Number.isFinite(doubTime) && doubTime > 0)
      ? Math.pow(2, (FINAL_HOUR - INFECTION_HOUR) / doubTime)
      : NaN
    const finUninfCd = (Number.isFinite(initUninfCd) && Number.isFinite(gf))
      ? initUninfCd * gf
      : NaN

    const denom = (Number.isFinite(finUninfCd) && Number.isFinite(initInfCd))
      ? (finUninfCd + initInfCd)
      : NaN
    const nonProdFrac = (Number.isFinite(finUninfCd) && Number.isFinite(denom) && denom > 0)
      ? (finUninfCd / denom)
      : NaN

    const yieldVpPerMl = (Number.isFinite(initInfCd) && Number.isFinite(burstSize))
      ? (initInfCd * burstSize)
      : NaN

    return {
      day5CellDensity: N5,
      infectionEfficiencyDay5: infFrac,
      nonProductiveCellsDay7: nonProdFrac,
      projectedYieldDay7: yieldVpPerMl,
    }
  }, [lambda, doubTime, cellDensity, burstSize])

  return (
    <main className="page">
      {/* Assumptions popup trigger */}
      <div className="content" style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="show-assumptions"
          onClick={() => setShowAssumptions(true)}>Show Assumptions</button>
      </div>

      <PopUp open={showAssumptions} onClose={() => setShowAssumptions(false)} />

      {/* 70%: Graph section */}
      <section className="section section--graph">
        <div className="content">
          <div className="graph-stack">
            <Graph
              lambda={lambda}
              doubTime={doubTime}
              cellDensity={cellDensity}
              infectionHour={120}
              endHour={168}
              stepHours={6}
            />

            {/* Overlays inside the plot */}
            <div className="overlay-stack">
              <div className="overlay-card overlay-card--pie">
                <PoissonPieChart
                  lambda={lambda}
                  title="Infection Efficiency"
                  compact
                />
              </div>
              <div className="overlay-card overlay-card--demo">
                <PoissonDemo lambda={lambda} defaultX={0} compact />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 15%: Sliders section */}
      <section className="section section--inputs">
        <div className="content">
          <section className="inputs-card">
            <header className="inputs-card__header">
              <h3 className="inputs-card__title">Model Inputs</h3>
            </header>

            <div className="inputs-grid">
              <InputField
                label="Day 5 MOI (IU/cell)"
                value={lambda}
                onChange={setLambda}
                min={0.1}
                max={5.5}
                step={0.05}
                formatValue={(v) => v.toFixed(2)}
              />
              <InputField
                label="Cell Doubling Time (hours)"
                value={doubTime}
                onChange={setDoubTime}
                min={10}
                max={72}
                step={0.1}
                formatValue={(v) => `${v.toFixed(2)} h`}
              />
              <InputField
                label="Day 0 Cell Density (cells/mL)"
                value={cellDensity}
                onChange={setCellDensity}
                min={3e6}
                max={3e7}
                step={1e4}
                formatValue={(v) => v.toLocaleString()}
              />
              <InputField
                label="Day 7 Burst Size (vp/cell)"
                value={burstSize}
                onChange={setBurstSize}
                min={1}
                max={1000}
                step={1}
                formatValue={(v) => `${Math.round(v)}`}
              />
            </div>
          </section>
        </div>
      </section>

      {/* 15%: Outputs section */}
      <section className="section section--outputs">
        <div className="content">
          <OutputField
            title="Model Outputs"
            day5CellDensity={day5CellDensity}
            infectionEfficiencyDay5={infectionEfficiencyDay5}
            nonProductiveCellsDay7={nonProductiveCellsDay7}
            projectedYieldDay7={projectedYieldDay7}
            dense
          />
        </div>
      </section>
    </main>
  )
}

