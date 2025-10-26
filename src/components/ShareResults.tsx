type Props = { correct: boolean; streak: number; questionDate?: string };

export function ShareResults({ correct, streak, questionDate }: Props) {
  const text = `Seerah Daily Quiz ${questionDate ?? ''}\n${correct ? '✅' : '🟥'} ${streak} day streak\n`;
  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ text, title: 'Seerah Daily Quiz' });
      } else {
        await navigator.clipboard.writeText(text);
        alert('Copied results to clipboard');
      }
    } catch {}
  }
  return (
    <button onClick={share} style={{
      padding: '6px 10px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)'
    }}>Share</button>
  );
}


