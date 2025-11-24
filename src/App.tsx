import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DailyPage } from './pages/DailyPage'
import { useStreak } from './hooks/useStreak'
import { Header } from './components/Header'
import './theme.css'
import { PracticePage } from './pages/PracticePage'

function App() {
  const { streak, resetAllData } = useStreak()

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme')
    document.documentElement.setAttribute('data-theme', current === 'light' ? 'dark' : 'light')
  }

  return (
    <BrowserRouter>
      <Header streak={streak} onToggleTheme={toggleTheme} onReset={resetAllData} />
      <main className="container">
        <Routes>
          <Route path="/" element={<DailyPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer style={{
        textAlign: 'center',
        padding: 'clamp(4px, 0.8vh, 6px)',
        fontSize: 'clamp(9px, 1.8vw, 10px)',
        color: 'var(--muted)',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
        flexShrink: 0,
      }}>
        New questions daily at midnight
      </footer>
    </BrowserRouter>
  )
}

export default App
