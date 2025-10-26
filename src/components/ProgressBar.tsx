type Props = { current: number; total: number };

export function ProgressBar({ current, total }: Props) {
  const pct = (current / total) * 100;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      <div style={{
        flex: 1,
        height: 8,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 999,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: 'var(--primary)',
          transition: 'width 300ms ease',
        }} />
      </div>
      <div style={{
        color: 'var(--muted)',
        fontSize: 13,
        fontWeight: 600,
        minWidth: 48,
        textAlign: 'right',
      }}>
        {current}/{total}
      </div>
    </div>
  );
}

