type Props = {
  dateISO?: string;
  correct: number;
  total: number;
  streak: number;
  points: number;
  accuracyPct: number;
};

function drawShareCard(canvas: HTMLCanvasElement, opts: { date?: string; correct: number; total: number; streak: number; points: number; accuracyPct: number }) {
	const w = 1200, h = 630; // social-friendly size
	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
	canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
	const ctx = canvas.getContext('2d')!;
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

	// Background gradient
	const g = ctx.createLinearGradient(0, 0, w, h);
	g.addColorStop(0, '#117f6a');
	g.addColorStop(1, '#2ec4a6');
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, w, h);

	// Panel with soft shadow
	ctx.save();
	ctx.shadowColor = 'rgba(0,0,0,0.18)';
	ctx.shadowBlur = 28;
	roundRect(ctx, 60, 60, w - 120, h - 120, 28, false, false);
	ctx.fillStyle = 'rgba(255,255,255,0.96)';
	ctx.fill();
	ctx.restore();

	// Header brand row
	const headerY = 140;
	// Emblem circle
	ctx.beginPath();
	ctx.arc(102, headerY - 20, 22, 0, Math.PI * 2);
	ctx.fillStyle = '#dfb67e';
	ctx.fill();
	// Inner mark
	ctx.beginPath();
	ctx.arc(102, headerY - 20, 10, 0, Math.PI * 2);
	ctx.fillStyle = '#117f6a';
	ctx.fill();
	// Brand text
	ctx.fillStyle = '#18312c';
	ctx.font = '800 64px "Plus Jakarta Sans", Segoe UI, Arial';
	ctx.fillText('Seerahly', 150, headerY);
	// Date subtitle
	ctx.fillStyle = '#6a8f84';
	ctx.font = '700 28px "Plus Jakarta Sans", Segoe UI, Arial';
	ctx.fillText(opts.date ? `Date: ${opts.date}` : 'Daily Quiz', 150, headerY + 32);

	// Divider
	ctx.strokeStyle = 'rgba(24,49,44,0.15)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(90, headerY + 50);
	ctx.lineTo(w - 90, headerY + 50);
	ctx.stroke();

	// Stats tiles
	const gridTop = headerY + 100;
	const tileW = Math.floor((w - 220) / 3);
	const tileH = 168;
	const tiles = [
		{ label: 'Correct', value: `${opts.correct}/${opts.total}` },
		{ label: 'Accuracy', value: `${opts.accuracyPct}%` },
		{ label: 'Points', value: `${opts.points}` },
	];
	for (let i = 0; i < tiles.length; i++) {
		const x = 90 + i * (tileW + 20);
		// tile background
		ctx.fillStyle = 'rgba(16, 53, 60, 0.05)';
		roundRect(ctx, x, gridTop, tileW, tileH, 18, true, false);
		// tile stroke
		ctx.strokeStyle = 'rgba(24,49,44,0.12)';
		ctx.lineWidth = 2;
		roundRect(ctx, x, gridTop, tileW, tileH, 18, false, true);
		// value
		ctx.fillStyle = '#18312c';
		ctx.font = '800 56px "Plus Jakarta Sans", Segoe UI, Arial';
		ctx.fillText(tiles[i].value, x + 24, gridTop + 84);
		// label
		ctx.fillStyle = '#6a8f84';
		ctx.font = '700 24px "Plus Jakarta Sans", Segoe UI, Arial';
		ctx.fillText(tiles[i].label, x + 24, gridTop + 116);
	}

	// Streak row
	ctx.fillStyle = '#18312c';
	ctx.font = '800 48px "Plus Jakarta Sans", Segoe UI, Arial';
	ctx.fillText(`Streak: ${opts.streak} day${opts.streak === 1 ? '' : 's'}`, 90, gridTop + tileH + 68);

	// Domain watermark bottom-right
	ctx.fillStyle = '#6a8f84';
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
			display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
			padding: 'clamp(12px, 2.8vh, 14px) clamp(18px, 4.5vw, 24px)',
			borderRadius: 12,
			border: '2px solid #204149',
			background: '#102529',
			color: '#e6f3f0',
			fontWeight: 800,
			fontSize: 'clamp(13px, 3.2vw, 15px)',
			boxShadow: '0 6px 16px rgba(0,0,0,0.25)'
		}}>Share</button>
	);
}


