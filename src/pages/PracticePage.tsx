import { useMemo, useState, useEffect } from 'react';
import { getAllPreviousQuestions, QUESTIONS } from '../data/questions';
import { todayISO } from '../lib/date';
import { QuizCard } from '../components/QuizCard';
import { ProgressBar } from '../components/ProgressBar';
import { shuffle } from '../lib/random';

function interleaveByCategory<T extends { category?: string }>(items: T[]): T[] {
  const byCat = new Map<string, T[]>();
  for (const it of items) {
    const key = it.category ?? 'General';
    if (!byCat.has(key)) byCat.set(key, []);
    byCat.get(key)!.push(it);
  }
  // Shuffle within each category
  for (const [k, arr] of byCat) {
    byCat.set(k, shuffle(arr));
  }
  // Round-robin across categories
  const cats = Array.from(byCat.keys());
  const result: T[] = [];
  let added = true;
  while (added) {
    added = false;
    for (const c of cats) {
      const arr = byCat.get(c)!;
      if (arr.length) {
        result.push(arr.shift()!);
        added = true;
      }
    }
  }
  return result;
}

export function PracticePage() {
  const [idx, setIdx] = useState(0);
  const [category, setCategory] = useState<string>('All');
  const [difficulty, setDifficulty] = useState<string>('All');
  const [order, setOrder] = useState<'Date' | 'Random'>('Random');

  const today = todayISO();

  const categories = useMemo(() => {
    const vals = Array.from(new Set(QUESTIONS.map((q) => q.category).filter(Boolean))) as string[];
    return ['All', ...vals];
  }, []);

  const difficulties = useMemo(() => {
    const vals = Array.from(new Set(QUESTIONS.map((q) => q.difficulty).filter(Boolean))) as string[];
    return ['All', ...vals];
  }, []);

  const base = useMemo(() => {
    const prev = getAllPreviousQuestions(today);
    return prev.length ? prev : QUESTIONS; // fallback to all for early days
  }, [today]);

  const filtered = useMemo(() => {
    let list = base;
    if (category !== 'All') list = list.filter((q) => q.category === category);
    if (difficulty !== 'All') list = list.filter((q) => q.difficulty === difficulty);
    return list;
  }, [base, category, difficulty]);

  const items = useMemo(() => {
    if (order === 'Random') {
      // Mix categories by interleaving after within-group shuffles
      return interleaveByCategory(filtered);
    }
    return filtered;
  }, [filtered, order]);

  useEffect(() => {
    setIdx(0);
  }, [category, difficulty, order]);

  const q = items[idx];

  function prev() {
    setIdx((v) => Math.max(0, v - 1));
  }
  function next() {
    setIdx((v) => Math.min(items.length - 1, v + 1));
  }

  const toLabel = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);

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

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 700 }}>Topic</span>
            <select
              className="filter-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 700 }}>Difficulty</span>
            <select
              className="filter-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>{toLabel(d)}</option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 700 }}>Order</span>
            <select
              className="filter-select"
              value={order}
              onChange={(e) => setOrder(e.target.value as 'Date' | 'Random')}
            >
              <option value="Random">Random</option>
              <option value="Date">Date</option>
            </select>
          </label>
        </div>

        <ProgressBar current={Math.min(idx + 1, items.length || 1)} total={items.length || 1} />
      </div>

      {q ? (
        <>
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
        </>
      ) : (
        <div className="card-surface p-6" style={{ textAlign: 'center', color: 'var(--muted)', fontWeight: 700 }}>No questions match your filters yet.</div>
      )}
    </div>
  );
}


