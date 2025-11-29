type Props = { count: number };

export function StreakBadge({ count }: Props) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 8px',
      borderRadius: 6,
      background: 'rgba(255,255,255,0.2)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.3)',
      color: 'white',
      fontWeight: 700,
      fontSize: 'clamp(11px, 2.3vw, 12px)',
    }}>
      <span style={{ fontSize: 'clamp(12px, 2.5vw, 14px)', marginRight: 2 }}>🔥</span>
      <span>{count}</span>
    </div>
  );
}


