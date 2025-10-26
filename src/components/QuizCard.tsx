import { useEffect, useMemo, useState } from 'react';
import type { Question } from '../types';
import { OptionButton } from './OptionButton';
import { shuffle } from '../lib/random';

type Props = {
  question: Question;
  locked?: boolean;
  initialSelection?: string;
  onAnswered?: (selected: string, correct: boolean) => void;
};

export function QuizCard({ question, locked = false, initialSelection, onAnswered }: Props) {
  const [selected, setSelected] = useState<string | null>(initialSelection ?? null);
  const [submitted, setSubmitted] = useState<boolean>(!!initialSelection);
  const [shake, setShake] = useState(false);

  const shuffledOptions = useMemo(() => shuffle(question.options), [question.options]);

  const correct = submitted ? selected === question.correctAnswer : undefined;

  function onSubmit() {
    if (selected == null) return;
    setSubmitted(true);
    onAnswered?.(selected, selected === question.correctAnswer);
  }

  // Keyboard shortcuts 1-4, Enter to submit
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (locked || submitted) return;
      const map: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3 };
      if (map[e.key] != null) {
        const i = map[e.key];
        const opt = shuffledOptions[i];
        if (opt) setSelected(opt);
      }
      if (e.key === 'Enter') {
        if (selected == null) {
          setShake(true);
          setTimeout(() => setShake(false), 300);
        } else {
          onSubmit();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [locked, submitted, shuffledOptions, selected]);

  return (
    <div className={`slide-up ${shake ? 'shake' : ''}`} style={{
      background: 'var(--panel)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '1.25rem',
      boxShadow: '0 4px 12px var(--shadow)',
      maxWidth: '100%',
      margin: '0 auto',
    }}>
      <div style={{
        fontSize: 12,
        color: 'var(--secondary)',
        marginBottom: 8,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      }}>
        {question.category}
      </div>
      <h2 style={{
        margin: '0 0 16px',
        lineHeight: 1.4,
        fontSize: 18,
        fontWeight: 600,
        color: 'var(--text)',
      }}>
        {question.questionText}
      </h2>

      <div style={{ display: 'grid', gap: 10 }}>
        {shuffledOptions.map((opt) => {
          let state: 'default' | 'selected' | 'correct' | 'incorrect' = 'default';
          if (submitted) {
            if (opt === question.correctAnswer) state = 'correct';
            else if (opt === selected) state = 'incorrect';
          } else if (opt === selected) state = 'selected';

          return (
            <OptionButton
              key={opt}
              state={state}
              disabled={locked || submitted}
              onClick={() => setSelected(opt)}
            >
              {opt}
            </OptionButton>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <button
          onClick={onSubmit}
          disabled={locked || submitted || selected == null}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: 'none',
            background: locked || submitted || selected == null 
              ? 'var(--muted)' 
              : 'var(--primary)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 15,
            cursor: locked || submitted || selected == null ? 'not-allowed' : 'pointer',
          }}
        >
          {submitted ? 'Submitted' : 'Submit Answer'}
        </button>
      </div>

      {submitted && (
        <div className="fade-in" style={{
          marginTop: 16,
          padding: '14px 16px',
          borderRadius: 10,
          background: correct ? 'var(--success-bg)' : 'var(--danger-bg)',
          border: `2px solid ${correct ? 'var(--success)' : 'var(--danger)'}`,
        }}>
          <div style={{
            fontWeight: 700,
            marginBottom: 8,
            fontSize: 15,
            color: correct ? 'var(--success)' : 'var(--danger)',
          }}>
            {correct ? 'Correct' : 'Incorrect'}
          </div>
          <div style={{ color: 'var(--text)', lineHeight: 1.6, fontSize: 14 }}>
            {question.explanation}
          </div>
        </div>
      )}
    </div>
  );
}


