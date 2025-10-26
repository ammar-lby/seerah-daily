type Props = { count: number };

export function StreakBadge({ count }: Props) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 14px',
      borderRadius: 8,
      background: 'var(--secondary)',
      color: 'white',
      fontWeight: 700,
      fontSize: 14,
    }}>
      <span>{count}</span>
      <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.9 }}>day streak</span>
    </div>
  );
}


