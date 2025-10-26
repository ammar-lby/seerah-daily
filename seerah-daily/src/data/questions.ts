export type Question = {
  id: number
  date: string // YYYY-MM-DD for the daily schedule
  question: string
  choices: { id: string; text: string }[]
  correctId: string
  explanation: string
}

// Seed: replace/expand with verified Seerah content
export const questions: Question[] = [
  {
    id: 1,
    date: '2025-10-25',
    question: 'In which city was the Prophet Muhammad ﷺ born?',
    choices: [
      { id: 'a', text: 'Madinah' },
      { id: 'b', text: 'Makkah' },
      { id: 'c', text: 'Ta’if' },
      { id: 'd', text: 'Jerusalem' },
    ],
    correctId: 'b',
    explanation: 'The Prophet ﷺ was born in Makkah in the Year of the Elephant.'
  },
  {
    id: 2,
    date: '2025-10-26',
    question: 'Who was the wet nurse of the Prophet ﷺ in his infancy?',
    choices: [
      { id: 'a', text: 'Haleemah as-Sa’diyyah' },
      { id: 'b', text: 'Asiyah' },
      { id: 'c', text: 'Maryam' },
      { id: 'd', text: 'Khadijah' },
    ],
    correctId: 'a',
    explanation: 'Haleemah as-Sa’diyyah cared for the Prophet ﷺ as his wet nurse.'
  },
]


