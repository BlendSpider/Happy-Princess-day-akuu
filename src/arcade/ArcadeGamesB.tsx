import React, { useEffect, useRef, useState } from 'react';
import { Star, Gem, Cake } from 'lucide-react';
import { RoyalButton } from '../components/ui/RoyalUI';
import { soundEngine } from '../audio/soundEngine';
import type { GameProps } from './ArcadeGamesA';

/* 6. FIND THE HIDDEN STARS */
export const HiddenStarsGame: React.FC<GameProps> = ({ onFinish }) => {
  const [stars] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: 12 + (i * 15) % 78,
      y: 15 + ((i * 29) % 68),
    }))
  );
  const [found, setFound] = useState<number[]>([]);

  const tapStar = (id: number) => {
    if (found.includes(id)) return;
    soundEngine.playSfx('chime');
    const next = [...found, id];
    setFound(next);
    if (next.length === stars.length) {
      onFinish(100, true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-[#3B2138] tabular-nums">
        Stars Found: {found.length} / {stars.length}
      </div>
      <div className="relative h-72 rounded-2xl bg-gradient-to-b from-[#160D21] to-[#3B214D] border border-[#E8C98C] overflow-hidden">
        {stars.map((s) => {
          const isFound = found.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => tapStar(s.id)}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full cursor-pointer transition-transform ${
                isFound ? 'bg-[#E8C98C] text-[#3B2138] scale-110' : 'text-[#FFF3D6]/55 hover:text-[#FFF3D6]'
              }`}
            >
              <Star className="w-5 h-5 fill-current" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* 7. ROYAL TREASURE HUNT */
export const TreasureHuntGame: React.FC<GameProps> = ({ onFinish }) => {
  const [target] = useState(() => Math.floor(Math.random() * 16));
  const [dug, setDug] = useState<number[]>([]);
  const [hint, setHint] = useState('Tap any tile in the courtyard to search for the hidden ruby crown.');

  const dig = (idx: number) => {
    if (dug.includes(idx)) return;
    const next = [...dug, idx];
    setDug(next);
    if (idx === target) {
      soundEngine.playSfx('chest');
      onFinish(Math.max(40, 130 - next.length * 10), true);
      return;
    }
    soundEngine.playSfx('pop');
    const r1 = Math.floor(idx / 4);
    const c1 = idx % 4;
    const r2 = Math.floor(target / 4);
    const c2 = target % 4;
    const dist = Math.abs(r1 - r2) + Math.abs(c1 - c2);
    setHint(dist === 1 ? 'Very Warm! Right beside it!' : dist <= 2 ? 'Getting closer...' : 'Cooler — try further away.');
  };

  return (
    <div className="space-y-4 text-center">
      <div className="text-sm text-[#75476F]">{hint}</div>
      <div className="grid grid-cols-4 gap-2.5 max-w-xs mx-auto">
        {Array.from({ length: 16 }, (_, i) => {
          const isDug = dug.includes(i);
          return (
            <button
              key={i}
              onClick={() => dig(i)}
              className={`h-16 rounded-xl border text-xs font-semibold cursor-pointer ${
                isDug ? 'bg-[#F9DCE7] border-[#75476F]/30 text-[#75476F]' : 'bg-white border-[#E8C98C] text-[#3B2138] hover:bg-[#FFF9F7]'
              }`}
            >
              {isDug ? (i === target ? <Gem className="w-5 h-5 mx-auto text-[#E8C98C]" /> : '·') : '?'}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* 8. PRINCESS JIGSAW (3x3 Castle Swap Puzzle) */
export const PrincessJigsawGame: React.FC<GameProps> = ({ onFinish }) => {
  const [tiles, setTiles] = useState<number[]>(() => {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [swaps, setSwaps] = useState(0);

  const clickTile = (idx: number) => {
    soundEngine.playSfx('pop');
    if (selected === null) {
      setSelected(idx);
      return;
    }
    if (selected === idx) {
      setSelected(null);
      return;
    }
    const next = [...tiles];
    [next[selected], next[idx]] = [next[idx], next[selected]];
    setTiles(next);
    setSelected(null);
    setSwaps((s) => s + 1);
    if (next.every((v, i) => v === i)) {
      soundEngine.playSfx('achievement');
      onFinish(Math.max(50, 150 - swaps * 5), true);
    }
  };

  return (
    <div className="space-y-4 text-center">
      <div className="text-xs text-[#75476F]">Tap two tiles to swap them until the Royal Castle image aligns! (Swaps: {swaps})</div>
      <div className="grid grid-cols-3 gap-1.5 max-w-xs mx-auto aspect-square">
        {tiles.map((piece, idx) => {
          const row = Math.floor(piece / 3);
          const col = piece % 3;
          return (
            <button
              key={idx}
              onClick={() => clickTile(idx)}
              className={`rounded-lg border-2 overflow-hidden cursor-pointer ${
                selected === idx ? 'border-[#75476F] scale-95' : 'border-[#E8C98C]'
              }`}
              style={{
                backgroundImage: 'url(/src/assets/images/royal_castle_hero_1794980444296.jpg)',
                backgroundSize: '300% 300%',
                backgroundPosition: `${col * 50}% ${row * 50}%`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

/* 9. CUTE BUBBLE SHOOTER */
export const BubbleShooterGame: React.FC<GameProps> = ({ onFinish }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [shotsLeft, setShotsLeft] = useState(12);
  const targetsRef = useRef(
    Array.from({ length: 14 }, (_, i) => ({
      x: 45 + (i % 7) * 52,
      y: 42 + Math.floor(i / 7) * 48,
      color: ['#F6B6CE', '#DCCCFB', '#E8C98C', '#CDE9FA'][i % 4],
      alive: true,
    }))
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFF9F7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    targetsRef.current.forEach((b) => {
      if (!b.alive) return;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();
      ctx.strokeStyle = '#75476F';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
    // Launcher
    ctx.beginPath();
    ctx.arc(200, 260, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#F18CAF';
    ctx.fill();
  }, [score, shotsLeft]);

  const shootAt = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const cy = ((e.clientY - rect.top) / rect.height) * canvas.height;

    let hit = false;
    targetsRef.current.forEach((b) => {
      if (b.alive && Math.hypot(b.x - cx, b.y - cy) < 28) {
        b.alive = false;
        hit = true;
      }
    });
    soundEngine.playSfx(hit ? 'bubble' : 'pop');
    const nextScore = score + (hit ? 15 : 0);
    setScore(nextScore);
    const nextShots = shotsLeft - 1;
    setShotsLeft(nextShots);

    if (targetsRef.current.every((b) => !b.alive) || nextShots <= 0) {
      onFinish(nextScore, nextScore >= 60);
    }
  };

  return (
    <div className="space-y-4 text-center">
      <div className="flex justify-between text-sm font-semibold text-[#3B2138] tabular-nums max-w-md mx-auto">
        <span>Popped Score: {score}</span>
        <span>Shots Left: {shotsLeft}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={290}
        onClick={shootAt}
        className="w-full max-w-md mx-auto rounded-2xl border-2 border-[#E8C98C] cursor-crosshair"
      />
      <p className="text-xs text-[#75476F]">Tap directly on pastel bubbles to pop them!</p>
    </div>
  );
};

/* 10. BAKE A PRINCESS CAKE RUSH */
export const BakeCakeGame: React.FC<GameProps> = ({ onFinish }) => {
  const ORDERS = [
    ['Vanilla Sponge', 'Rose Frosting', 'Strawberries'],
    ['Strawberry Sponge', 'Gold Frosting', 'Pearl Sprinkles'],
    ['Lavender Sponge', 'Rose Frosting', 'Macaron Topper'],
  ];
  const INGREDIENTS = ['Vanilla Sponge', 'Strawberry Sponge', 'Lavender Sponge', 'Rose Frosting', 'Gold Frosting', 'Strawberries', 'Pearl Sprinkles', 'Macaron Topper'];

  const [orderIdx, setOrderIdx] = useState(0);
  const [tray, setTray] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const addIng = (ing: string) => {
    soundEngine.playSfx('pop');
    const target = ORDERS[orderIdx];
    const nextTray = [...tray, ing];
    setTray(nextTray);
    if (nextTray.length === 3) {
      const match = nextTray.every((x, i) => x === target[i]);
      soundEngine.playSfx(match ? 'chime' : 'pop');
      const nextScore = score + (match ? 40 : 15);
      if (orderIdx + 1 >= ORDERS.length) {
        onFinish(nextScore, nextScore >= 80);
      } else {
        setScore(nextScore);
        setOrderIdx(orderIdx + 1);
        setTray([]);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-5 text-center">
      <div className="flex justify-between text-sm font-semibold text-[#3B2138] tabular-nums">
        <span>Order {orderIdx + 1} / {ORDERS.length}</span>
        <span>Score: {score}</span>
      </div>
      <div className="p-4 rounded-2xl bg-[#F9DCE7]/60 border border-[#E8C98C]">
        <div className="text-xs text-[#75476F] mb-1 inline-flex items-center gap-1">
          <Cake className="w-3.5 h-3.5" />
          Assemble in order:
        </div>
        <div className="font-semibold text-sm text-[#3B2138]">{ORDERS[orderIdx].join(' → ')}</div>
        <div className="text-xs text-[#75476F] mt-2">Your tray: {tray.join(' → ') || 'Empty'}</div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {INGREDIENTS.map((ing) => (
          <RoyalButton key={ing} variant="secondary" size="sm" onClick={() => addIng(ing)} className="text-xs">
            {ing}
          </RoyalButton>
        ))}
      </div>
    </div>
  );
};
