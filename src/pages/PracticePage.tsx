import { useMemo, useState } from 'react';
import { getAllPreviousQuestions, QUESTIONS } from '../data/questions';
import { todayISO } from '../lib/date';
import { QuizCard } from '../components/QuizCard';
import { ProgressBar } from '../components/ProgressBar';

export function PracticePage() {
  const [idx, setIdx] = useState(0);
  const today = todayISO();
  const items = useMemo(() => {
    const prev = getAllPreviousQuestions(today);
    return prev.length ? prev : QUESTIONS; // fallback to all for early days
  }, [today]);

  const q = items[idx];

  function prev() {
    setIdx((v) => Math.max(0, v - 1));
  }
  function next() {
    setIdx((v) => Math.min(items.length - 1, v + 1));
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 24px',
      maxWidth: 900,
      margin: '0 auto',
      width: '100%',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{
          margin: '0 0 12px',
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--primary)',
          textAlign: 'center',
        }}>
          Practice Mode
        </h3>
        <ProgressBar current={idx + 1} total={items.length} />
      </div>

      <QuizCard key={q.id} question={q} />

      <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'center' }}>
        <button
          onClick={prev}
          disabled={idx === 0}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: 'none',
            background: idx === 0 ? 'var(--muted)' : 'var(--primary)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 15,
            cursor: idx === 0 ? 'not-allowed' : 'pointer',
            opacity: idx === 0 ? 0.5 : 1,
          }}
        >
          ← Previous
        </button>
        <button
          onClick={next}
          disabled={idx === items.length - 1}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: 'none',
            background: idx === items.length - 1 ? 'var(--muted)' : 'var(--primary)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 15,
            cursor: idx === items.length - 1 ? 'not-allowed' : 'pointer',
            opacity: idx === items.length - 1 ? 0.5 : 1,
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}


