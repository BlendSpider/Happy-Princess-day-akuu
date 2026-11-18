import React, { useEffect, useRef, useState } from 'react';
import { Heart, Flower2, Sparkles, Cat, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { RoyalButton } from '../components/ui/RoyalUI';
import { soundEngine } from '../audio/soundEngine';

export interface GameProps {
  onFinish: (score: number, won: boolean) => void;
}

/* 1. CATCH THE FALLING HEARTS */
export const CatchHeartsGame: React.FC<GameProps> = ({ onFinish }) => {
  const [basketX, setBasketX] = useState(50);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number; gold: boolean }>>([]);
  const basketRef = useRef(50);
  basketRef.current = basketX;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setBasketX((x) => Math.max(10, x - 9));
      if (e.key === 'ArrowRight') setBasketX((x) => Math.min(90, x + 9));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      onFinish(score, score >= 40);
    }
  }, [timeLeft, score, onFinish]);

  useEffect(() => {
    if (timeLeft === 0) return;
    const loop = window.setInterval(() => {
      setHearts((prev) => {
        const next: typeof prev = [];
        prev.forEach((h) => {
          const ny = h.y + 4.5;
          if (ny >= 80 && ny <= 94 && Math.abs(h.x - basketRef.current) < 13) {
            soundEngine.playSfx('heart');
            setScore((s) => s + (h.gold ? 20 : 10));
          } else if (ny < 98) {
            next.push({ ...h, y: ny });
          }
        });
        if (Math.random() < 0.28) {
          next.push({
            id: Date.now() + Math.random(),
            x: 10 + Math.random() * 80,
            y: 4,
            gold: Math.random() < 0.2,
          });
        }
        return next;
      });
    }, 80);
    return () => clearInterval(loop);
  }, [timeLeft]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm font-semibold text-[#3B2138] tabular-nums">
        <span>Score: {score}</span>
        <span>Time: {timeLeft}s</span>
      </div>
      <div
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = ((e.clientX - rect.left) / rect.width) * 100;
          setBasketX(Math.max(10, Math.min(90, pct)));
        }}
        className="relative h-80 rounded-2xl bg-gradient-to-b from-[#2B1730] to-[#683A63] border border-[#E8C98C] overflow-hidden touch-none cursor-ew-resize"
      >
        {hearts.map((h) => (
          <Heart
            key={h.id}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            className={`absolute -translate-x-1/2 w-6 h-6 ${
              h.gold ? 'text-[#E8C98C] fill-[#E8C98C]' : 'text-[#F6B6CE] fill-[#F6B6CE]'
            }`}
          />
        ))}
        <div
          style={{ left: `${basketX}%` }}
          className="absolute bottom-4 -translate-x-1/2 w-24 h-7 rounded-full bg-[#FFF9F7] border-2 border-[#E8C98C] flex items-center justify-center text-[11px] font-bold text-[#75476F]"
        >
          Basket
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <RoyalButton variant="secondary" size="sm" onClick={() => setBasketX((x) => Math.max(10, x - 14))}>
          <ArrowLeft className="w-4 h-4" />
        </RoyalButton>
        <RoyalButton variant="secondary" size="sm" onClick={() => setBasketX((x) => Math.min(90, x + 14))}>
          <ArrowRight className="w-4 h-4" />
        </RoyalButton>
      </div>
    </div>
  );
};

/* 2. PRINCESS DRESS-UP CHALLENGE */
export const DressUpChallengeGame: React.FC<GameProps> = ({ onFinish }) => {
  const ROUNDS = [
    { theme: 'Midnight Ball', answer: 'Lavender Gown + Diamond Tiara', choices: ['Lavender Gown + Diamond Tiara', 'Garden Apron + Straw Hat', 'Sleep Pajamas + Slippers'] },
    { theme: 'Sakura Picnic', answer: 'Blush Tulle + Rose Crown', choices: ['Winter Cloak + Boots', 'Blush Tulle + Rose Crown', 'Armor Shield + Helmet'] },
    { theme: 'Royal Coronation', answer: 'Champagne Silk + Gold Tiara', choices: ['Champagne Silk + Gold Tiara', 'Beach Shorts + Sunglasses', 'Raincoat + Umbrella'] },
  ];
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);

  const pick = (choice: string) => {
    const correct = choice === ROUNDS[round].answer;
    soundEngine.playSfx(correct ? 'sparkle' : 'pop');
    const nextScore = score + (correct ? 35 : 10);
    if (round + 1 >= ROUNDS.length) {
      onFinish(nextScore, nextScore >= 70);
    } else {
      setScore(nextScore);
      setRound(round + 1);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-5 text-center py-4">
      <div className="text-xs text-[#75476F] tabular-nums">Round {round + 1} / {ROUNDS.length} · Score {score}</div>
      <h3 className="font-royal text-3xl text-[#3B2138]">Theme: {ROUNDS[round].theme}</h3>
      <p className="text-sm text-[#75476F]">Choose the most fitting royal ensemble for this occasion:</p>
      <div className="space-y-2.5">
        {ROUNDS[round].choices.map((c) => (
          <button
            key={c}
            onClick={() => pick(c)}
            className="w-full p-4 rounded-2xl border border-[#E8C98C]/60 bg-white hover:bg-[#F9DCE7]/60 text-sm font-medium text-[#3B2138] cursor-pointer transition-colors"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
};

/* 3. KITTY RESCUE */
export const KittyRescueGame: React.FC<GameProps> = ({ onFinish }) => {
  const [lane, setLane] = useState(1); // 0, 1, 2
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [puddleLane, setPuddleLane] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStep((s) => {
        if (s >= 14) {
          clearInterval(timer);
          return s;
        }
        return s + 1;
      });
      setPuddleLane(Math.floor(Math.random() * 3));
    }, 900);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (step === 0) return;
    if (lane === puddleLane) {
      soundEngine.playSfx('pop');
    } else {
      soundEngine.playSfx('hop');
      setScore((sc) => sc + 10);
    }
    if (step >= 14) {
      onFinish(score + (lane !== puddleLane ? 10 : 0), true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <div className="space-y-5 text-center">
      <div className="flex justify-between text-sm font-semibold text-[#3B2138] tabular-nums">
        <span>Mochi Steps: {step} / 14</span>
        <span>Score: {score}</span>
      </div>
      <div className="grid grid-cols-3 gap-3 h-52 p-4 rounded-2xl bg-[#F9DCE7]/45 border border-[#E8C98C]">
        {[0, 1, 2].map((l) => (
          <div key={l} className="rounded-xl bg-white/80 border border-[#E8C98C]/40 flex flex-col items-center justify-between p-3">
            <div className="text-xs text-[#75476F]/75">{puddleLane === l ? '💧 Puddle' : '✨ Clear'}</div>
            {lane === l && (
              <div className="p-2.5 rounded-full bg-[#F6B6CE] text-[#3B2138] shadow">
                <Cat className="w-6 h-6" />
              </div>
            )}
            <button
              onClick={() => setLane(l)}
              className="w-full py-1.5 rounded-lg bg-[#75476F] text-white text-xs font-medium cursor-pointer"
            >
              Lane {l + 1}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* 4. MAGICAL FLOWER GARDEN RUSH */
export const GardenRushGame: React.FC<GameProps> = ({ onFinish }) => {
  const [flowers, setFlowers] = useState<number[]>(Array(9).fill(0));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    const t = window.setInterval(() => {
      setTimeLeft((x) => (x <= 1 ? 0 : x - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) onFinish(score, score >= 60);
  }, [timeLeft, score, onFinish]);

  const water = (idx: number) => {
    soundEngine.playSfx('bloom');
    setFlowers((prev) => {
      const next = [...prev];
      next[idx] = (next[idx] + 1) % 3;
      if (next[idx] === 2) setScore((s) => s + 15);
      else setScore((s) => s + 5);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm font-semibold text-[#3B2138] tabular-nums">
        <span>Bloom Score: {score}</span>
        <span>Time: {timeLeft}s</span>
      </div>
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
        {flowers.map((stage, i) => (
          <button
            key={i}
            onClick={() => water(i)}
            className="h-24 rounded-2xl border border-[#E8C98C] bg-white hover:bg-[#F9DCE7]/50 flex flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <Flower2 className={`w-8 h-8 ${stage === 2 ? 'text-[#F18CAF]' : stage === 1 ? 'text-[#E8C98C]' : 'text-[#75476F]/30'}`} />
            <span className="text-[11px] text-[#75476F]">{stage === 2 ? 'Bloomed!' : 'Water'}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* 5. HEART MEMORY MATCH */
export const HeartMemoryGame: React.FC<GameProps> = ({ onFinish }) => {
  const SYMBOLS = ['👑', '🌸', '💖', '🦋', '🎀', '⭐', '🧁', '💎'];
  const [cards] = useState(() =>
    [...SYMBOLS, ...SYMBOLS].sort(() => Math.random() - 0.5).map((sym, i) => ({ id: i, sym }))
  );
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const flip = (id: number) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;
    soundEngine.playSfx('pop');
    const next = [...flipped, id];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (cards[a].sym === cards[b].sym) {
        soundEngine.playSfx('heart');
        const nextMatched = [...matched, a, b];
        setMatched(nextMatched);
        setFlipped([]);
        if (nextMatched.length === cards.length) {
          onFinish(Math.max(40, 140 - moves * 5), true);
        }
      } else {
        setTimeout(() => setFlipped([]), 650);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm font-semibold text-[#3B2138] tabular-nums">
        <span>Pairs: {matched.length / 2} / 8</span>
        <span>Moves: {moves}</span>
      </div>
      <div className="grid grid-cols-4 gap-2.5 max-w-sm mx-auto">
        {cards.map((c) => {
          const open = flipped.includes(c.id) || matched.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => flip(c.id)}
              className={`h-20 rounded-xl border text-2xl flex items-center justify-center transition-all cursor-pointer ${
                open ? 'bg-white border-[#E8C98C]' : 'bg-[#75476F] border-[#E8C98C]/60 text-[#FFF3D6]'
              }`}
            >
              {open ? c.sym : <Sparkles className="w-5 h-5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { ArrowUp, ArrowDown };
