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
    // Always interleave for variety
    return interleaveByCategory(filtered);
  }, [filtered]);

  useEffect(() => {
    setIdx(0);
  }, [category, difficulty]);

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
      position: 'relative',
      maxWidth: 900,
      margin: '0 auto',
      width: '100%',
    }}>
      
      <div style={{ marginBottom: 12 }}>
        {/* Filters */}
        <div className="filters-row slide-up" style={{ marginBottom: 10 }}>
          <label>
            <span style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 800, letterSpacing: '0.02em' }}>Topic</span>
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

          <label>
            <span style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 800, letterSpacing: '0.02em' }}>Difficulty</span>
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
        </div>

        {/* Navigation under filters */}
        <div className="slide-up" style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
          <button
            onClick={prev}
            disabled={idx === 0}
            aria-label="Previous question"
            style={{
              padding: '8px 12px',
              borderRadius: 999,
              border: '1.5px solid var(--border)',
              background: 'var(--surface)',
              color: idx === 0 ? 'var(--muted)' : 'var(--text)',
              fontWeight: 700,
              fontSize: 14,
              cursor: idx === 0 ? 'not-allowed' : 'pointer',
              boxShadow: idx === 0 ? 'none' : '0 1px 6px var(--shadow)',
              minHeight: 40,
              minWidth: 40,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'transform .12s ease, box-shadow .12s ease',
            }}
          >
            ← Prev
          </button>
          <button
            onClick={next}
            disabled={idx === items.length - 1}
            aria-label="Next question"
            style={{
              padding: '8px 12px',
              borderRadius: 999,
              border: '2px solid var(--primary)',
              background: idx === items.length - 1 ? 'var(--surface)' : 'var(--primary)',
              color: idx === items.length - 1 ? 'var(--muted)' : '#fff',
              fontWeight: 800,
              fontSize: 14,
              cursor: idx === items.length - 1 ? 'not-allowed' : 'pointer',
              boxShadow: idx === items.length - 1 ? 'none' : '0 3px 10px var(--primary-20)',
              minHeight: 40,
              minWidth: 40,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'transform .12s ease, box-shadow .12s ease',
            }}
          >
            Next →
          </button>
        </div>

        <ProgressBar current={Math.min(idx + 1, items.length || 1)} total={items.length || 1} />
      </div>

      {q ? (
        <>
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            <QuizCard key={q.id} question={q} />
          </div>

          
        </>
      ) : (
        <div className="card-surface p-6" style={{ textAlign: 'center', color: 'var(--muted)', fontWeight: 700 }}>No questions match your filters yet.</div>
      )}
    </div>
  );
}


