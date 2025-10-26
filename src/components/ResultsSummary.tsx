import * as React from 'react';
import { ShareResults } from './ShareResults';
import { StreakCalendar } from './StreakCalendar';

type Props = {
  correct: number;
  total: number;
  streak: number;
  dateISO: string;
  onRestart?: () => void;
};

export function ResultsSummary({ correct, total, streak, dateISO, onRestart }: Props) {
  const pct = Math.round((correct / total) * 100);

  return (
    <div style={{
      background: 'var(--panel)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '1.5rem',
      boxShadow: '0 4px 12px var(--shadow)',
      maxWidth: 480,
      margin: '0 auto',
      textAlign: 'center',
    }}>
      <h2 style={{ margin: '0 0 16px', fontSize: 20 }}>
        Quiz Complete
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 20,
        padding: '16px 0',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>{correct}/{total}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Correct</div>
        </div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>{pct}%</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Accuracy</div>
        </div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>{streak}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Streak</div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Last 7 days</div>
        <StreakCalendar />
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <ShareResults correct={correct === total} streak={streak} questionDate={dateISO} />
        {onRestart && (
          <button onClick={onRestart} style={{
            padding: '8px 14px',
            borderRadius: 8,
            border: 'none',
            background: 'var(--primary)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
          }}>
            Review Answers
          </button>
        )}
      </div>

      <div style={{ marginTop: 16, color: 'var(--muted)', fontSize: 12 }}>
        Next quiz in <Countdown />
      </div>
    </div>
  );
}

function Countdown() {
  const [now, setNow] = React.useState(Date.now());
  const msToMidnight = React.useMemo(() => {
    const d = new Date();
    d.setHours(24, 0, 0, 0);
    return d.getTime() - now;
  }, [now]);
  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const s = Math.max(0, Math.floor(msToMidnight / 1000));
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return <span>{hh}:{mm}:{ss}</span>;
}

