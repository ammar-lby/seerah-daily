import { useMemo } from 'react'
import { questions } from '../data/questions'
import { findQuestionByDate, todayIso } from '../utils/date'
import { useQuizStore } from '../store/quiz'

export default function DailyQuiz() {
  const { selections, setSelected, submit, recordPlay, currentStreak, bestStreak } = useQuizStore()

  const today = todayIso()
  const q = useMemo(() => findQuestionByDate(questions, today), [today])

  if (!q) {
    return (
      <div className="card-surface p-6">
        <h2 className="font-semibold mb-2">No question scheduled today</h2>
        <p className="text-white/70">Please check back later or try Practice Mode.</p>
      </div>
    )
  }

  const sel = q ? selections[q.id] : undefined
  const isCorrect = q && sel?.selected ? sel.selected === q.correctId : false

  function onSubmit() {
    if (!q) return
    const ok = submit({ id: q.id, correctId: q.correctId })
    recordPlay(q.date, ok)
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Today's Question</h1>
        <div className="text-sm text-white/80">Streak: <span className="font-semibold">{currentStreak}</span> • Best: {bestStreak}</div>
      </div>

      <div className="card-surface p-6 space-y-4">
        <div className="text-xs font-semibold tracking-wider text-white/80 uppercase">{q.category ?? 'General'}</div>
        <p className="text-lg">{q.question}</p>
        <div className="grid grid-cols-2 gap-2">
          {q.choices.map(c => {
            const chosen = sel?.selected === c.id
            const submitted = sel?.submitted
            const correct = submitted && c.id === q.correctId
            const wrong = submitted && chosen && c.id !== q.correctId
            return (
              <button
                key={c.id}
                className={`btn-outline justify-center w-full min-h-[64px] aspect-[3/2] transition-all ${submitted ? 'text-white' : ''} ${chosen ? 'bg-white/10' : ''} ${correct ? 'border-green-500/60 bg-green-500/10' : ''} ${wrong ? 'border-red-500/60 bg-red-500/10' : ''} ${!submitted ? 'hover:bg-gray-500/10 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400' : ''}`}
                onClick={() => !submitted && setSelected(q.id, c.id)}
                disabled={submitted}
              >
                {c.text}
              </button>
            )
          })}
        </div>

        {!sel?.submitted && (
          <div className="flex justify-center">
            <button className="btn-primary" onClick={onSubmit} disabled={!sel?.selected}>Submit</button>
          </div>
        )}

        {sel?.submitted && (
          <div className={`mt-2 text-sm ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'Correct! ' : 'Not quite. '} {q.explanation}
          </div>
        )}
      </div>
    </section>
  )
}


