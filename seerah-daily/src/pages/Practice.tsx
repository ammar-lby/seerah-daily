import { useMemo, useState } from 'react'
import { questions } from '../data/questions'
import { sortByDate } from '../utils/date'

export default function Practice() {
  const ordered = useMemo(() => sortByDate(questions), [])
  const [activeId, setActiveId] = useState<number | null>(ordered[0]?.id ?? null)
  const active = ordered.find(q => q.id === activeId)
  const [picked, setPicked] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="grid gap-6 md:grid-cols-[240px_1fr]">
      <aside className="card-surface p-4 space-y-2 h-max">
        <h2 className="font-semibold mb-2">Questions</h2>
        <div className="grid gap-2 max-h-[60dvh] overflow-auto pr-1">
          {ordered.map(q => (
            <button key={q.id} className={`btn-outline justify-start ${activeId === q.id ? 'bg-white/10' : ''}`} onClick={() => { setActiveId(q.id); setPicked(null); setSubmitted(false) }}>
              {q.date}
            </button>
          ))}
        </div>
      </aside>

      <div className="space-y-4">
        {active ? (
          <div className="card-surface p-6 space-y-4">
            <div className="text-sm text-white/70">{active.date}</div>
            <p className="text-lg">{active.question}</p>
            <div className="grid gap-2">
              {active.choices.map(c => {
                const chosen = picked === c.id
                const correct = submitted && c.id === active.correctId
                const wrong = submitted && chosen && c.id !== active.correctId
                return (
                  <button
                    key={c.id}
                    className={`btn-outline justify-start w-full ${chosen ? 'bg-white/10' : ''} ${correct ? 'border-green-500/60 bg-green-500/10' : ''} ${wrong ? 'border-red-500/60 bg-red-500/10' : ''}`}
                    onClick={() => !submitted && setPicked(c.id)}
                    disabled={submitted}
                  >
                    {c.text}
                  </button>
                )
              })}
            </div>
            {!submitted && (
              <button className="btn-primary" onClick={() => setSubmitted(true)} disabled={!picked}>Check</button>
            )}
            {submitted && (
              <div className={`mt-2 text-sm ${picked === active.correctId ? 'text-green-400' : 'text-red-400'}`}>
                {picked === active.correctId ? 'Correct! ' : 'Not quite. '} {active.explanation}
              </div>
            )}
          </div>
        ) : (
          <div className="card-surface p-6">No questions yet.</div>
        )}
      </div>
    </section>
  )
}


