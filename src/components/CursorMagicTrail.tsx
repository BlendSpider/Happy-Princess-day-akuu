import React, { useEffect, useRef } from 'react';
import { useKingdom } from '../context/KingdomContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  kind: 'heart' | 'gold';
}

export const CursorMagicTrail: React.FC = () => {
  const { db } = useKingdom();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const enabled = db ? db.progress.preferences.cursorTrail && !db.progress.preferences.reducedMotion : true;

  useEffect(() => {
    if (!enabled) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const particles: Particle[] = [];
    let lastEmit = 0;
    let rafId = 0;

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastEmit < 32) return;
      lastEmit = now;
      if (particles.length > 36) particles.shift();
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.6 - Math.random() * 0.9,
        life: 0,
        maxLife: 36,
        size: 5 + Math.random() * 5,
        kind: Math.random() > 0.45 ? 'heart' : 'gold',
      });
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onMove, { passive: true });

    const drawHeart = (x: number, y: number, s: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s / 12, s / 12);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#F18CAF';
      ctx.beginPath();
      ctx.moveTo(0, 3);
      ctx.bezierCurveTo(0, 0, -6, 0, -6, 4);
      ctx.bezierCurveTo(-6, 7, 0, 10, 0, 12);
      ctx.bezierCurveTo(0, 10, 6, 7, 6, 4);
      ctx.bezierCurveTo(6, 0, 0, 0, 0, 3);
      ctx.fill();
      ctx.restore();
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        const alpha = Math.max(0, 1 - p.life / p.maxLife) * 0.7;
        if (p.kind === 'heart') {
          drawHeart(p.x, p.y, p.size, alpha);
        } else {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = '#E8C98C';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.35, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
};
