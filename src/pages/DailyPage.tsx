import { useMemo, useState } from 'react';
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
    
    // Auto advance after 1.2s, or show results if last question
    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx((i) => i + 1);
      } else {
        setShowResults(true);
      }
    }, 1200);
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

  if (showResults) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}>
        <ResultsSummary
          correct={totalCorrect}
          total={questions.length}
          streak={streak}
          dateISO={iso}
          onRestart={() => setShowResults(false)}
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
          Question {currentIdx + 1} of {questions.length}
        </h3>
        <ProgressBar current={currentIdx + 1} total={questions.length} />
      </div>

      <QuizCard
        key={current.question.id}
        question={current.question}
        locked={current.submitted}
        initialSelection={current.selected ?? undefined}
        onAnswered={handleAnswer}
      />

      {allAnswered && !showResults && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button
            onClick={() => setShowResults(true)}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: 'var(--primary)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            View Results
          </button>
        </div>
      )}

      <Confetti trigger={confetti} />
    </div>
  );
}
