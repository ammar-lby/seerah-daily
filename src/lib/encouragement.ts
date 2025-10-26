// Islamic-themed encouraging messages
export const CORRECT_MESSAGES = [
  "Masha'Allah! 🌟 You're on the right path!",
  "Alhamdulillah! ✨ Knowledge is light!",
  "SubhanAllah! 🎯 Keep up the great work!",
  "Barakallahu feek! 🌙 You're doing amazing!",
  "Allahu Akbar! 🏆 Knowledge seeker!",
  "Jazakallah khair! 🌸 Your effort shows!",
  "Tabarak Allah! ⭐ Scholar in the making!",
  "Masha'Allah tabarakallah! 💫 Brilliant!",
  "Alhamdulillah for knowledge! 📚",
  "May Allah bless your learning! 🤲",
  "SubhanAllah! Like a sahabi! 🕌",
  "Masha'Allah! Stronger than Khalid ibn Walid's memory! ⚔️",
  "Tabarak Allah! Even the angels are impressed! 👼",
  "Alhamdulillah! Your brain is sharper than a Damascus sword! 🗡️",
  "Masha'Allah! Knowledge level: Companion unlocked! 🌟",
];

export const INCORRECT_MESSAGES = [
  "Don't worry, even the Sahabah asked questions! 💪",
  "Keep trying! Seeking knowledge is an act of worship! 📖",
  "No problem! Every scholar started as a student! 🌱",
  "It's okay! The Prophet ﷺ loved those who sought knowledge! 💚",
  "Stay strong! You're learning, and that's what counts! ✨",
];

export function getRandomCorrectMessage(): string {
  return CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
}

export function getRandomIncorrectMessage(): string {
  return INCORRECT_MESSAGES[Math.floor(Math.random() * INCORRECT_MESSAGES.length)];
}

// Points system
export function calculatePoints(correct: boolean, streak: number): number {
  if (!correct) return 0;
  let points = 10; // Base points
  if (streak >= 3) points += 5; // Streak bonus
  if (streak >= 7) points += 10; // Week streak bonus
  return points;
}

export function getTotalPoints(correctAnswers: number, streak: number): number {
  let total = correctAnswers * 10;
  if (streak >= 3) total += streak * 2;
  return total;
}

