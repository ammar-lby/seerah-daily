import { PropsWithChildren } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
};

export function HelpModal({ open, onClose, title = 'How to play', children }: PropsWithChildren<Props>) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={title} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 1000,
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 'min(680px, 92vw)', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 16, padding: 16,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', padding: '6px 10px', borderRadius: 10 }}>Close</button>
        </div>
        <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
          {children}
        </div>
      </div>
    </div>
  );
}


