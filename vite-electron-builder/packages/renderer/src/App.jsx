import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PoissonDemo from './components/PoissonDemo'

export default function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <PoissonDemo defaultX={0} defaultLambda={3} />
    </>
  )
}

