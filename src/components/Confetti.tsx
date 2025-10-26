import { useEffect, useMemo, useState } from 'react';

type Particle = { left: string; background: string; animation: string };

export function Confetti({ trigger }: { trigger: number }) {
  const [burst, setBurst] = useState(0);
  const particles = useMemo<Particle[]>(() => {
    const arr: Particle[] = [];
    const colors = ['#2fa9a0', '#77c3ff', '#ffd166', '#38b26b', '#e25555'];
    for (let i = 0; i < 60; i++) {
      const left = Math.random() * 100;
      const xend = (Math.random() - 0.5) * 40;
      const dur = 1200 + Math.random() * 800;
      arr.push({
        left: `${left}%`,
        background: colors[i % colors.length],
        animation: `fall ${dur}ms ease-out forwards`,
      });
    }
    return arr;
  }, [burst]);

  useEffect(() => {
    if (trigger > 0) setBurst((b) => b + 1);
  }, [trigger]);

  if (burst === 0) return null;
  return (
    <div className="confetti" aria-hidden>
      {particles.map((p, i) => (
        <div key={i} className="p" style={{ left: p.left, background: p.background, animation: p.animation }} />
      ))}
    </div>
  );
}


