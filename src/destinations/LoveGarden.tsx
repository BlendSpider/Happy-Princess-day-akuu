import React, { useState } from 'react';
import { Heart, Sparkles, Flower2 } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DestinationFrame, RoyalButton } from '../components/ui/RoyalUI';
import { soundEngine } from '../audio/soundEngine';

const BOUQUET_STEMS = [
  { id: 'blush-rose', label: 'Blush Rose', color: '#F6B6CE' },
  { id: 'plum-peony', label: 'Plum Peony', color: '#75476F' },
  { id: 'champagne-lily', label: 'Champagne Lily', color: '#E8C98C' },
  { id: 'lavender-sprig', label: 'Lavender Sprig', color: '#B79CED' },
  { id: 'peach-ranunculus', label: 'Peach Ranunculus', color: '#FFD7C2' },
];

export const LoveGarden: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { grantReward, showToast } = useKingdom();
  const [roseLevel, setRoseLevel] = useState(1);
  const [bouquet, setBouquet] = useState<string[]>(['blush-rose', 'champagne-lily']);
  const [fountainWish, setFountainWish] = useState('');

  const nurtureForeverRose = () => {
    soundEngine.playSfx('bloom');
    setRoseLevel((lvl) => {
      const next = Math.min(5, lvl + 1);
      if (next === 5 && lvl < 5) {
        void grantReward({ stars: 2, coins: 40, points: 35 });
        showToast('Your Forever Rose is in eternal bloom! (+2 Stars)');
      }
      return next;
    });
  };

  const addStem = (id: string) => {
    soundEngine.playSfx('pop');
    if (bouquet.length >= 9) {
      setBouquet([id]);
    } else {
      setBouquet([...bouquet, id]);
    }
  };

  const tossWishCoin = () => {
    soundEngine.playSfx('fountain');
    void grantReward({ points: 15, coins: 10 });
    showToast(fountainWish ? `Wish whispered into the fountain: "${fountainWish}"` : 'A golden ripple answered your wish ♡');
    setFountainWish('');
  };

  return (
    <DestinationFrame
      title="The Love Garden"
      subtitle="Nurture the Forever Rose, weave a digital bouquet & whisper to the wish fountain"
      chapterNumber={19}
      onBack={onBack}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forever Rose */}
        <div className="royal-card rounded-3xl p-6 flex flex-col justify-between bg-gradient-to-b from-[#FFF9F7] to-[#F9DCE7]/50">
          <div>
            <div className="text-xs font-semibold text-[#75476F] mb-1">Eternal Bloom · Level {roseLevel}/5</div>
            <h2 className="font-royal text-2xl font-semibold text-[#3B2138]">The Forever Rose</h2>
            <p className="text-xs text-[#75476F]/85 mt-1">Each drop of care deepens its glow for Akuu.</p>
          </div>

          <div className="my-8 flex flex-col items-center">
            <div
              className="rounded-full bg-[#F9DCE7] border-2 border-[#E8C98C] flex items-center justify-center transition-all duration-500"
              style={{ width: 84 + roseLevel * 16, height: 84 + roseLevel * 16 }}
            >
              <Flower2 className="text-[#F18CAF]" style={{ width: 40 + roseLevel * 8, height: 40 + roseLevel * 8 }} />
            </div>
          </div>

          <RoyalButton variant="primary" onClick={nurtureForeverRose}>
            <Heart className="w-4 h-4" />
            {roseLevel >= 5 ? 'Radiantly Blooming ♡' : 'Nurture Forever Rose'}
          </RoyalButton>
        </div>

        {/* Digital Bouquet Composer */}
        <div className="royal-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-[#75476F] mb-1">Tarun’s Florist Ribbon</div>
            <h2 className="font-royal text-2xl font-semibold text-[#3B2138]">Digital Bouquet</h2>
            <p className="text-xs text-[#75476F]/85 mt-1">Arrange up to 9 stems wrapped in blush satin.</p>
          </div>

          <div className="my-5 min-h-[150px] rounded-2xl bg-[#FFF9F7] border border-[#E8C98C]/40 p-4 flex flex-wrap items-center justify-center gap-2.5">
            {bouquet.map((stemId, idx) => {
              const meta = BOUQUET_STEMS.find((s) => s.id === stemId) || BOUQUET_STEMS[0];
              return (
                <div
                  key={`${stemId}-${idx}`}
                  className="w-11 h-11 rounded-full flex items-center justify-center border border-[#E8C98C]/60 shadow-sm"
                  style={{ backgroundColor: meta.color }}
                  title={meta.label}
                >
                  <Flower2 className="w-5 h-5 text-[#3B2138]/75" />
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {BOUQUET_STEMS.map((s) => (
              <button
                key={s.id}
                onClick={() => addStem(s.id)}
                className="px-2.5 py-1.5 rounded-lg bg-[#F9DCE7]/65 hover:bg-[#F6B6CE] text-[11px] font-medium text-[#3B2138] cursor-pointer"
              >
                + {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Magical Wish Fountain */}
        <div className="royal-card rounded-3xl p-6 flex flex-col justify-between bg-gradient-to-b from-[#CDE9FA]/35 to-[#FFF9F7]">
          <div>
            <div className="text-xs font-semibold text-[#75476F] mb-1">Crystal Basin</div>
            <h2 className="font-royal text-2xl font-semibold text-[#3B2138]">Magical Wish Fountain</h2>
            <p className="text-xs text-[#75476F]/85 mt-1">Whisper a wish and toss a golden coin into the shimmering water.</p>
          </div>

          <div className="my-5 space-y-3">
            <input
              type="text"
              value={fountainWish}
              onChange={(e) => setFountainWish(e.target.value)}
              placeholder="A sweet wish for today..."
              className="w-full rounded-xl border border-[#E8C98C]/60 bg-white px-3.5 py-2.5 text-sm text-[#3B2138] focus:outline-none focus:ring-2 focus:ring-[#75476F]"
            />
          </div>

          <RoyalButton variant="gold" onClick={tossWishCoin}>
            <Sparkles className="w-4 h-4" />
            Toss Wish Coin
          </RoyalButton>
        </div>
      </div>
    </DestinationFrame>
  );
};
