import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { readJson, writeJson } from '../lib/storage';
import { todayISO } from '../lib/date';

export type DailyAnswer = {
  questionId: string;
  selected: string;
  correct: boolean;
  timestamp: number;
};

type AnswersByDate = Record<string, DailyAnswer>;

const ANSWERS_KEY = 'answers';

// External store with referentially stable snapshot unless data actually changes
let internalStore: AnswersByDate = readJson<AnswersByDate>(ANSWERS_KEY, {});
const subscribers = new Set<() => void>();

function getSnapshot(): AnswersByDate {
  return internalStore;
}

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function emit() {
  subscribers.forEach((cb) => cb());
}

function setStore(next: AnswersByDate) {
  internalStore = next;
  writeJson<AnswersByDate>(ANSWERS_KEY, internalStore);
  emit();
}

// Sync updates coming from other tabs/windows
window.addEventListener('storage', (e: StorageEvent) => {
  if (!e.key) return;
  if (!e.key.endsWith(ANSWERS_KEY)) return;
  internalStore = readJson<AnswersByDate>(ANSWERS_KEY, {});
  emit();
});

export function useStreak() {
  const store = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const computeStreak = useCallback(() => {
    let count = 0;
    let date = new Date(todayISO());
    for (;;) {
      const iso = date.toISOString().slice(0, 10);
      const ans = store[iso];
      if (!ans || !ans.correct) break;
      count += 1;
      // go to previous day
      date.setDate(date.getDate() - 1);
    }
    return count;
  }, [store]);

  const streak = useMemo(() => computeStreak(), [computeStreak]);

  const recordAnswer = useCallback((isoDate: string, answer: DailyAnswer) => {
    const next = { ...store, [isoDate]: answer };
    setStore(next);
  }, [store]);

  const getAnswerForDate = useCallback((isoDate: string) => store[isoDate], [store]);

  return { streak, recordAnswer, getAnswerForDate } as const;
}


