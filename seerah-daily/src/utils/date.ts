import dayjs from 'dayjs'

export function todayIso(): string {
  return dayjs().format('YYYY-MM-DD')
}

export function findQuestionByDate<T extends { date: string }>(items: T[], date: string): T | undefined {
  const exact = items.find(q => q.date === date)
  if (exact) return exact

  const uniqueDates = Array.from(new Set(items.map(q => q.date))).sort()
  if (uniqueDates.length === 0) return undefined

  const first = uniqueDates[0]
  const msPerDay = 24 * 60 * 60 * 1000
  const diffDays = Math.floor((new Date(date).getTime() - new Date(first).getTime()) / msPerDay)
  const idx = ((diffDays % uniqueDates.length) + uniqueDates.length) % uniqueDates.length
  const fallbackDate = uniqueDates[idx]
  return items.find(q => q.date === fallbackDate)
}

export function sortByDate<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.date.localeCompare(b.date))
}


