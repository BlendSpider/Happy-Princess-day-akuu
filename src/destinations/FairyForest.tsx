import React, { useState } from 'react';
import { Sparkles, Key, Feather, Flower, Moon, Gem } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DestinationFrame, RoyalButton } from '../components/ui/RoyalUI';
import { soundEngine } from '../audio/soundEngine';

const RELICS = [
  { id: 'crystal-key', label: 'Crystal Key', x: 18, y: 28, icon: Key, note: 'A key dropped by the moonlight owl.' },
  { id: 'fairy-feather', label: 'Fairy Wing Feather', x: 74, y: 22, icon: Feather, note: 'Shimmering dust lingers on its tip.' },
  { id: 'glow-lotus', label: 'Moonlight Lotus', x: 42, y: 66, icon: Flower, note: 'Blooms only when Princess Akuu walks near.' },
  { id: 'crescent-charm', label: 'Crescent Charm', x: 82, y: 70, icon: Moon, note: 'Engraved with an A & T.' },
  { id: 'rose-gem', label: 'Rose Quartz Gem', x: 24, y: 76, icon: Gem, note: 'Warm to the touch like a kind word.' },
];

export const FairyForest: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { grantReward, showToast } = useKingdom();
  const [found, setFound] = useState<string[]>([]);
  const [spriteQuote, setSpriteQuote] = useState('“Welcome, Princess Akuu! Five enchanted woodland treasures are hiding among the fireflies.”');

  const handleFindRelic = (relic: (typeof RELICS)[number]) => {
    if (found.includes(relic.id)) return;
    soundEngine.playSfx('sparkle');
    const next = [...found, relic.id];
    setFound(next);
    setSpriteQuote(`“You found the ${relic.label}! ${relic.note}”`);
    if (next.length === RELICS.length) {
      soundEngine.playSfx('chest');
      void grantReward({ keys: 1, stars: 2, coins: 60, points: 50 });
      showToast('All Forest Relics found! (+1 Royal Key, +2 Stars)');
    } else {
      void grantReward({ coins: 15, points: 15 });
    }
  };

  return (
    <DestinationFrame
      title="The Fairy Forest"
      subtitle="Search the twilight glade for hidden woodland keepsakes & sprite secrets"
      chapterNumber={13}
      onBack={onBack}
      rightSlot={
        <div className="text-sm font-medium text-[#75476F] tabular-nums">
          Found: <strong>{found.length}</strong> / {RELICS.length}
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden border border-[#E8C98C]/60 min-h-[420px] bg-gradient-to-br from-[#1C2238] via-[#2C2444] to-[#4A2D4F] shadow-xl">
          {/* Decorative Forest Silhouettes */}
          <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none" viewBox="0 0 800 450" preserveAspectRatio="none">
            <path d="M0 450 L0 290 Q90 220 180 300 T380 280 T600 310 T800 260 L800 450 Z" fill="#140D22" />
            <circle cx="150" cy="120" r="3" fill="#FFF3D6" />
            <circle cx="480" cy="90" r="2.5" fill="#F6B6CE" />
            <circle cx="640" cy="145" r="3" fill="#FFF3D6" />
          </svg>

          {RELICS.map((r) => {
            const Icon = r.icon;
            const isFound = found.includes(r.id);
            return (
              <button
                key={r.id}
                onClick={() => handleFindRelic(r)}
                title={isFound ? r.label : 'Inspect glimmer'}
                style={{ left: `${r.x}%`, top: `${r.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isFound
                    ? 'bg-[#E8C98C] text-[#3B2138] scale-110 shadow-[0_0_24px_rgba(232,201,140,0.85)]'
                    : 'bg-white/12 hover:bg-white/25 text-[#FFF3D6]/75 animate-twinkle'
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-4 space-y-5">
          <div className="royal-card rounded-3xl p-6 bg-gradient-to-b from-[#FFF9F7] to-[#DCCCFB]/35">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#75476F] mb-2">
              <Sparkles className="w-4 h-4 text-[#E8C98C]" />
              Woodland Sprite Whisper
            </div>
            <p className="font-romantic italic text-lg text-[#3B2138] leading-relaxed">
              {spriteQuote}
            </p>
          </div>

          <div className="royal-card rounded-3xl p-6">
            <h3 className="font-romantic text-lg font-semibold text-[#3B2138] mb-3">Woodland Checklist</h3>
            <div className="space-y-2">
              {RELICS.map((r) => {
                const isFound = found.includes(r.id);
                return (
                  <div
                    key={r.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                      isFound ? 'bg-[#F9DCE7]/70 text-[#3B2138]' : 'bg-[#FFF9F7] text-[#75476F]/70'
                    }`}
                  >
                    <span>{r.label}</span>
                    <span>{isFound ? 'Collected' : 'Hidden'}</span>
                  </div>
                );
              })}
            </div>
            {found.length === RELICS.length && (
              <div className="mt-4">
                <RoyalButton variant="secondary" size="sm" onClick={() => setFound([])}>
                  Replay Woodland Hunt
                </RoyalButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </DestinationFrame>
  );
};
