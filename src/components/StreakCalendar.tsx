import { todayISO } from '../lib/date';
import { useStreak } from '../hooks/useStreak';

type DayCell = { iso: string; correct: boolean };

export function StreakCalendar() {
  const { getAnswerForDate } = useStreak();
  const today = new Date(todayISO());
  const days: DayCell[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const ans = getAnswerForDate(iso);
    days.push({ iso, correct: !!ans?.correct });
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
      {days.map((day) => (
        <div key={day.iso} title={day.iso} aria-label={day.iso} style={{
          height: 18,
          borderRadius: 4,
          background: day.correct ? 'var(--success)' : 'var(--surface)',
          border: `1px solid ${day.correct ? 'var(--success)' : 'var(--border)'}`,
        }} />
      ))}
    </div>
  );
}


