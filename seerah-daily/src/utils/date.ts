import dayjs from 'dayjs'

export function todayIso(): string {
  return dayjs().format('YYYY-MM-DD')
}

export function findQuestionByDate<T extends { date: string }>(items: T[], date: string): T | undefined {
  return items.find(q => q.date === date)
}

export function sortByDate<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.date.localeCompare(b.date))
}


