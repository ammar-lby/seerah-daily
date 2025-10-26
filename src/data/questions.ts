import type { Question } from '../types';

// Seed question bank - grouped in sets of 5 per day
export const QUESTIONS: Question[] = [
  // Day 1 - 2025-10-26
  {
    id: 'q-0001',
    questionText: 'In which year (relative to Hijrah) did the Revelation begin for the Prophet Muhammad ﷺ?',
    options: ['10 years before Hijrah', '13 years before Hijrah', '1 year after Hijrah', 'In the year of Hijrah'],
    correctAnswer: '13 years before Hijrah',
    explanation: 'Revelation began in the Cave of Hira during the Makkan period, 13 lunar years before the Hijrah to Madinah.',
    category: 'Makkan',
    datePublished: '2025-10-26',
    difficulty: 'easy',
  },
  {
    id: 'q-0002',
    questionText: 'What was the first word revealed to the Prophet ﷺ?',
    options: ['Iqra (Read/Recite)', 'Allahu Akbar', 'Bismillah', 'Alhamdulillah'],
    correctAnswer: 'Iqra (Read/Recite)',
    explanation: 'The first revelation began with "Iqra" in Surah Al-Alaq (96:1), instructing to read in the Name of your Lord.',
    category: 'Makkan',
    datePublished: '2025-10-26',
    difficulty: 'easy',
  },
  {
    id: 'q-0003',
    questionText: 'Who was the first person to believe in the Prophet ﷺ?',
    options: ['Khadijah bint Khuwaylid', 'Abu Bakr as-Siddiq', 'Ali ibn Abi Talib', 'Bilal ibn Rabah'],
    correctAnswer: 'Khadijah bint Khuwaylid',
    explanation: 'Khadijah رضي الله عنها was the first person to believe in the Prophet ﷺ and accept Islam.',
    category: 'Makkan',
    datePublished: '2025-10-26',
    difficulty: 'easy',
  },
  {
    id: 'q-0004',
    questionText: 'How old was the Prophet ﷺ when he received the first revelation?',
    options: ['30 years old', '35 years old', '40 years old', '45 years old'],
    correctAnswer: '40 years old',
    explanation: 'The Prophet Muhammad ﷺ was 40 years old when Angel Jibril first came to him in the Cave of Hira.',
    category: 'Makkan',
    datePublished: '2025-10-26',
    difficulty: 'easy',
  },
  {
    id: 'q-0005',
    questionText: 'What title was the Prophet ﷺ known by before receiving revelation?',
    options: ['Al-Amin (The Trustworthy)', 'Al-Hakim (The Wise)', 'Al-Qawi (The Strong)', 'Al-Sadiq (The Truthful)'],
    correctAnswer: 'Al-Amin (The Trustworthy)',
    explanation: 'The Prophet ﷺ was known as "Al-Amin" (The Trustworthy) by the people of Makkah even before prophethood.',
    category: 'Makkan',
    datePublished: '2025-10-26',
    difficulty: 'easy',
  },

  // Day 2 - 2025-10-27
  {
    id: 'q-0006',
    questionText: 'Which battle marked the first major victory for the Muslims?',
    options: ['Uhud', 'Badr', 'Khandaq (Trench)', 'Tabuk'],
    correctAnswer: 'Badr',
    explanation: 'The Battle of Badr (2 AH) was a decisive victory and a turning point for the early Muslim community.',
    category: 'Madinan',
    datePublished: '2025-10-27',
    difficulty: 'medium',
  },
  {
    id: 'q-0007',
    questionText: 'Who was the first man to accept Islam?',
    options: ['Abu Bakr as-Siddiq', 'Ali ibn Abi Talib', 'Uthman ibn Affan', 'Zayd ibn Harithah'],
    correctAnswer: 'Abu Bakr as-Siddiq',
    explanation: 'Among adult men, Abu Bakr as-Siddiq رضي الله عنه was the first to accept Islam.',
    category: 'Makkan',
    datePublished: '2025-10-27',
    difficulty: 'easy',
  },
  {
    id: 'q-0008',
    questionText: 'In which year did the Hijrah (migration) to Madinah occur?',
    options: ['610 CE', '615 CE', '622 CE', '630 CE'],
    correctAnswer: '622 CE',
    explanation: 'The Hijrah occurred in 622 CE and marks the beginning of the Islamic calendar.',
    category: 'Madinan',
    datePublished: '2025-10-27',
    difficulty: 'medium',
  },
  {
    id: 'q-0009',
    questionText: 'What was the name of the cave where the Prophet ﷺ received the first revelation?',
    options: ['Cave of Thawr', 'Cave of Hira', 'Cave of Uhud', 'Cave of Arafat'],
    correctAnswer: 'Cave of Hira',
    explanation: 'The Cave of Hira on Mount Nur is where the Prophet ﷺ used to retreat for contemplation and received the first revelation.',
    category: 'Makkan',
    datePublished: '2025-10-27',
    difficulty: 'easy',
  },
  {
    id: 'q-0010',
    questionText: 'How many years did the Prophet ﷺ live in Makkah after prophethood?',
    options: ['10 years', '13 years', '15 years', '20 years'],
    correctAnswer: '13 years',
    explanation: 'The Prophet ﷺ spent 13 years in Makkah after receiving revelation before migrating to Madinah.',
    category: 'Makkan',
    datePublished: '2025-10-27',
    difficulty: 'medium',
  },
];

export function getQuestionsByDate(dateISO: string): Question[] {
  return QUESTIONS.filter((q) => q.datePublished === dateISO);
}

export function getAllPreviousQuestions(beforeISO: string): Question[] {
  return QUESTIONS.filter((q) => q.datePublished < beforeISO).sort(
    (a, b) => a.datePublished.localeCompare(b.datePublished)
  );
}


