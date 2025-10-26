export type Question = {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string; // must be one of options
  explanation: string;
  category: 'Makkan' | 'Madinan' | 'General' | string;
  datePublished: string; // ISO date (YYYY-MM-DD) for daily rotation
  difficulty?: 'easy' | 'medium' | 'hard';
};

export type QuizMode = 'daily' | 'practice';


