import { useMemo, useState } from 'react'
import { questions } from '../data/questions'
import { sortByDate } from '../utils/date'
import { useQuizStore } from '../store/quiz'

function shuffle<T>(arr: T[]): T[] {
	const a = arr.slice()
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[a[i], a[j]] = [a[j], a[i]]
	}
	return a
}

function interleaveByCategory<T extends { category?: string }>(items: T[]): T[] {
	const byCat = new Map<string, T[]>()
	for (const it of items) {
		const key = it.category ?? 'General'
		if (!byCat.has(key)) byCat.set(key, [])
		byCat.get(key)!.push(it)
	}
	for (const [k, arr] of byCat) byCat.set(k, shuffle(arr))
	const cats = Array.from(byCat.keys())
	const res: T[] = []
	let added = true
	while (added) {
		added = false
		for (const c of cats) {
			const arr = byCat.get(c)!
			if (arr.length) { res.push(arr.shift()!); added = true }
		}
	}
	return res
}

export default function Practice() {
	const ordered = useMemo(() => sortByDate(questions), [])
	const [category, setCategory] = useState<string>('All')
	const [difficulty, setDifficulty] = useState<string>('All')
	const [order, setOrder] = useState<'Date' | 'Random'>('Random')

	const rawCategories = useMemo(() => Array.from(new Set(questions.map(q => q.category).filter(Boolean))) as string[], [])
	const categoryGroups = useMemo(() => {
		const groups = new Set<string>()
		for (const c of rawCategories) {
			const parts = c.split('-').map(s => s.trim())
			for (const p of parts) if (p) groups.add(p)
		}
		return Array.from(groups).sort()
	}, [rawCategories])
	const categories = useMemo(() => ['All', ...categoryGroups, ...rawCategories.slice().sort()], [rawCategories, categoryGroups])

	const difficulties = useMemo(() => Array.from(new Set(questions.map(q => q.difficulty).filter(Boolean))) as string[], [])

	const filtered = useMemo(() => {
		let list = ordered
		if (category !== 'All') {
			const isFull = rawCategories.includes(category)
			list = list.filter(q => {
				const c = q.category ?? ''
				return isFull ? c === category : c.includes(category)
			})
		}
		if (difficulty !== 'All') list = list.filter(q => q.difficulty === difficulty)
		return list
	}, [ordered, category, difficulty, rawCategories])

	const items = useMemo(() => order === 'Random' ? interleaveByCategory(filtered) : filtered, [filtered, order])

	const [activeId, setActiveId] = useState<number | null>(items[0]?.id ?? null)
	const active = items.find(q => q.id === activeId)
	const { selections, setSelected, submit, resetSelection } = useQuizStore()
	const sel = active ? selections[active.id] : undefined

	const toLabel = (v: string) => v.charAt(0).toUpperCase() + v.slice(1)

	return (
		<section className="grid gap-6 md:grid-cols-[240px_1fr]">
			<aside className="card-surface p-4 space-y-3 h-max">
				<h2 className="font-semibold">Practice</h2>

				{/* Filters */}
				<div className="grid gap-2">
					<label className="text-sm text-white/80">Topic</label>
					<select
						className="h-11 min-h-[44px] px-3 rounded-md cursor-pointer touch-manipulation bg-gray-200 border border-gray-300 text-black dark:bg-gray-700 dark:border-gray-600 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
						value={category}
						onChange={(e) => { setCategory(e.target.value); setActiveId(null) }}
					>
						{categories.map(c => <option key={c} value={c}>{c}</option>)}
					</select>

					<label className="text-sm text-white/80 mt-2">Difficulty</label>
					<select
						className="h-11 min-h-[44px] px-3 rounded-md cursor-pointer touch-manipulation bg-gray-200 border border-gray-300 text-black dark:bg-gray-700 dark:border-gray-600 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
						value={difficulty}
						onChange={(e) => { setDifficulty(e.target.value); setActiveId(null) }}
					>
						{difficulties.concat().map(d => <option key={d} value={d}>{toLabel(d)}</option>)}
					</select>

					<label className="text-sm text-white/80 mt-2">Order</label>
					<select
						className="h-11 min-h-[44px] px-3 rounded-md cursor-pointer touch-manipulation bg-gray-200 border border-gray-300 text-black dark:bg-gray-700 dark:border-gray-600 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
						value={order}
						onChange={(e) => { setOrder(e.target.value as 'Date' | 'Random'); setActiveId(null) }}
					>
						<option value="Random">Random</option>
						<option value="Date">Date</option>
					</select>
				</div>

				<div className="grid gap-2 max-h-[60dvh] overflow-auto pr-1 mt-2">
					{items.map(q => (
						<button key={q.id} className={`btn-outline justify-start ${activeId === q.id ? 'bg-white/10' : ''}`} onClick={() => { setActiveId(q.id); resetSelection(q.id) }}>
							{q.date}
						</button>
					))}
					{items.length === 0 && (
						<div className="text-white/60 text-sm">No questions match your filters.</div>
					)}
				</div>
			</aside>

			<div className="space-y-4">
				{active ? (
					<div className="card-surface p-6 space-y-4">
						<div className="text-sm text-white/70">{active.date}</div>
						<div className="text-xs font-semibold tracking-wider text-white/80 uppercase">{active.category ?? 'General'}</div>
						<p className="text-lg">{active.question}</p>
						<div className="grid grid-cols-2 gap-2">
							{active.choices.map(c => {
								const chosen = sel?.selected === c.id
								const submitted = sel?.submitted
								const correct = submitted && c.id === active.correctId
								const wrong = submitted && chosen && c.id !== active.correctId
								return (
									<button
										key={c.id}
										className={`btn-outline justify-center w-full min-h-[64px] aspect-[3/2] ${submitted ? 'text-white' : ''} ${chosen ? 'bg-white/10' : ''} ${correct ? 'border-green-500/60 bg-green-500/10' : ''} ${wrong ? 'border-red-500/60 bg-red-500/10' : ''}`}
										onClick={() => active && !submitted && setSelected(active.id, c.id)}
										disabled={submitted}
									>
										{c.text}
									</button>
								)
							})}
						</div>
						{!sel?.submitted && active && (
							<button className="btn-primary" onClick={() => submit({ id: active.id, correctId: active.correctId })} disabled={!sel?.selected}>Check</button>
						)}
						{sel?.submitted && (
							<div className={`mt-2 text-sm ${sel.selected === active.correctId ? 'text-green-400' : 'text-red-400'}`}>
								{sel.selected === active.correctId ? 'Correct! ' : 'Not quite. '} {active.explanation}
							</div>
						)}
					</div>
				) : (
					<div className="card-surface p-6">No questions yet.</div>
				)}
			</div>
		</section>
	)
}


