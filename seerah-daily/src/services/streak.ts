const STREAK_KEY = 'seerah:streak'
const LAST_PLAYED_KEY = 'seerah:lastPlayed'

export type StreakData = {
  current: number
  best: number
}

export function getStreak(): StreakData {
  const raw = localStorage.getItem(STREAK_KEY)
  if (!raw) return { current: 0, best: 0 }
  try {
    return JSON.parse(raw) as StreakData
  } catch {
    return { current: 0, best: 0 }
  }
}

export function setStreak(data: StreakData) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(data))
}

export function recordPlay(dateIso: string, isCorrect: boolean) {
  const lastPlayed = localStorage.getItem(LAST_PLAYED_KEY)
  const streak = getStreak()

  if (!lastPlayed || lastPlayed !== dateIso) {
    localStorage.setItem(LAST_PLAYED_KEY, dateIso)
    if (isCorrect) {
      const next = { current: streak.current + 1, best: Math.max(streak.best, streak.current + 1) }
      setStreak(next)
    } else {
      setStreak({ current: 0, best: streak.best })
    }
  }
}

export function getLastPlayed(): string | null {
  return localStorage.getItem(LAST_PLAYED_KEY)
}


