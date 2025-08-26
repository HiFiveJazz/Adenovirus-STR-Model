import { useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import PoissonDemo from './components/Poisson Graph/PoissonDemo'
import PoissonPieChart from './components/Poisson Pie Chart/PoissonPieChart'
import InputField from './components/Input Fields/InputField'
import OutputField from './components/Output Fields/OutputField'
import Graph from './components/Graph/Graph'



export default function App() {
  // controls
  const [lambda, setLambda] = useState(3)
  const [doubTime, setDoubTime] = useState(27.7)       // hours
  const [cellDensity, setCellDensity] = useState(3e6) // cells/mL (Day 0)
  const [burstSize, setBurstSize] = useState(100)     // vp/cell (Day 7)

  // ⬇️ Use the exact formula you gave for Day 5 Cell Density
  const {
    day5CellDensity,
    infectionEfficiencyDay5,
    nonProductiveCellsDay7, // fraction 0..1
    projectedYieldDay7,     // vp/mL
  } = useMemo(() => {
    const INFECTION_HOUR = 120; // hours
    const FINAL_HOUR = 168;     // hours

    const growth = (N0, hours, dt) =>
      (Number.isFinite(N0) && Number.isFinite(hours) && Number.isFinite(dt) && dt > 0)
        ? N0 * Math.pow(2, hours / dt)
        : NaN;

    // Day 5 density at infection time
    const N5 = growth(cellDensity, INFECTION_HOUR, doubTime);

    // Infection efficiency (fraction)
    const infFrac =
      (Number.isFinite(lambda) && lambda >= 0) ? 1 - Math.exp(-lambda) : NaN;
    const uninfFrac =
      (Number.isFinite(infFrac)) ? (1 - infFrac) : NaN;

    // Initial infected & uninfected at infection time
    const initInfCd   = (Number.isFinite(N5) && Number.isFinite(infFrac))   ? N5 * infFrac   : NaN;
    const initUninfCd = (Number.isFinite(N5) && Number.isFinite(uninfFrac)) ? N5 * uninfFrac : NaN;

    // Uninfected grow from 120h to 168h; infected assumed not to grow
    const gf = (Number.isFinite(doubTime) && doubTime > 0)
      ? Math.pow(2, (FINAL_HOUR - INFECTION_HOUR) / doubTime)
      : NaN;
    const finUninfCd = (Number.isFinite(initUninfCd) && Number.isFinite(gf))
      ? initUninfCd * gf
      : NaN;

    // Non-Productive Cells at end of run (fraction)
    const denom = (Number.isFinite(finUninfCd) && Number.isFinite(initInfCd))
      ? (finUninfCd + initInfCd)
      : NaN;
    const nonProdFrac = (Number.isFinite(finUninfCd) && Number.isFinite(denom) && denom > 0)
      ? (finUninfCd / denom)
      : NaN;

    // Projected Bioreactor Yield (vp/mL)
    const yieldVpPerMl = (Number.isFinite(initInfCd) && Number.isFinite(burstSize))
      ? (initInfCd * burstSize)
      : NaN;

    return {
      day5CellDensity: N5,
      infectionEfficiencyDay5: infFrac,
      nonProductiveCellsDay7: nonProdFrac, // fraction 0..1
      projectedYieldDay7: yieldVpPerMl,    // vp/mL
    };
  }, [lambda, doubTime, cellDensity, burstSize]);

  return (
    <>
      {/* Controls */}
      <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
      </div>

      {/* Outputs */}
      <OutputField
        title="Model Outputs"
        day5CellDensity={day5CellDensity}
        infectionEfficiencyDay5={infectionEfficiencyDay5}
        nonProductiveCellsDay7={nonProductiveCellsDay7}
        projectedYieldDay7={projectedYieldDay7}
      />

      {/* Visuals (driven by λ) */}
      <PoissonDemo lambda={lambda} defaultX={0} />
      <PoissonPieChart lambda={lambda} title="Infection Efficiency" />
      {/* <Graph */}
      {/*   lambda={lambda} */}
      {/*   doubTime={doubTime} */}
      {/*   cellDensity={cellDensity} */}
      {/*   infectionHour={120} */}
      {/*   endHour={168} */}
      {/*   stepHours={6} */}
      {/* /> */}
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
          // was: v => `${v.toFixed(0)} h`
          formatValue={(v) => `${v.toFixed(2)} h`}   // shows 27.70, matches the value used
        />

        <InputField
          label="Day 0 Cell Density (cells/mL)"
          value={cellDensity}
          onChange={setCellDensity}
          min={3e6}
          max={3e7}
          step={1e4}
          // avoid Math.round so we don't mask the true value
          formatValue={(v) => v.toLocaleString()}   // exact value shown with separators
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
    </>

  )
}

