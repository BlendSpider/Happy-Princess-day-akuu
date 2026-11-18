import React, { useEffect, useState } from 'react';
import { Star, Sparkles } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DestinationFrame, RoyalButton } from '../components/ui/RoyalUI';
import { soundEngine } from '../audio/soundEngine';

const CONSTELLATION_NODES = [
  { id: 0, x: 22, y: 34, name: 'Star of Warmth' },
  { id: 1, x: 38, y: 22, name: 'Star of Laughter' },
  { id: 2, x: 52, y: 38, name: 'Heart of Akuu' },
  { id: 3, x: 66, y: 22, name: 'Star of Grace' },
  { id: 4, x: 80, y: 36, name: 'Star of Dreams' },
  { id: 5, x: 52, y: 68, name: 'Forever Crown' },
];

export const StarObservatory: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { db, updateProgress, grantReward, showToast } = useKingdom();
  const [connected, setConnected] = useState<number[]>([2]);
  const [wishText, setWishText] = useState('');
  const [audioPulse, setAudioPulse] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const bars = soundEngine.getVisualiserBars(4);
      const avg = bars.reduce((a, b) => a + b, 0) / bars.length;
      setAudioPulse(avg);
    }, 120);
    return () => clearInterval(timer);
  }, []);

  if (!db) return null;
  const { wishes } = db.progress;

  const toggleNode = (id: number) => {
    soundEngine.playSfx('chime');
    setConnected((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      if (next.length === CONSTELLATION_NODES.length && prev.length < CONSTELLATION_NODES.length) {
        void grantReward({ stars: 3, points: 40 });
        showToast('Akuu’s Heart Constellation illuminated! (+3 Stars)');
      }
      return next;
    });
  };

  const handleMakeWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;
    soundEngine.playSfx('wand');
    const newWish = {
      id: `wish-${Date.now()}`,
      text: wishText.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    void updateProgress({ wishes: [newWish, ...wishes] });
    void grantReward({ achievementId: 'star-gazer', points: 25, stars: 1 });
    setWishText('');
    showToast('Your shooting-star wish was saved in the night sky ♡');
  };

  return (
    <DestinationFrame
      title="The Star Observatory"
      subtitle="Connect Akuu’s constellation, watch audio-reactive stars & make wishes"
      chapterNumber={12}
      onBack={onBack}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Interactive Night Sky Star Map */}
        <div className="lg:col-span-7 relative rounded-3xl overflow-hidden border border-[#E8C98C]/60 bg-gradient-to-b from-[#130B1D] via-[#261439] to-[#3B214D] min-h-[420px] p-6 text-[#FFF9F7] flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#E8C98C]">Personalised Star Map · Akuu’s Sky</div>
              <p className="text-xs text-[#F9DCE7]/80 mt-0.5">Tap every glowing star to trace the royal heart constellation.</p>
            </div>
            <span className="text-xs text-[#E8C98C] tabular-nums">
              {connected.length} / {CONSTELLATION_NODES.length} lit
            </span>
          </div>

          <div className="relative flex-1 my-4">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {connected.length > 1 &&
                connected.slice(1).map((nodeId, i) => {
                  const a = CONSTELLATION_NODES.find((n) => n.id === connected[i]);
                  const b = CONSTELLATION_NODES.find((n) => n.id === nodeId);
                  if (!a || !b) return null;
                  return (
                    <line
                      key={`${a.id}-${b.id}`}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke="#E8C98C"
                      strokeWidth="0.6"
                      strokeOpacity="0.85"
                    />
                  );
                })}
            </svg>

            {CONSTELLATION_NODES.map((node) => {
              const lit = connected.includes(node.id);
              const scale = lit ? 1 + audioPulse * 0.45 : 0.95;
              return (
                <button
                  key={node.id}
                  onClick={() => toggleNode(node.id)}
                  style={{ left: `${node.x}%`, top: `${node.y}%`, transform: `translate(-50%, -50%) scale(${scale})` }}
                  className="absolute flex flex-col items-center gap-1 cursor-pointer transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      lit ? 'text-[#FFF3D6] fill-[#E8C98C] drop-shadow-[0_0_10px_rgba(232,201,140,0.9)]' : 'text-white/50'
                    }`}
                  />
                  <span className="text-[10px] text-[#F9DCE7]/85 whitespace-nowrap">{node.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wish Maker */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleMakeWish} className="royal-card rounded-3xl p-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#75476F] mb-2">
              <Sparkles className="w-4 h-4 text-[#E8C98C]" />
              Shooting Star Wish Maker
            </div>
            <h2 className="font-romantic text-xl font-semibold text-[#3B2138] mb-3">Send a Wish to the Sky</h2>
            <textarea
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              rows={3}
              placeholder="Write a dream, wish, or sweet thought..."
              className="w-full rounded-xl border border-[#E8C98C]/60 bg-[#FFF9F7] p-3 text-sm text-[#3B2138] focus:outline-none focus:ring-2 focus:ring-[#75476F]"
            />
            <div className="mt-3">
              <RoyalButton type="submit" variant="primary" size="sm">
                Release Wish Star
              </RoyalButton>
            </div>
          </form>

          <div className="royal-card rounded-3xl p-6 max-h-64 overflow-y-auto space-y-3">
            <h3 className="font-romantic text-lg font-semibold text-[#3B2138]">Saved Wishes</h3>
            {wishes.map((w) => (
              <div key={w.id} className="pb-2.5 border-b border-[#E8C98C]/25 last:border-0">
                <p className="text-sm text-[#3B2138]">{w.text}</p>
                <div className="text-[11px] text-[#75476F]/70 mt-0.5">{w.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DestinationFrame>
  );
};
