import { Route, Routes, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import DailyQuiz from './pages/DailyQuiz'
import Practice from './pages/Practice'

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-white/10">
        <div className="container-page py-4 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold heading-gradient">Seerah Daily Quiz</span>
          </NavLink>
          <nav className="flex gap-3 text-sm">
            <NavLink to="/" className={({isActive}) => `btn-outline px-3 py-1.5 rounded-md ${isActive ? 'bg-white/10' : ''}`}>Home</NavLink>
            <NavLink to="/daily" className={({isActive}) => `btn-outline px-3 py-1.5 rounded-md ${isActive ? 'bg-white/10' : ''}`}>Daily</NavLink>
            <NavLink to="/practice" className={({isActive}) => `btn-outline px-3 py-1.5 rounded-md ${isActive ? 'bg-white/10' : ''}`}>Practice</NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container-page">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/daily" element={<DailyQuiz />} />
            <Route path="/practice" element={<Practice />} />
          </Routes>
        </div>
      </main>

      <footer className="py-6 border-t border-white/10 text-center text-xs text-white/70">
        <div className="container-page">
          <p>Made for daily Seerah learning. Allahumma salli 'ala Muhammad ﷺ.</p>
        </div>
      </footer>
    </div>
  )
}


