import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HelpCircle, Moon, Sun, RotateCcw } from 'lucide-react';
import { StreakBadge } from './StreakBadge';
import { HelpModal } from './HelpModal';

type Props = { streak: number; onToggleTheme: () => void; onReset?: () => void };

export function Header({ streak, onToggleTheme, onReset }: Props) {
  const [help, setHelp] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  
  const handleThemeToggle = () => {
    setIsDark(!isDark);
    onToggleTheme();
  };
  
  const handleReset = () => {
    if (confirm('Reset all progress and start over? This cannot be undone.')) {
      onReset?.();
      window.location.reload();
    }
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'clamp(4px, 0.8vh, 6px)',
      padding: 'clamp(8px, 1.2vh, 10px) clamp(12px, 2.5vw, 16px)',
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
      boxShadow: '0 2px 12px rgba(13, 127, 108, 0.12)',
      borderBottom: '1px solid rgba(255,255,255,0.2)',
      flexShrink: 0,
      position: 'relative',
    }}>
      {/* Top right icons */}
      <div style={{
        position: 'absolute',
        top: 'clamp(6px, 1vh, 8px)',
        right: 'clamp(8px, 2vw, 12px)',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}>
        <button onClick={() => setHelp(true)} style={{
          border: 'none',
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          padding: 4,
          borderRadius: 6,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
        }} title="Help">
          <HelpCircle size={16} strokeWidth={2.5} />
        </button>
        {onReset && (
          <button onClick={handleReset} style={{
            border: 'none',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            padding: 4,
            borderRadius: 6,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }} title="Reset Progress">
            <RotateCcw size={16} strokeWidth={2.5} />
          </button>
        )}
        <button onClick={handleThemeToggle} style={{
          border: 'none',
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          padding: 4,
          borderRadius: 6,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
        }} title="Toggle theme">
          {isDark ? <Sun size={16} strokeWidth={2.5} /> : <Moon size={16} strokeWidth={2.5} />}
        </button>
      </div>
      
      {/* Centered logo and title */}
      <Link to="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(6px, 1.2vw, 10px)',
        textDecoration: 'none',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 'clamp(24px, 5vw, 32px)',
          lineHeight: 1,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
        }}>🕊️</div>
        <div>
          <div style={{
            fontWeight: 800,
            fontSize: 'clamp(16px, 3.5vw, 20px)',
            color: 'white',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            Seerah Daily 
          </div>
        </div>
        <StreakBadge count={streak} />
      </Link>

      {/* Sub navigation */}
      <nav style={{
        display: 'flex',
        gap: 8,
        marginTop: 6,
      }}>
        <Link to="/" style={{
          padding: '6px 10px',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.45)',
          color: 'white',
          textDecoration: 'none',
          background: isActive('/') ? 'rgba(0,0,0,0.12)' : 'transparent',
          fontWeight: 700,
          fontSize: 12,
        }}>Daily</Link>
        <Link to="/practice" style={{
          padding: '6px 10px',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.45)',
          color: 'white',
          textDecoration: 'none',
          background: isActive('/practice') ? 'rgba(0,0,0,0.12)' : 'transparent',
          fontWeight: 700,
          fontSize: 12,
        }}>Practice</Link>
      </nav>

      <HelpModal open={help} onClose={() => setHelp(false)}>
        <p>Answer one Seerah question each day. Select an option and press Enter or Submit to reveal the answer.</p>
        <ul>
          <li>Use keys 1–4 to select options</li>
          <li>Build your streak with consecutive correct days</li>
          <li>Practice previous questions anytime</li>
        </ul>
      </HelpModal>
    </header>
  );
}


