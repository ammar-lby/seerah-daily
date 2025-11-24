import * as React from 'react';
import { ShareResults } from './ShareResults';
import { StreakCalendar } from './StreakCalendar';
import { getTotalPoints } from '../lib/encouragement';

type Props = {
  correct: number;
  total: number;
  streak: number;
  dateISO: string;
  onRestart?: () => void;
};

export function ResultsSummary({ correct, total, streak, dateISO, onRestart }: Props) {
  const pct = Math.round((correct / total) * 100);
  const points = getTotalPoints(correct, streak);
  const isPerfect = correct === total;
  
  // Achievement badges
  const badges = [];
  if (isPerfect) badges.push({ emoji: '🏆', text: 'Perfect Score!' });
  if (streak >= 7) badges.push({ emoji: '🔥', text: '7-Day Streak!' });
  if (streak >= 30) badges.push({ emoji: '⭐', text: 'Month Warrior!' });
  if (pct >= 80) badges.push({ emoji: '🎯', text: 'Sharp Mind!' });

  return (
    <div style={{
      background: 'var(--panel)',
      border: '2px solid var(--border)',
      borderRadius: 16,
      padding: 'clamp(20px, 4vw, 28px)',
      boxShadow: '0 8px 24px var(--shadow)',
      maxWidth: 'min(520px, 90vw)',
      margin: '0 auto',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 'clamp(40px, 10vw, 56px)', marginBottom: 12 }}>
        {isPerfect ? '🎉' : correct >= 3 ? '✨' : '📚'}
      </div>
      
      <h2 style={{ margin: '0 0 8px', fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 800, letterSpacing: '-0.03em' }}>
        {isPerfect ? 'Masha\'Allah! Perfect!' : correct >= 3 ? 'Alhamdulillah! Great Job!' : 'Keep Learning!'}
      </h2>
      
      <p style={{ color: 'var(--muted)', marginBottom: 20, fontSize: 'clamp(13px, 3vw, 15px)', fontWeight: 500, lineHeight: 1.65 }}>
        {isPerfect 
          ? 'SubhanAllah! You\'re a true Seerah scholar! 🌟' 
          : correct >= 3
          ? 'Tabarak Allah! Your knowledge is growing! 💫'
          : 'No worries! Every scholar started somewhere! 💪'}
      </p>

      {badges.length > 0 && (
        <div style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 20,
        }}>
          {badges.map((badge, i) => (
            <div key={i} className="bounce-in" style={{
              padding: '6px 12px',
              background: 'var(--secondary-10)',
              border: '2px solid var(--secondary)',
              borderRadius: 999,
              fontSize: 'clamp(11px, 2.5vw, 13px)',
              fontWeight: 700,
              color: 'var(--secondary-dark)',
            }}>
              {badge.emoji} {badge.text}
            </div>
          ))}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
        gap: 'clamp(10px, 2vw, 14px)',
        marginBottom: 20,
        padding: '16px 0',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div>
          <div style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 700, color: 'var(--primary)' }}>{correct}/{total}</div>
          <div style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', color: 'var(--muted)' }}>Correct</div>
        </div>
        <div>
          <div style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 700, color: 'var(--secondary)' }}>{points}</div>
          <div style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', color: 'var(--muted)' }}>Points</div>
        </div>
        <div>
          <div style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 700, color: 'var(--primary)' }}>{pct}%</div>
          <div style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', color: 'var(--muted)' }}>Accuracy</div>
        </div>
        <div>
          <div style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 700, color: 'var(--primary)' }}>{streak}</div>
          <div style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', color: 'var(--muted)' }}>Streak</div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Last 7 days</div>
        <StreakCalendar />
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        {onRestart && (
          <button onClick={onRestart} style={{
            padding: 'clamp(10px, 2.5vw, 12px) clamp(16px, 4vw, 20px)',
            borderRadius: 10,
            border: '2px solid var(--primary)',
            background: 'var(--primary)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 'clamp(13px, 3vw, 15px)',
            cursor: 'pointer',
            boxShadow: '0 3px 12px var(--primary-20)'
          }}>
            📝 Review All Answers
          </button>
        )}
        <ShareResults dateISO={dateISO} correct={correct} total={total} streak={streak} points={points} accuracyPct={pct} />
      </div>

      <div style={{
        marginTop: 16,
        color: 'var(--muted)',
        fontSize: 'clamp(11px, 2.5vw, 13px)',
        padding: '10px',
        background: 'var(--surface)',
        borderRadius: 8,
      }}>
        🕐 Next quiz in <Countdown />
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

