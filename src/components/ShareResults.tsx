type Props = {
  dateISO?: string;
  correct: number;
  total: number;
  streak: number;
  points: number;
  accuracyPct: number;
};

function theme() {
	// Force light theme palette
	return {
		bgStart: '#117f6a', bgEnd: '#2ec4a6',
		panel: 'rgba(255,255,255,0.94)',
		text: '#18312c', sub: '#6a8f84',
		primary: '#117f6a', accent: '#dfb67e',
		cardBg: 'rgba(16, 53, 60, 0.05)', cardStroke: 'rgba(24,49,44,0.12)',
		shadow: 'rgba(0,0,0,0.15)'
	}
}

function drawShareCard(canvas: HTMLCanvasElement, opts: { date?: string; correct: number; total: number; streak: number; points: number; accuracyPct: number }) {
	const w = 1200, h = 630; // social-friendly size
	canvas.width = w; canvas.height = h;
	const ctx = canvas.getContext('2d')!;
	const t = theme();

	// Background gradient
	const g = ctx.createLinearGradient(0, 0, w, h);
	g.addColorStop(0, t.bgStart);
	g.addColorStop(1, t.bgEnd);
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, w, h);

	// Subtle diagonal pattern overlay
	ctx.save();
	ctx.globalAlpha = 0.06;
	ctx.strokeStyle = '#ffffff';
	for (let x = -h; x < w; x += 40) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x + h, h);
		ctx.stroke();
	}
	ctx.restore();

	// Panel with shadow
	ctx.save();
	ctx.shadowColor = t.shadow;
	ctx.shadowBlur = 24;
	roundRect(ctx, 60, 60, w - 120, h - 120, 28, false, false);
	ctx.fillStyle = t.panel;
	ctx.fill();
	ctx.restore();

	// Header brand row
	// Emblem
	const headerY = 120;
	ctx.beginPath();
	ctx.arc(100, headerY - 14, 22, 0, Math.PI * 2);
	ctx.fillStyle = t.accent;
	ctx.fill();
	// Small inner mark
	ctx.beginPath();
	ctx.arc(100, headerY - 14, 10, 0, Math.PI * 2);
	ctx.fillStyle = t.primary;
	ctx.fill();
	// Brand text
	ctx.fillStyle = t.text;
	ctx.font = '800 64px "Plus Jakarta Sans", Segoe UI, Arial';
	ctx.fillText('Seerahly', 150, headerY);
	ctx.fillStyle = t.sub;
	ctx.font = '700 28px "Plus Jakarta Sans", Segoe UI, Arial';
	ctx.fillText(opts.date ? `Date: ${opts.date}` : 'Daily Quiz', 150, headerY + 34);

	// Divider
	ctx.strokeStyle = t.sub;
	ctx.globalAlpha = 0.15;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(90, headerY + 56);
	ctx.lineTo(w - 90, headerY + 56);
	ctx.stroke();
	ctx.globalAlpha = 1;

	// Stats tiles
	const gridTop = headerY + 120;
	const tileW = Math.floor((w - 220) / 3);
	const tileH = 160;
	const tiles = [
		{ label: 'Correct', value: `${opts.correct}/${opts.total}` },
		{ label: 'Accuracy', value: `${opts.accuracyPct}%` },
		{ label: 'Points', value: `${opts.points}` },
	];
	for (let i = 0; i < tiles.length; i++) {
		const x = 90 + i * (tileW + 20);
		// tile background
		ctx.fillStyle = t.cardBg;
		roundRect(ctx, x, gridTop, tileW, tileH, 18, true, false);
		// tile stroke
		ctx.strokeStyle = t.cardStroke;
		ctx.lineWidth = 2;
		roundRect(ctx, x, gridTop, tileW, tileH, 18, false, true);
		// value
		ctx.fillStyle = t.text;
		ctx.font = '800 56px "Plus Jakarta Sans", Segoe UI, Arial';
		ctx.fillText(tiles[i].value, x + 24, gridTop + 80);
		// label
		ctx.fillStyle = t.sub;
		ctx.font = '700 24px "Plus Jakarta Sans", Segoe UI, Arial';
		ctx.fillText(tiles[i].label, x + 24, gridTop + 112);
	}

	// Streak badge row
	const streakY = gridTop + tileH + 60;
	ctx.fillStyle = t.text;
	ctx.font = '800 48px "Plus Jakarta Sans", Segoe UI, Arial';
	ctx.fillText(`Streak: ${opts.streak} day${opts.streak === 1 ? '' : 's'}`, 90, streakY);

	// Domain watermark bottom-right
	ctx.fillStyle = t.sub;
	ctx.font = '700 28px "Plus Jakarta Sans", Segoe UI, Arial';
	const domain = 'seerahly.com';
	const wText = ctx.measureText(domain).width;
	ctx.fillText(domain, w - 90 - wText, h - 80);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: boolean, stroke: boolean) {
	if (typeof r === 'number') { r = Math.min(r, w/2, h/2); }
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
	if (fill) ctx.fill();
	if (stroke) ctx.stroke();
}

export function ShareResults({ dateISO, correct, total, streak, points, accuracyPct }: Props) {
	const text = `Seerahly ${dateISO ?? ''}\nCorrect: ${correct}/${total}\nAccuracy: ${accuracyPct}%\nPoints: ${points}\nStreak: ${streak} day${streak === 1 ? '' : 's'}\nseerahly.com`;

	async function share() {
		try {
			const canvas = document.createElement('canvas');
			drawShareCard(canvas, { date: dateISO, correct, total, streak, points, accuracyPct });
			const blob: Blob = await new Promise((resolve) => canvas.toBlob(b => resolve(b as Blob), 'image/png', 0.95)!);
			const file = new File([blob], 'seerahly.png', { type: 'image/png' });
			// Try Web Share with image file
			if ((navigator as any).canShare && (navigator as any).canShare({ files: [file] }) && navigator.share) {
				await navigator.share({ files: [file], text, title: 'Seerahly' });
				return;
			}
			// Fallback: download image
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url; a.download = 'seerahly.png';
			document.body.appendChild(a); a.click(); a.remove();
			URL.revokeObjectURL(url);
		} catch {
			try {
				await navigator.clipboard.writeText(text);
				alert('Copied results to clipboard');
			} catch {}
		}
	}
	return (
		<button onClick={share} style={{
			padding: '6px 10px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)'
		}}>Share</button>
	);
}


