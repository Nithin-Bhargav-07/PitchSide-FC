import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Matchday } from './pages/Matchday'
import { InPlay } from './pages/InPlay'
import { FullTime } from './pages/FullTime'
import { Dugout } from './pages/Dugout'
import { useStore } from './store/useStore'

function App() {
  const theme = useStore((state) => state.theme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light')
      root.classList.remove('dark')
    } else {
      root.classList.add('dark')
      root.classList.remove('light')
    }
  }, [theme])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/matchday" replace />} />
        <Route path="matchday" element={<Matchday />} />
        <Route path="inplay" element={<InPlay />} />
        <Route path="fulltime" element={<FullTime />} />
        <Route path="dugout" element={<Dugout />} />
        <Route path="*" element={<Navigate to="/matchday" replace />} />
      </Route>
    </Routes>
  )
}

export default App
