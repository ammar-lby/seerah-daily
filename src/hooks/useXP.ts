import { useCallback, useSyncExternalStore } from 'react'
import { readJson, writeJson } from '../lib/storage'

const KEY = 'xp'

let xpStore: number = readJson<number>(KEY, 0)
const subs = new Set<() => void>()

function emit() { subs.forEach(cb => cb()) }

function subscribe(cb: () => void) {
	subs.add(cb)
	return () => subs.delete(cb)
}

function getSnapshot() { return xpStore }

function setXP(next: number) {
	xpStore = Math.max(0, Math.floor(next))
	writeJson<number>(KEY, xpStore)
	emit()
}

export function useXP() {
	const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
	const add = useCallback((delta: number) => setXP(value + delta), [value])
	const reset = useCallback(() => setXP(0), [])
	return { xp: value, addXP: add, resetXP: reset } as const
}
