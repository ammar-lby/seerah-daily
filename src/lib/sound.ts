import { readJson, writeJson } from './storage'

const SETTINGS_KEY = 'settings:sound'

type SoundSettings = { enabled: boolean }

let audioCtx: AudioContext | null = null
let settings: SoundSettings = readJson<SoundSettings>(SETTINGS_KEY, { enabled: true })

function ctx() {
	if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
	return audioCtx!
}

function now() { return ctx().currentTime }

function createChain(volume = 0.06, withEcho = false) {
	const ac = ctx()
	const master = ac.createGain()
	master.gain.value = volume
	let output: AudioNode = master
	if (withEcho) {
		const delay = ac.createDelay(0.35)
		delay.delayTime.value = 0.22
		const fb = ac.createGain(); fb.gain.value = 0.15
		master.connect(delay); delay.connect(fb); fb.connect(delay)
		delay.connect(ac.destination)
		output = master
	} else {
		master.connect(ac.destination)
	}
	return { ac, master, output }
}

function playTone({
	frequency,
	start = now(),
	duration = 0.15,
	type = 'sine' as OscillatorType,
	attack = 0.01,
	decay = 0.08,
	volume = 0.08,
	glideTo,
	glideTime = 0.08,
	withEcho = false,
	detune = 0,
}: {
	frequency: number
	start?: number
	duration?: number
	type?: OscillatorType
	attack?: number
	decay?: number
	volume?: number
	glideTo?: number
	glideTime?: number
	withEcho?: boolean
	detune?: number
}) {
	const { ac, master } = createChain(volume, withEcho)
	const osc = ac.createOscillator()
	const env = ac.createGain()
	osc.type = type
	osc.frequency.value = frequency
	osc.detune.value = detune
	osc.connect(env).connect(master)

	// Envelope
	env.gain.setValueAtTime(0, start)
	env.gain.linearRampToValueAtTime(1, start + attack)
	env.gain.linearRampToValueAtTime(0.0001, start + attack + Math.max(0, duration - attack) + decay)

	// Glide
	if (glideTo != null) {
		osc.frequency.setValueAtTime(frequency, start)
		osc.frequency.exponentialRampToValueAtTime(Math.max(1, glideTo), start + glideTime)
	}

	osc.start(start)
	osc.stop(start + attack + Math.max(0, duration - attack) + decay + 0.02)
	osc.onended = () => { try { osc.disconnect(); env.disconnect(); master.disconnect() } catch {} }
}

function arpeggio(baseHz: number, intervals: number[], stepMs = 110, opts?: Partial<Parameters<typeof playTone>[0]>) {
	const t0 = now()
	intervals.forEach((semitones, i) => {
		const f = baseHz * Math.pow(2, semitones / 12)
		playTone({ frequency: f, start: t0 + i * (stepMs / 1000), ...opts })
	})
}

export function isSoundEnabled() { return settings.enabled }
export function setSoundEnabled(enabled: boolean) {
	settings = { enabled }
	writeJson(SETTINGS_KEY, settings)
}

// More playful UI sounds
export function playSelect() {
	if (!settings.enabled) return
	// Quick upward blip with slight detune spread
	playTone({ frequency: 420, duration: 0.08, type: 'triangle', glideTo: 520, glideTime: 0.06, volume: 0.04 })
	playTone({ frequency: 420, duration: 0.08, type: 'triangle', glideTo: 520, glideTime: 0.06, volume: 0.02, detune: +12 })
}

export function playCorrect() {
	if (!settings.enabled) return
	// Cheery arpeggio (major triad + octave) with echo
	arpeggio(523.25, [0, 4, 7, 12], 95, { type: 'sine', duration: 0.14, attack: 0.01, decay: 0.12, volume: 0.06, withEcho: true })
	// Add a second quick sparkle on top
	setTimeout(() => arpeggio(784.0, [0, 7, 12], 80, { type: 'triangle', duration: 0.1, volume: 0.04 }), 90)
}

export function playIncorrect() {
	if (!settings.enabled) return
	// Downward "wah" with slight grit
	playTone({ frequency: 360, type: 'sawtooth', duration: 0.18, glideTo: 180, glideTime: 0.16, attack: 0.01, decay: 0.08, volume: 0.05 })
	setTimeout(() => playTone({ frequency: 220, type: 'square', duration: 0.12, attack: 0.01, decay: 0.1, volume: 0.04 }), 120)
}

export function playXP() {
	if (!settings.enabled) return
	// Sparkly fast top-end notes
	arpeggio(880, [0, 5, 12], 70, { type: 'square', duration: 0.09, attack: 0.01, decay: 0.09, volume: 0.05 })
}
