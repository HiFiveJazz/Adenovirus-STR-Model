import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import PoissonDemo from './components/Poisson Graph/PoissonDemo'
import PoissonPieChart from './components/Poisson Pie Chart/PoissonPieChart'
import InputField from './components/Input Fields/InputField'

export default function App() {
  const [lambda, setLambda] = useState(3)

  return (
    <>
      {/* <div> */}
      {/*   <a href="https://vite.dev" target="_blank" rel="noreferrer"> */}
      {/*     <img src={viteLogo} className="logo" alt="Vite logo" /> */}
      {/*   </a> */}
      {/*   <a href="https://react.dev" target="_blank" rel="noreferrer"> */}
      {/*     <img src={reactLogo} className="logo react" alt="React logo" /> */}
      {/*   </a> */}
      {/* </div> */}

      {/* Slider to control λ */}

      {/* Pass λ down as a prop */}
      <PoissonDemo lambda={lambda} defaultX={0} />
      <PoissonPieChart lambda={lambda} title="Cell Infection Breakdown" />
      <InputField label="Day 5 MOI (IU/Cell)" value={lambda} onChange={setLambda} min={0.1} max={18} step={0.1} />
    </>
  )
}

