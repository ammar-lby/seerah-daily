import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HelpCircle, Moon, Sun, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { StreakBadge } from './StreakBadge';
import { HelpModal } from './HelpModal';
import { useXP } from '../hooks/useXP';
import { isSoundEnabled, setSoundEnabled } from '../lib/sound';

type Props = { streak: number; onToggleTheme: () => void; onReset?: () => void };

export function Header({ streak, onToggleTheme, onReset }: Props) {
  const [help, setHelp] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [sound, setSound] = useState<boolean>(isSoundEnabled());
  const location = useLocation();
  const { xp } = useXP();
  
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
  
  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    setSoundEnabled(next);
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'clamp(2px, 0.5vh, 4px)',
      padding: 'clamp(6px, 1vh, 8px) clamp(12px, 2.5vw, 16px)',
      paddingTop: 'clamp(22px, 5.5vh, 34px)',
      background: 'linear-gradient(135deg, var(--header-start) 0%, var(--header-end) 100%)',
      boxShadow: '0 2px 12px rgba(13, 127, 108, 0.12)',
      borderBottom: '1px solid rgba(255,255,255,0.2)',
      flexShrink: 0,
      position: 'relative',
    }}>
      {/* Right controls - pinned to header top-right (all screens) */}
      <div style={{
        position: 'absolute',
        top: 'clamp(6px, 1vh, 8px)',
        right: 'clamp(8px, 2vw, 12px)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <button onClick={toggleSound} style={{
          border: 'none',
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          padding: 6,
          borderRadius: 8,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
        }} title={sound ? 'Sound on' : 'Sound off'}>
          {sound ? <Volume2 size={18} strokeWidth={2.5} /> : <VolumeX size={18} strokeWidth={2.5} />}
        </button>
        <button onClick={() => setHelp(true)} style={{
          border: 'none',
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          padding: 6,
          borderRadius: 8,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
        }} title="Help">
          <HelpCircle size={18} strokeWidth={2.5} />
        </button>
        {onReset && (
          <button onClick={handleReset} style={{
            border: 'none',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            padding: 6,
            borderRadius: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }} title="Reset Progress">
            <RotateCcw size={18} strokeWidth={2.5} />
          </button>
        )}
        <button onClick={handleThemeToggle} style={{
          border: 'none',
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          padding: 6,
          borderRadius: 8,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
        }} title="Toggle theme">
          {isDark ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
        </button>
      </div>
      {/* Top-left (mobile): XP above Streak */}
      <div className="mobile-only" style={{
        position: 'absolute',
        top: 'clamp(6px, 1vh, 8px)',
        left: 'clamp(8px, 2vw, 12px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 2,
        maxWidth: '70vw',
      }}>
        <div className="xp-chip" style={{
          padding: '2px 8px',
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.4)',
          color: 'white',
          fontWeight: 800,
          fontSize: 12,
          opacity: 0.95,
        }}>XP: {xp}</div>
        <div style={{ marginTop: 4 }}>
          <StreakBadge count={streak} />
        </div>
      </div>
      {/* Title row wrapper: centers title */}
      <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', marginTop: 'clamp(6px, 1.2vh, 10px)' }}>
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
              Seerahly
            </div>
          </div>
          <div className="desktop-only">
            <StreakBadge count={streak} />
          </div>
          <div className="xp-chip desktop-only" style={{
            marginLeft: 8,
            padding: '2px 8px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.4)',
            color: 'white',
            fontWeight: 800,
            fontSize: 12,
            opacity: 0.95,
          }}>XP: {xp}</div>
        </Link>
      </div>

      {/* Sub navigation */}
      <nav style={{
        display: 'flex',
        gap: 8,
        marginTop: 4,
      }}>
        <Link to="/" style={{
          padding: '8px 14px',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.45)',
          color: 'white',
          textDecoration: 'none',
          background: isActive('/') ? 'rgba(0,0,0,0.12)' : 'transparent',
          fontWeight: 700,
          fontSize: 13,
        }}>Daily</Link>
        <Link to="/practice" style={{
          padding: '8px 14px',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.45)',
          color: 'white',
          textDecoration: 'none',
          background: isActive('/practice') ? 'rgba(0,0,0,0.12)' : 'transparent',
          fontWeight: 700,
          fontSize: 13,
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


