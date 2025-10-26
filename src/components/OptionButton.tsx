import { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  state?: 'default' | 'selected' | 'correct' | 'incorrect';
};

export function OptionButton({ state = 'default', disabled, children, ...rest }: Props) {
  const base = {
    padding: 'clamp(12px, 2.5vh, 14px) clamp(14px, 3vw, 18px)',
    borderRadius: '8px',
    border: '2px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text)',
    textAlign: 'left' as const,
    width: '100%',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all .2s ease',
    fontSize: 'clamp(14px, 3vw, 16px)',
    fontWeight: 500,
    lineHeight: 1.5,
  };

  const styles: Record<string, React.CSSProperties> = {
    default: {},
    selected: {
      borderColor: 'var(--primary)',
      background: 'var(--primary-10)',
      fontWeight: 600,
      boxShadow: '0 0 0 2px var(--primary-20)',
    },
    correct: {
      borderColor: 'var(--success)',
      background: 'var(--success-bg)',
      color: 'var(--success-dark)',
      fontWeight: 600,
    },
    incorrect: {
      borderColor: 'var(--danger)',
      background: 'var(--danger-bg)',
      color: 'var(--danger)',
      fontWeight: 600,
    },
  };

  return (
    <button className={state !== 'default' ? 'flip-reveal' : undefined} style={{ ...base, ...styles[state] }} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}


