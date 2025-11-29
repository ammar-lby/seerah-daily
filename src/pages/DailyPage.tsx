import { useMemo, useState, useEffect } from 'react';
import { QuizCard } from '../components/QuizCard';
import { ProgressBar } from '../components/ProgressBar';
import { ResultsSummary } from '../components/ResultsSummary';
import { getQuestionsByDate } from '../data/questions';
import { todayISO } from '../lib/date';
import { useStreak } from '../hooks/useStreak';
import { Confetti } from '../components/Confetti';
import type { Question } from '../types';

type QuestionState = {
  question: Question;
  selected: string | null;
  submitted: boolean;
  correct: boolean;
};

export function DailyPage() {
  const { recordAnswer, getAnswerForDate, streak } = useStreak();
  const iso = todayISO();
  const questions = useMemo(() => getQuestionsByDate(iso), [iso]);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [states, setStates] = useState<QuestionState[]>(() =>
    questions.map((q) => {
      const existing = getAnswerForDate(`${iso}-${q.id}`);
      return {
        question: q,
        selected: existing?.selected ?? null,
        submitted: !!existing,
        correct: existing?.correct ?? false,
      };
    })
  );
  const [confetti, setConfetti] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  const current = states[currentIdx];
  const totalCorrect = states.filter((s) => s.correct).length;
  const allAnswered = states.every((s) => s.submitted);

  function handleAnswer(selected: string, correct: boolean) {
    // Update state
    setStates((prev) =>
      prev.map((s, i) =>
        i === currentIdx ? { ...s, selected, submitted: true, correct } : s
      )
    );
    // Persist
    recordAnswer(`${iso}-${current.question.id}`, {
      questionId: current.question.id,
      selected,
      correct,
      timestamp: Date.now(),
    });
    if (correct) setConfetti((n) => n + 1);
  }

  function goToNext() {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      setShowResults(true);
    }
  }

  if (questions.length === 0) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}>
        <div>
          <h2 style={{ marginBottom: 12 }}>No quiz available today</h2>
          <p style={{ color: 'var(--muted)' }}>
            Check back tomorrow insha'Allah for your next daily quiz.
          </p>
        </div>
      </div>
    );
  }

  if (showResults && !reviewMode) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(16px, 3vh, 32px) clamp(12px, 3vw, 24px)',
      }}>
        <ResultsSummary
          correct={totalCorrect}
          total={questions.length}
          streak={streak}
          dateISO={iso}
          onRestart={() => { setReviewMode(true); setCurrentIdx(0); }}
        />
        <Confetti trigger={confetti} />
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: 'clamp(4px, 0.6vh, 6px) clamp(6px, 1.5vw, 10px)',
      maxWidth: 'min(900px, 100%)',
      margin: '0 auto',
      width: '100%',
      minHeight: 0,
      overflow: 'hidden',
      height: '100%',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'clamp(3px, 0.5vh, 5px)',
        gap: 'clamp(6px, 1.5vw, 8px)',
        flexWrap: 'wrap',
        flexShrink: 0,
      }}>
        <h3 style={{
          margin: 0,
          fontSize: 'clamp(12px, 2.6vw, 14px)',
          fontWeight: 600,
          color: reviewMode ? 'var(--secondary-dark)' : 'var(--primary)',
        }}>
          {reviewMode ? '📝 ' : ''} Q{currentIdx + 1}/{questions.length}
        </h3>
        <DailyTimer />
      </div>
      <div style={{ marginBottom: 'clamp(6px, 1vh, 10px)', flexShrink: 0 }}>
        <ProgressBar current={currentIdx + 1} total={questions.length} />
      </div>

      {reviewMode && (
        <div style={{
          display: 'flex',
          gap: 'clamp(6px, 2vw, 10px)',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 'clamp(6px, 1vh, 10px)',
        }}>
          <button
            onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
            style={{
              padding: 'clamp(7px, 1.6vh, 9px) clamp(14px, 3.2vw, 18px)',
              borderRadius: 8,
              border: '2px solid var(--border)',
              background: 'var(--surface)',
              color: currentIdx === 0 ? 'var(--muted)' : 'var(--text)',
              fontWeight: 700,
              fontSize: 'clamp(12px, 2.6vw, 14px)',
              cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
              opacity: 1,
              boxShadow: currentIdx === 0 ? 'none' : '0 2px 8px rgba(0,0,0,0.08)'
            }}
          >
            ← Previous
          </button>

          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {questions.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentIdx(idx)}
                style={{
                  width: 'clamp(8px, 2vw, 10px)',
                  height: 'clamp(8px, 2vw, 10px)',
                  borderRadius: '50%',
                  border: 'none',
                  background: idx === currentIdx ? 'var(--primary)' : states[idx].correct ? 'var(--success)' : 'var(--danger)',
                  opacity: idx === currentIdx ? 1 : 0.45,
                  cursor: 'pointer',
                  padding: 0,
                }}
                title={`Question ${idx + 1}`}
              />
            ))}
          </div>

          {currentIdx < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))}
              style={{
                padding: 'clamp(7px, 1.6vh, 9px) clamp(14px, 3.2vw, 18px)',
                borderRadius: 8,
                border: '2px solid var(--primary)',
                background: 'var(--primary)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 'clamp(12px, 2.6vw, 14px)',
                cursor: 'pointer',
                boxShadow: '0 3px 10px var(--primary-20)'
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={() => { setReviewMode(false); setShowResults(true); }}
              style={{
                padding: 'clamp(7px, 1.6vh, 9px) clamp(14px, 3.2vw, 18px)',
                borderRadius: 8,
                border: '2px solid var(--secondary)',
                background: 'var(--secondary)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 'clamp(12px, 2.6vw, 14px)',
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(212, 165, 116, 0.3)'
              }}
            >
              ✓ Back to Results
            </button>
          )}
        </div>
      )}

      <div style={{ 
        flex: 1, 
        minHeight: 0, 
        overflow: 'auto',
      }}>
        <QuizCard
          key={current.question.id}
          question={current.question}
          locked={reviewMode || current.submitted}
          initialSelection={current.selected ?? undefined}
          onAnswered={handleAnswer}
          onNext={!reviewMode ? goToNext : undefined}
          isLastQuestion={currentIdx === questions.length - 1}
        />
      </div>

      {/* Back to Results now lives in the top review controls when on the last question */}

      <Confetti trigger={confetti} />
    </div>
  );
}

function DailyTimer() {
  const [now, setNow] = useState(Date.now());
  
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  
  const msToMidnight = useMemo(() => {
    const d = new Date();
    d.setHours(24, 0, 0, 0);
    return d.getTime() - now;
  }, [now]);
  
  const s = Math.max(0, Math.floor(msToMidnight / 1000));
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 12px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--muted)',
    }}>
      <span>🕐</span>
      <span>Next: {hh}:{mm}:{ss}</span>
    </div>
  );
}
