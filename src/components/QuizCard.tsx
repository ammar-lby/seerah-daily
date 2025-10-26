import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Sparkles, Award, Zap } from 'lucide-react';
import type { Question } from '../types';
import { OptionButton } from './OptionButton';
import { shuffle } from '../lib/random';
import { getRandomCorrectMessage, getRandomIncorrectMessage } from '../lib/encouragement';

type Props = {
  question: Question;
  locked?: boolean;
  initialSelection?: string;
  onAnswered?: (selected: string, correct: boolean) => void;
  onNext?: () => void;
  isLastQuestion?: boolean;
};

export function QuizCard({ question, locked = false, initialSelection, onAnswered, onNext, isLastQuestion = false }: Props) {
  const [selected, setSelected] = useState<string | null>(initialSelection ?? null);
  const [submitted, setSubmitted] = useState<boolean>(!!initialSelection);
  const [shake, setShake] = useState(false);
  const [encouragement, setEncouragement] = useState<string>('');

  const shuffledOptions = useMemo(() => shuffle(question.options), [question.options]);

  const correct = submitted ? selected === question.correctAnswer : undefined;

  function onSubmit() {
    if (selected == null) return;
    const isCorrect = selected === question.correctAnswer;
    setSubmitted(true);
    setEncouragement(isCorrect ? getRandomCorrectMessage() : getRandomIncorrectMessage());
    onAnswered?.(selected, isCorrect);
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
      border: '2px solid var(--border)',
      borderRadius: 12,
      padding: 'clamp(16px, 3vw, 20px)',
      boxShadow: '0 4px 16px var(--shadow), inset 0 1px 0 rgba(255,255,255,0.7)',
      maxWidth: '100%',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden', /* contain animations to avoid horizontal flash */
    }}>
      <div style={{
        fontSize: 'clamp(11px, 2.3vw, 13px)',
        color: 'var(--secondary-dark)',
        marginBottom: 'clamp(8px, 1.5vh, 10px)',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        {question.category}
      </div>
      <h2 style={{
        margin: '0 0 clamp(14px, 2.5vh, 18px)',
        lineHeight: 1.45,
        fontSize: 'clamp(16px, 3.5vw, 19px)',
        fontWeight: 700,
        color: 'var(--text)',
        letterSpacing: '-0.02em',
      }}>
        {question.questionText}
      </h2>

      <div style={{ display: 'grid', gap: 'clamp(10px, 2vh, 12px)' }}>
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

      <div style={{ marginTop: 'clamp(14px, 2.5vh, 18px)' }}>
        {!submitted && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onSubmit}
              disabled={locked || selected == null}
              style={{
                padding: 'clamp(10px, 2vh, 12px) clamp(20px, 4vw, 28px)',
                borderRadius: 8,
                border: 'none',
                background: locked || selected == null 
                  ? 'var(--muted)' 
                  : 'var(--primary)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 'clamp(14px, 3vw, 16px)',
                cursor: locked || selected == null ? 'not-allowed' : 'pointer',
                boxShadow: locked || selected == null ? 'none' : '0 3px 10px var(--primary-20)',
              }}
            >
              Submit Answer
            </button>
          </div>
        )}

        {submitted && (
        <div className="bounce-in" style={{
          padding: 'clamp(12px, 2.5vh, 16px)',
          borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(6, 34, 38, 0.92) 0%, rgba(16, 53, 60, 0.92) 100%)',
          border: '1.5px solid rgba(255,255,255,0.12)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          position: 'relative',
        }}>
          {/* Streak indicator for correct answers */}
          {correct && (
            <div style={{
              position: 'absolute',
              top: 4,
              right: 4,
              display: 'flex',
              gap: 2,
            }}>
              <Sparkles size={12} color="var(--secondary)" className="pulse" />
              <Award size={12} color="var(--secondary)" />
            </div>
          )}
          
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 5,
          }}>
            {correct ? (
              <CheckCircle2 size={16} color="var(--primary)" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 0 }} />
            ) : (
              <XCircle size={16} color="#8b3a35" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 0 }} />
            )}
            <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 800,
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        color: correct ? 'var(--primary-dark)' : '#8b3a35',
                        marginBottom: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        letterSpacing: '-0.02em',
                      }}>
                        {encouragement}
                        {correct && <Zap size={14} color="var(--secondary)" fill="var(--secondary)" />}
                      </div>
                      <div style={{
                        color: '#ffffff',
                        lineHeight: 1.65,
                        fontSize: 'clamp(13px, 2.8vw, 15px)',
                        fontWeight: 500,
                      }}>
                        {question.explanation}
                      </div>
            </div>
          </div>
          
          {/* Progress indicator */}
          {correct && (
            <div style={{
              marginTop: 6,
              padding: '6px 8px',
              background: 'linear-gradient(90deg, rgba(13,127,108,0.12), rgba(212,165,116,0.12))',
              borderRadius: 999,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 'clamp(10px, 2.2vw, 12px)',
              color: 'var(--primary-dark)',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}>
              <Sparkles size={12} color="var(--secondary)" />
              <span>+10 XP · Keep your streak!</span>
            </div>
          )}
        </div>
        )}
      </div>

      {submitted && onNext && (
        <div style={{ marginTop: 'clamp(12px, 2.5vh, 16px)', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onNext}
            style={{
              padding: 'clamp(10px, 2vh, 12px) clamp(24px, 5vw, 32px)',
              borderRadius: 8,
              border: 'none',
              background: 'var(--primary)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 'clamp(14px, 3vw, 16px)',
              cursor: 'pointer',
              boxShadow: '0 3px 12px var(--primary-20)',
            }}
          >
            {isLastQuestion ? '✓ View Results' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  );
}


