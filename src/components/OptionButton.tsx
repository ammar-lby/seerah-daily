import { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  state?: 'default' | 'selected' | 'correct' | 'incorrect';
};

export function OptionButton({ state = 'default', disabled, children, ...rest }: Props) {
  const base = {
    padding: 'clamp(12px, 2.5vh, 14px) clamp(14px, 3vw, 18px)',
    borderRadius: '10px',
    border: '2px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text)',
    textAlign: 'center' as const,
    width: '100%',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'transform .12s ease, box-shadow .12s ease, background .2s ease, border-color .2s ease',
    fontSize: 'clamp(14px, 3vw, 16px)',
    fontWeight: 600,
    lineHeight: 1.4,
    minHeight: 'clamp(64px, 16vh, 120px)',
  } as const;

  const styles: Record<string, React.CSSProperties> = {
    default: {},
    selected: {
      borderColor: 'var(--primary)',
      background: 'var(--primary-10)',
      boxShadow: '0 0 0 2px var(--primary-20)'
    },
    correct: {
      borderColor: 'var(--success)',
      background: 'var(--success-bg)',
      color: 'var(--success-dark)',
      fontWeight: 700,
    },
    incorrect: {
      borderColor: 'var(--danger)',
      background: 'var(--danger-bg)',
      color: 'var(--danger)',
      fontWeight: 700,
    },
  };

  return (
    <button
      className={state !== 'default' ? 'flip-reveal option-btn' : 'option-btn'}
      data-state={state}
      style={{ ...base, ...styles[state] }}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}


