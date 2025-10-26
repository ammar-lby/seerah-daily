import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DailyPage } from './pages/DailyPage'
import { PracticePage } from './pages/PracticePage'
import { useStreak } from './hooks/useStreak'
import { Header } from './components/Header'
import './theme.css'

function App() {
  const { streak } = useStreak()

  function toggleTheme() {
    // For MVP, rely on prefers-color-scheme + simple toggle via data-theme
    const current = document.documentElement.getAttribute('data-theme')
    document.documentElement.setAttribute('data-theme', current === 'light' ? 'dark' : 'light')
  }

  return (
    <BrowserRouter>
      <Header streak={streak} onToggleTheme={toggleTheme} />
      <main className="container">
        <Routes>
          <Route path="/" element={<DailyPage />} />
          <Route path="/practice" element={<PracticePage />} />
        </Routes>
      </main>
      <footer style={{ textAlign: 'center', padding: 16, opacity: 0.8 }}>
        <small>Seerah Daily Quiz — learn a little, every day</small>
      </footer>
    </BrowserRouter>
  )
}

export default App
