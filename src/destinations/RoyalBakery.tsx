import React, { useState } from 'react';
import { Cake, Sparkles } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DestinationFrame, RoyalButton } from '../components/ui/RoyalUI';
import { soundEngine } from '../audio/soundEngine';

const SPONGES = [
  { id: 'strawberry', label: 'Strawberry Blush', color: '#F6B6CE' },
  { id: 'vanilla', label: 'Pearl Vanilla', color: '#FFF4E6' },
  { id: 'lavender', label: 'Lavender Honey', color: '#DCCCFB' },
  { id: 'peach', label: 'Peach Velvet', color: '#FFD7C2' },
];

const FROSTINGS = [
  { id: 'rose-cream', label: 'Rosewater Cream', color: '#F9DCE7' },
  { id: 'champagne', label: 'Champagne Gold', color: '#F3DFB5' },
  { id: 'berry', label: 'Berry Pink', color: '#F18CAF' },
  { id: 'sky', label: 'Sky Sugar', color: '#CDE9FA' },
];

const TOPPINGS = ['Fresh Strawberries', 'Gold Pearls', 'Pink Macarons', 'Sugar Butterflies', 'Birthday Candles'];

export const RoyalBakery: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { grantReward, showToast } = useKingdom();
  const [sponge, setSponge] = useState(SPONGES[0]);
  const [frosting, setFrosting] = useState(FROSTINGS[0]);
  const [tiers, setTiers] = useState<1 | 2 | 3>(2);
  const [selectedToppings, setSelectedToppings] = useState<string[]>(['Fresh Strawberries', 'Gold Pearls']);

  const toggleTopping = (t: string) => {
    soundEngine.playSfx('pop');
    setSelectedToppings((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const handleServeCake = () => {
    soundEngine.playSfx('achievement');
    void grantReward({ achievementId: 'bakery-chef', points: 25, coins: 30 });
    showToast('Your Royal Princess Cake is ready for the tea party! (+30 Coins)');
  };

  return (
    <DestinationFrame
      title="The Royal Bakery"
      subtitle="Design bespoke tiered princess cakes with pastel frostings & edible pearls"
      chapterNumber={10}
      onBack={onBack}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cake Display Pedestal */}
        <div className="lg:col-span-6 royal-card rounded-3xl p-8 bg-gradient-to-b from-[#FFF9F7] to-[#F9DCE7]/50 flex flex-col items-center justify-between min-h-[430px]">
          <div className="text-xs font-semibold text-[#75476F] inline-flex items-center gap-1.5">
            <Cake className="w-4 h-4 text-[#F18CAF]" />
            Porcelain Cake Stand
          </div>

          <div className="my-6 flex flex-col items-center">
            {/* Candles / Crown Topper */}
            {selectedToppings.includes('Birthday Candles') && (
              <div className="flex gap-3 mb-1">
                {[0, 1, 2].map((c) => (
                  <div key={c} className="w-2 h-7 rounded-t-full bg-[#E8C98C] relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFB347] -top-2.5 -left-0.5 absolute animate-twinkle" />
                  </div>
                ))}
              </div>
            )}

            {/* Tier 3 */}
            {tiers >= 3 && (
              <div
                className="w-28 h-12 rounded-t-2xl border-2 border-[#E8C98C] shadow-sm relative flex items-center justify-center"
                style={{ backgroundColor: sponge.color }}
              >
                <div className="absolute top-0 inset-x-0 h-4 rounded-t-xl" style={{ backgroundColor: frosting.color }} />
              </div>
            )}

            {/* Tier 2 */}
            {tiers >= 2 && (
              <div
                className="w-44 h-16 rounded-t-2xl border-2 border-[#E8C98C] shadow-sm relative flex items-center justify-center"
                style={{ backgroundColor: sponge.color }}
              >
                <div className="absolute top-0 inset-x-0 h-5 rounded-t-xl" style={{ backgroundColor: frosting.color }} />
                {selectedToppings.includes('Gold Pearls') && (
                  <div className="flex gap-3 mt-3">
                    {[0, 1, 2, 3].map((i) => (
                      <span key={i} className="w-2 h-2 rounded-full bg-[#E8C98C]" />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tier 1 */}
            <div
              className="w-60 h-20 rounded-t-2xl border-2 border-[#E8C98C] shadow-md relative flex items-center justify-center"
              style={{ backgroundColor: sponge.color }}
            >
              <div className="absolute top-0 inset-x-0 h-6 rounded-t-xl" style={{ backgroundColor: frosting.color }} />
              <div className="flex flex-wrap gap-2 mt-4 px-3 justify-center text-[11px] font-medium text-[#3B2138]">
                {selectedToppings.includes('Fresh Strawberries') && <span>🍓</span>}
                {selectedToppings.includes('Pink Macarons') && <span>🧁</span>}
                {selectedToppings.includes('Sugar Butterflies') && <span>🦋</span>}
              </div>
            </div>

            {/* Stand */}
            <div className="w-72 h-3 rounded-full bg-[#FFF9F7] border border-[#E8C98C] shadow" />
            <div className="w-10 h-10 bg-[#E8C98C]/70 rounded-b-xl" />
            <div className="w-32 h-2.5 rounded-full bg-[#E8C98C]" />
          </div>

          <RoyalButton variant="gold" onClick={handleServeCake}>
            <Sparkles className="w-4 h-4" />
            Present Princess Cake
          </RoyalButton>
        </div>

        {/* Bakery Controls */}
        <div className="lg:col-span-6 space-y-5">
          <div className="royal-card rounded-2xl p-5">
            <h3 className="font-romantic text-lg font-semibold text-[#3B2138] mb-3">Cake Tiers</h3>
            <div className="flex gap-2">
              {([1, 2, 3] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    soundEngine.playSfx('pop');
                    setTiers(n);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                    tiers === n ? 'bg-[#75476F] text-white' : 'bg-[#F9DCE7]/60 text-[#75476F]'
                  }`}
                >
                  {n} Tier{n > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="royal-card rounded-2xl p-5">
            <h3 className="font-romantic text-lg font-semibold text-[#3B2138] mb-3">Sponge Flavour</h3>
            <div className="grid grid-cols-2 gap-2">
              {SPONGES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    soundEngine.playSfx('pop');
                    setSponge(s);
                  }}
                  className={`p-3 rounded-xl border text-left text-xs font-medium cursor-pointer ${
                    sponge.id === s.id ? 'border-[#75476F] bg-[#F9DCE7]/50' : 'border-[#E8C98C]/40 bg-white'
                  }`}
                >
                  <span className="inline-block w-3.5 h-3.5 rounded-full mr-2 align-middle border border-black/10" style={{ backgroundColor: s.color }} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="royal-card rounded-2xl p-5">
            <h3 className="font-romantic text-lg font-semibold text-[#3B2138] mb-3">Frosting & Toppings</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {FROSTINGS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    soundEngine.playSfx('pop');
                    setFrosting(f);
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium cursor-pointer ${
                    frosting.id === f.id ? 'border-[#75476F] bg-[#F9DCE7]/50' : 'border-[#E8C98C]/40 bg-white'
                  }`}
                >
                  <span className="inline-block w-3.5 h-3.5 rounded-full mr-2 align-middle border border-black/10" style={{ backgroundColor: f.color }} />
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {TOPPINGS.map((t) => {
                const active = selectedToppings.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTopping(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                      active ? 'bg-[#75476F] text-white' : 'bg-[#F9DCE7]/60 text-[#75476F]'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DestinationFrame>
  );
};
