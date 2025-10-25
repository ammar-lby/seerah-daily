import { useMemo, useState } from 'react'
import { questions } from '../data/questions'
import { findQuestionByDate, todayIso } from '../utils/date'
import { getStreak, recordPlay } from '../services/streak'

export default function DailyQuiz() {
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [streak, setStreak] = useState(getStreak())

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

  const isCorrect = q ? selected === q.correctId : false

  function onSubmit() {
    if (!selected) return
    setSubmitted(true)
    if (q) {
      recordPlay(q.date, isCorrect)
    }
    setStreak(getStreak())
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Today's Question</h1>
        <div className="text-sm text-white/80">Streak: <span className="font-semibold">{streak.current}</span> • Best: {streak.best}</div>
      </div>

      <div className="card-surface p-6 space-y-4">
        <p className="text-lg">{q.question}</p>
        <div className="grid gap-2">
          {q.choices.map(c => {
            const chosen = selected === c.id
            const correct = submitted && c.id === q.correctId
            const wrong = submitted && chosen && c.id !== q.correctId
            return (
              <button
                key={c.id}
                className={`btn-outline justify-start w-full ${chosen ? 'bg-white/10' : ''} ${correct ? 'border-green-500/60 bg-green-500/10' : ''} ${wrong ? 'border-red-500/60 bg-red-500/10' : ''}`}
                onClick={() => !submitted && setSelected(c.id)}
                disabled={submitted}
              >
                {c.text}
              </button>
            )
          })}
        </div>

        {!submitted && (
          <button className="btn-primary" onClick={onSubmit} disabled={!selected}>Submit</button>
        )}

        {submitted && (
          <div className={`mt-2 text-sm ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'Correct! ' : 'Not quite. '} {q.explanation}
          </div>
        )}
      </div>
    </section>
  )
}


