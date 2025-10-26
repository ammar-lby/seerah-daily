import { useState } from 'react';
import { Link } from 'react-router-dom';
import { StreakBadge } from './StreakBadge';
import { HelpModal } from './HelpModal';

type Props = { streak: number; onToggleTheme: () => void };

export function Header({ streak, onToggleTheme }: Props) {
  const [help, setHelp] = useState(false);
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: '12px 24px',
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-teal) 100%)',
      boxShadow: '0 2px 8px var(--shadow)',
      borderBottom: '2px solid var(--secondary)',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
        <div style={{
          width: 36,
          height: 36,
          background: 'var(--secondary)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
        }}>☪</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, color: 'white' }}>
            Seerah Daily Quiz
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>
            Learn the Life of the Prophet ﷺ
          </div>
        </div>
      </Link>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link to="/practice" style={{
          color: 'white',
          padding: '8px 14px',
          borderRadius: 8,
          fontSize: 14,
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}>Practice</Link>
        <button onClick={() => setHelp(true)} style={{
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.15)',
          color: 'white',
          padding: '8px 14px',
          borderRadius: 8,
          fontSize: 14,
          cursor: 'pointer',
        }}>Help</button>
        <StreakBadge count={streak} />
        <button onClick={onToggleTheme} style={{
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.15)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 16,
        }}>◐</button>
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


