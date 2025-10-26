# Seerah Daily Quiz

Seerah Daily  is a lightweight, mobile-first React web app that delivers one Seerah multiple-choice question per day, with immediate feedback and a short explanation. It helps build a daily habit of learning about the life of the Prophet Muhammad ﷺ. A Practice Mode lets users review previous questions anytime.

## Features
- Daily question with 4 choices and instant explanation
- Practice Mode to revisit earlier questions
- Local streak tracking with persistence (Zustand + localStorage)
- Clean, responsive UI with Islamic-themed styling (Tailwind CSS)
- Modern stack: React 19 + Vite 7 + TypeScript

## Tech Stack
- React 19, TypeScript
- Vite 7 (dev server/bundler)
- Tailwind CSS v4 with `@tailwindcss/postcss`
- React Router 7
- Zustand 5 (state + persistence)
- TanStack Query 5 (provider wired for future data fetching)

## Requirements
- Node.js: 22.12.0+ (or 20.19.0+)
- npm (bundled with Node)

Recommended on Windows: nvm for Windows
```powershell
winget install -e --id CoreyButler.NVMforWindows --silent
# Close and reopen PowerShell
nvm install 22.12.0
nvm use 22.12.0
node -v
npm -v
```

## Project Structure
```
seerah-daily/               # repo root
  └─ seerah-daily/          # app root
     ├─ index.html
     ├─ package.json
     ├─ postcss.config.cjs
     ├─ tailwind.config.cjs
     ├─ src/
     │  ├─ App.tsx
     │  ├─ main.tsx
     │  ├─ styles/
     │  │  ├─ global.css
     │  │  └─ theme.css
     │  ├─ pages/
     │  │  ├─ Home.tsx
     │  │  ├─ DailyQuiz.tsx
     │  │  └─ Practice.tsx
     │  ├─ data/questions.ts
     │  ├─ store/quiz.ts
     │  └─ utils/date.ts
     └─ tsconfig.json
```
Notes:
- The app lives inside `seerah-daily/seerah-daily` (inner directory).
- Tailwind v4 is configured via `@tailwindcss/postcss` in `postcss.config.cjs`.

## Setup & Run
```powershell
# 1) Ensure Node version
nvm use 22.12.0  # or 20.19.0

# 2) Install deps and run dev server
cd seerah-daily/seerah-daily
npm install
npm run dev
# Vite will print the local URL (e.g., http://localhost:5173 or the next free port)
```
If a port is already in use, close prior dev servers and retry:
```powershell
taskkill /F /IM node.exe
npm run dev
```

## Styling
- Tailwind CSS v4 is enabled via `@import "tailwindcss";` in `src/styles/global.css`.
- Custom component classes (`.btn`, `.btn-primary`, `.btn-outline`, `.card-surface`, `.container-page`) are defined under `@layer components` in `global.css`.

## State & Persistence
`src/store/quiz.ts` (Zustand) manages:
- Per-question selection and submission state
- Streak values (`currentStreak`, `bestStreak`, `lastPlayedDate`)
- Persistence via `zustand/middleware` (localStorage)

API summary:
- `setSelected(questionId, answerId)`
- `submit({ id, correctId })` → boolean (isCorrect)
- `recordPlay(dateIso, isCorrect)` → updates streak once per date
- `resetSelection(questionId)`

## Daily Question Logic
- Questions are defined in `src/data/questions.ts` with an ISO `date` (YYYY-MM-DD).
- `src/utils/date.ts` provides helpers to find today’s question and sort by date.
- Daily page shows the item whose `date` matches today; Practice lists all.

### Adding Questions
Append to `src/data/questions.ts`:
```ts
{
  id: 3,
  date: '2025-10-27',
  question: 'Example?',
  choices: [
    { id: 'a', text: '...' },
    { id: 'b', text: '...' },
    { id: 'c', text: '...' },
    { id: 'd', text: '...' },
  ],
  correctId: 'a',
  explanation: 'Short explanation.'
}
```

## Scripts
- `npm run dev` – start Vite dev server
- `npm run build` – type-check and build for production
- `npm run preview` – preview the production build locally

## Troubleshooting
- Node version error: Upgrade Node to 22.12.0 (or 20.19.0) using nvm
- PostCSS plugin error: Ensure `@tailwindcss/postcss` is installed and referenced in `postcss.config.cjs`
- Port in use: Kill prior Node processes (`taskkill /F /IM node.exe`) and retry

## Roadmap
- User accounts and cloud-backed streaks
- Leaderboards and achievements
- Themed weekly challenges
- Additional topics (Qur’an, Hadith, History)
- Teacher/Parent dashboards; community integration

## License
MIT
