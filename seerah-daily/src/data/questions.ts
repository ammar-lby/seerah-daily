export type Question = {
  id: number
  date: string // YYYY-MM-DD for the daily schedule
  question: string
  choices: { id: string; text: string }[]
  correctId: string
  explanation: string
  category?: string
  difficulty?: 'easy' | 'medium' | 'hard'
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
    explanation: 'The Prophet ﷺ was born in Makkah in the Year of the Elephant.',
    category: 'Makkan - General',
    difficulty: 'easy',
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
    explanation: 'Haleemah as-Sa’diyyah cared for the Prophet ﷺ as his wet nurse.',
    category: 'Makkan - Family',
    difficulty: 'easy',
  },
  {
    id: 3,
    date: '2025-10-28',
    question: 'In which year after Hijrah did the Battle of Uhud occur?',
    choices: [
      { id: 'a', text: '1 AH' },
      { id: 'b', text: '2 AH' },
      { id: 'c', text: '3 AH' },
      { id: 'd', text: '5 AH' },
    ],
    correctId: 'c',
    explanation: 'Uhud took place in Shawwal of 3 AH near Madinah.',
    category: 'Madinan - Battles',
    difficulty: 'easy',
  },
  {
    id: 4,
    date: '2025-10-28',
    question: 'What error exposed the Muslim army during Uhud?',
    choices: [
      { id: 'a', text: 'Night march' },
      { id: 'b', text: 'Sandstorm' },
      { id: 'c', text: 'Archers leaving their posts' },
      { id: 'd', text: 'Ran out of water' },
    ],
    correctId: 'c',
    explanation: 'Some archers left their assigned positions believing the battle was over.',
    category: 'Madinan - Battles',
    difficulty: 'medium',
  },
  {
    id: 5,
    date: '2025-10-29',
    question: 'Which treaty was signed between the Muslims and Quraysh in 6 AH?',
    choices: [
      { id: 'a', text: 'Treaty of Hudaybiyyah' },
      { id: 'b', text: 'Treaty of Ta’if' },
      { id: 'c', text: 'Treaty of Najran' },
      { id: 'd', text: 'Treaty of Tabuk' },
    ],
    correctId: 'a',
    explanation: 'The Treaty of Hudaybiyyah was a pivotal truce in 6 AH that led to increased da’wah and later Fath Makkah.',
    category: 'Madinan - Treaties',
    difficulty: 'medium',
  },
  {
    id: 6,
    date: '2025-10-29',
    question: 'Which quality was the Prophet ﷺ most known for even before prophethood?',
    choices: [
      { id: 'a', text: 'Courage' },
      { id: 'b', text: 'Trustworthiness (Al-Amin)' },
      { id: 'c', text: 'Strength' },
      { id: 'd', text: 'Wealth' },
    ],
    correctId: 'b',
    explanation: 'He ﷺ was known as Al-Amin (the Trustworthy), which facilitated acceptance of his message.',
    category: 'General - Character',
    difficulty: 'easy',
  },
]


