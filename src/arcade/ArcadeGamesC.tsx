import React, { useEffect, useState } from 'react';
import { Crown, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { RoyalButton } from '../components/ui/RoyalUI';
import { soundEngine } from '../audio/soundEngine';
import type { GameProps } from './ArcadeGamesA';

/* 11. MAGICAL MAZE */
const MAZE_GRID = [
  [0, 0, 1, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 1, 0],
  [0, 0, 0, 0, 1, 0, 0],
  [0, 1, 1, 0, 0, 0, 1],
  [0, 0, 1, 1, 1, 0, 0],
  [1, 0, 0, 0, 0, 1, 0],
  [1, 1, 1, 0, 0, 0, 2],
];

export const MagicalMazeGame: React.FC<GameProps> = ({ onFinish }) => {
  const [pos, setPos] = useState({ r: 0, c: 0 });
  const [moves, setMoves] = useState(0);

  const move = (dr: number, dc: number) => {
    const nr = pos.r + dr;
    const nc = pos.c + dc;
    if (nr < 0 || nc < 0 || nr >= 7 || nc >= 7 || MAZE_GRID[nr][nc] === 1) return;
    soundEngine.playSfx('footstep');
    setPos({ r: nr, c: nc });
    setMoves((m) => m + 1);
    if (MAZE_GRID[nr][nc] === 2) {
      soundEngine.playSfx('achievement');
      onFinish(Math.max(50, 140 - moves * 3), true);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') move(-1, 0);
      if (e.key === 'ArrowDown') move(1, 0);
      if (e.key === 'ArrowLeft') move(0, -1);
      if (e.key === 'ArrowRight') move(0, 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, moves]);

  return (
    <div className="space-y-4 text-center">
      <div className="text-xs text-[#75476F]">Guide Princess Akuu to the Golden Crown! (Moves: {moves})</div>
      <div className="grid grid-cols-7 gap-1 max-w-xs mx-auto">
        {MAZE_GRID.map((row, r) =>
          row.map((cell, c) => {
            const isPlayer = pos.r === r && pos.c === c;
            return (
              <div
                key={`${r}-${c}`}
                className={`aspect-square rounded-md flex items-center justify-center text-sm ${
                  cell === 1 ? 'bg-[#75476F]' : cell === 2 ? 'bg-[#E8C98C]/60' : 'bg-[#FFF9F7] border border-[#E8C98C]/40'
                }`}
              >
                {isPlayer ? '👸' : cell === 2 ? <Crown className="w-4 h-4 text-[#75476F]" /> : null}
              </div>
            );
          })
        )}
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <RoyalButton variant="secondary" size="sm" onClick={() => move(-1, 0)}><ArrowUp className="w-4 h-4" /></RoyalButton>
        <div className="flex gap-2">
          <RoyalButton variant="secondary" size="sm" onClick={() => move(0, -1)}><ArrowLeft className="w-4 h-4" /></RoyalButton>
          <RoyalButton variant="secondary" size="sm" onClick={() => move(1, 0)}><ArrowDown className="w-4 h-4" /></RoyalButton>
          <RoyalButton variant="secondary" size="sm" onClick={() => move(0, 1)}><ArrowRight className="w-4 h-4" /></RoyalButton>
        </div>
      </div>
    </div>
  );
};

/* 12. BUTTERFLY COLLECTOR */
export const ButterflyCollectorGame: React.FC<GameProps> = ({ onFinish }) => {
  const [count, setCount] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [timeLeft, setTimeLeft] = useState(14);

  useEffect(() => {
    const t = window.setInterval(() => setTimeLeft((x) => (x <= 1 ? 0 : x - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) onFinish(count * 12, count >= 5);
  }, [timeLeft, count, onFinish]);

  const catchOne = () => {
    soundEngine.playSfx('wings');
    setCount((c) => c + 1);
    setPos({ x: 15 + Math.random() * 70, y: 15 + Math.random() * 70 });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm font-semibold text-[#3B2138] tabular-nums">
        <span>Butterflies: {count}</span>
        <span>Time: {timeLeft}s</span>
      </div>
      <div className="relative h-64 rounded-2xl bg-gradient-to-br from-[#CDE9FA]/60 to-[#F9DCE7]/70 border border-[#E8C98C] overflow-hidden">
        <button
          onClick={catchOne}
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl hover:scale-125 transition-all cursor-pointer"
        >
          🦋
        </button>
      </div>
    </div>
  );
};

/* 13. BUILD YOUR DREAM CASTLE */
export const BuildCastleGame: React.FC<GameProps> = ({ onFinish }) => {
  const [blocks, setBlocks] = useState<number[]>([]);
  const [cursor, setCursor] = useState(50);

  useEffect(() => {
    let dir = 1;
    const t = window.setInterval(() => {
      setCursor((c) => {
        if (c >= 82) dir = -1;
        if (c <= 18) dir = 1;
        return c + dir * 4;
      });
    }, 40);
    return () => clearInterval(t);
  }, []);

  const dropBlock = () => {
    soundEngine.playSfx('pop');
    const next = [...blocks, cursor];
    setBlocks(next);
    if (next.length >= 6) {
      const avgOffset = next.reduce((acc, x) => acc + Math.abs(x - 50), 0) / next.length;
      const score = Math.max(40, Math.round(120 - avgOffset * 2));
      onFinish(score, true);
    }
  };

  return (
    <div className="space-y-4 text-center">
      <div className="text-xs text-[#75476F]">Stack 6 castle towers neatly near the center! ({blocks.length}/6)</div>
      <div className="relative h-64 max-w-sm mx-auto rounded-2xl bg-[#FFF9F7] border border-[#E8C98C] overflow-hidden flex flex-col-reverse items-center pb-3">
        {blocks.map((x, idx) => (
          <div
            key={idx}
            style={{ marginLeft: `${(x - 50) * 1.5}px` }}
            className="w-24 h-7 bg-[#F6B6CE] border border-[#E8C98C] rounded-md mb-0.5"
          />
        ))}
        <div
          style={{ left: `${cursor}%` }}
          className="absolute top-4 -translate-x-1/2 w-24 h-7 bg-[#E8C98C] rounded-md shadow"
        />
      </div>
      <RoyalButton variant="primary" onClick={dropBlock}>
        Drop Tower Section
      </RoyalButton>
    </div>
  );
};

/* 14. MATCH THE PEARLS */
const PEARL_COLORS = ['#F6B6CE', '#DCCCFB', '#E8C98C', '#CDE9FA', '#F18CAF'];
export const MatchPearlsGame: React.FC<GameProps> = ({ onFinish }) => {
  const [board, setBoard] = useState<string[]>(() =>
    Array.from({ length: 25 }, () => PEARL_COLORS[Math.floor(Math.random() * PEARL_COLORS.length)])
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [turns, setTurns] = useState(10);

  const clickPearl = (idx: number) => {
    if (selected === null) {
      setSelected(idx);
      return;
    }
    const next = [...board];
    [next[selected], next[idx]] = [next[idx], next[selected]];
    setSelected(null);

    // Check 3-in-a-row horizontally
    let gained = 0;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 3; c++) {
        const i = r * 5 + c;
        if (next[i] === next[i + 1] && next[i] === next[i + 2]) {
          gained += 25;
          next[i] = PEARL_COLORS[Math.floor(Math.random() * PEARL_COLORS.length)];
          next[i + 1] = PEARL_COLORS[Math.floor(Math.random() * PEARL_COLORS.length)];
          next[i + 2] = PEARL_COLORS[Math.floor(Math.random() * PEARL_COLORS.length)];
        }
      }
    }
    soundEngine.playSfx(gained > 0 ? 'sparkle' : 'pop');
    const nextScore = score + gained + 5;
    setBoard(next);
    setScore(nextScore);
    const nextTurns = turns - 1;
    setTurns(nextTurns);
    if (nextTurns <= 0) onFinish(nextScore, nextScore >= 70);
  };

  return (
    <div className="space-y-4 text-center">
      <div className="flex justify-between text-sm font-semibold text-[#3B2138] tabular-nums max-w-xs mx-auto">
        <span>Score: {score}</span>
        <span>Turns Left: {turns}</span>
      </div>
      <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
        {board.map((c, i) => (
          <button
            key={i}
            onClick={() => clickPearl(i)}
            className={`aspect-square rounded-full border-2 cursor-pointer transition-transform ${
              selected === i ? 'border-[#3B2138] scale-110' : 'border-white shadow-sm'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
};

/* 15. AKUU'S MYSTERY QUIZ */
export const MysteryQuizGame: React.FC<GameProps> = ({ onFinish }) => {
  const QUESTIONS = [
    { q: 'Which flower blooms brightest in Akuu’s kingdom?', opts: ['Blush Rose', 'Cactus', 'Dandelion'], ans: 'Blush Rose' },
    { q: 'Who created this entire Princess World for Akuu?', opts: ['A Royal Wizard', 'Tarun ♡', 'The Clouds'], ans: 'Tarun ♡' },
    { q: 'What spells out in golden stars at the Grand Finale?', opts: ['CASTLE', 'A K U U', 'MAGIC'], ans: 'A K U U' },
    { q: 'What is Mochi in the Kitty Kingdom?', opts: ['A Blush Kitten', 'A Dragon', 'A Frog'], ans: 'A Blush Kitten' },
  ];
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);

  const answer = (opt: string) => {
    const right = opt === QUESTIONS[idx].ans;
    soundEngine.playSfx(right ? 'heart' : 'pop');
    const nextScore = score + (right ? 30 : 10);
    if (idx + 1 >= QUESTIONS.length) {
      onFinish(nextScore, nextScore >= 80);
    } else {
      setScore(nextScore);
      setIdx(idx + 1);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-5 text-center py-4">
      <div className="text-xs text-[#75476F] tabular-nums">Question {idx + 1} / {QUESTIONS.length} · Score {score}</div>
      <h3 className="font-royal text-2xl sm:text-3xl text-[#3B2138]">{QUESTIONS[idx].q}</h3>
      <div className="space-y-2.5">
        {QUESTIONS[idx].opts.map((o) => (
          <button
            key={o}
            onClick={() => answer(o)}
            className="w-full p-4 rounded-2xl border border-[#E8C98C]/60 bg-white hover:bg-[#F9DCE7]/60 text-sm font-medium text-[#3B2138] cursor-pointer"
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
};
