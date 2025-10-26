import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SelectionEntry = {
  selected: string | null
  submitted: boolean
}

type SelectionMap = Record<number, SelectionEntry>

export type QuestionLite = {
  id: number
  correctId: string
}

type QuizStore = {
  selections: SelectionMap
  setSelected: (questionId: number, answerId: string) => void
  submit: (q: QuestionLite) => boolean
  resetSelection: (questionId: number) => void

  currentStreak: number
  bestStreak: number
  lastPlayedDate: string | null
  recordPlay: (dateIso: string, isCorrect: boolean) => void
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      selections: {},
      setSelected: (questionId, answerId) => {
        set(state => ({
          selections: {
            ...state.selections,
            [questionId]: { selected: answerId, submitted: false },
          },
        }))
      },
      submit: (q) => {
        const entry = get().selections[q.id]
        if (!entry || !entry.selected) return false
        const isCorrect = entry.selected === q.correctId
        set(state => ({
          selections: {
            ...state.selections,
            [q.id]: { selected: entry.selected, submitted: true },
          },
        }))
        return isCorrect
      },
      resetSelection: (questionId) => {
        set(state => ({
          selections: {
            ...state.selections,
            [questionId]: { selected: null, submitted: false },
          },
        }))
      },

      currentStreak: 0,
      bestStreak: 0,
      lastPlayedDate: null,
      recordPlay: (dateIso, isCorrect) => {
        const { lastPlayedDate, currentStreak, bestStreak } = get()
        if (lastPlayedDate === dateIso) return
        if (isCorrect) {
          const nextCurrent = currentStreak + 1
          const nextBest = Math.max(bestStreak, nextCurrent)
          set({ currentStreak: nextCurrent, bestStreak: nextBest, lastPlayedDate: dateIso })
        } else {
          set({ currentStreak: 0, bestStreak, lastPlayedDate: dateIso })
        }
      },
    }),
    {
      name: 'seerah:quiz',
      partialize: (state) => ({
        selections: state.selections,
        currentStreak: state.currentStreak,
        bestStreak: state.bestStreak,
        lastPlayedDate: state.lastPlayedDate,
      }),
    }
  )
)


