import React, { useState } from 'react';
import { Droplets, Flower2, Sparkles, MessageCircleHeart } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DestinationFrame, RoyalButton } from '../components/ui/RoyalUI';
import type { GardenPlot } from '../types/kingdom';
import { soundEngine } from '../audio/soundEngine';

const SEEDS: Array<{ id: GardenPlot['seedType']; name: string; color: string }> = [
  { id: 'rose', name: 'Blush Rose', color: '#F18CAF' },
  { id: 'sakura', name: 'Sakura Blossom', color: '#F6B6CE' },
  { id: 'lavender', name: 'Royal Lavender', color: '#B79CED' },
  { id: 'tulip', name: 'Peach Tulip', color: '#FFB08E' },
  { id: 'starflower', name: 'Starlight Lily', color: '#E8C98C' },
];

const ROSE_LINES = [
  'Hello Princess Akuu! Every petal here blooms just to see your smile.',
  'Water me twice and I will gift you shimmering rose petals!',
  'Even the butterflies follow you because your kindness feels like spring.',
  'Tarun whispered that you are his favourite flower in the universe.',
];

export const MagicalGarden: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { db, updateProgress, grantReward, showToast } = useKingdom();
  const [selectedSeed, setSelectedSeed] = useState<GardenPlot['seedType']>('rose');
  const [roseTalkIdx, setRoseTalkIdx] = useState(0);
  const [butterflies, setButterflies] = useState(3);

  if (!db) return null;
  const { gardenPlots, collectedPetals } = db.progress;

  const handlePlotAction = (plotId: number) => {
    const plot = gardenPlots.find((p) => p.id === plotId);
    if (!plot) return;

    let nextPlots: GardenPlot[];
    if (plot.stage === 0) {
      soundEngine.playSfx('pop');
      nextPlots = gardenPlots.map((p) =>
        p.id === plotId ? { ...p, seedType: selectedSeed, stage: 1, wateredCount: 1 } : p
      );
      void updateProgress({ gardenPlots: nextPlots });
    } else if (plot.stage < 3) {
      soundEngine.playSfx('bloom');
      const nextStage = plot.stage + 1;
      nextPlots = gardenPlots.map((p) =>
        p.id === plotId ? { ...p, stage: nextStage, wateredCount: p.wateredCount + 1 } : p
      );
      void updateProgress({ gardenPlots: nextPlots });
      if (nextStage === 3) {
        void grantReward({ achievementId: 'rose-keeper', points: 25, coins: 20 });
        showToast('A flower reached full bloom! Tap it to harvest petals.');
      }
    } else {
      // Harvest petals & reset plot
      soundEngine.playSfx('sparkle');
      nextPlots = gardenPlots.map((p) =>
        p.id === plotId ? { ...p, stage: 0, wateredCount: 0 } : p
      );
      void updateProgress({ gardenPlots: nextPlots, collectedPetals: collectedPetals + 5 });
      void grantReward({ coins: 25, points: 20 });
      showToast('Harvested +5 Rose Petals & +25 Coins!');
    }
  };

  const catchButterfly = () => {
    soundEngine.playSfx('wings');
    setButterflies((b) => Math.max(1, (b % 5) + 1));
    void grantReward({ points: 10, coins: 10 });
  };

  return (
    <DestinationFrame
      title="The Magical Garden"
      subtitle="Plant enchanted seeds, water blooms & talk with the Singing Rose"
      chapterNumber={3}
      onBack={onBack}
      rightSlot={
        <div className="text-sm font-medium text-[#75476F] tabular-nums">
          Petals Collected: <strong className="text-[#3B2138]">{collectedPetals}</strong>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Seed Pouch + Talking Flower */}
        <div className="lg:col-span-4 space-y-6">
          <div className="royal-card rounded-3xl p-6">
            <h2 className="font-romantic text-xl font-semibold text-[#3B2138] mb-3">Seed Pouch</h2>
            <div className="space-y-2">
              {SEEDS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    soundEngine.playSfx('pop');
                    setSelectedSeed(s.id);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${
                    selectedSeed === s.id
                      ? 'bg-[#F9DCE7]/70 border-[#75476F] text-[#3B2138]'
                      : 'bg-white border-[#E8C98C]/40 text-[#75476F] hover:bg-[#FFF9F7]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </span>
                  {selectedSeed === s.id && <span className="text-xs">Selected</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Talking Rose */}
          <div className="royal-card rounded-3xl p-6 bg-gradient-to-br from-[#FFF9F7] to-[#F9DCE7]/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#75476F] mb-2">
              <MessageCircleHeart className="w-4 h-4 text-[#F18CAF]" />
              The Talking Rose
            </div>
            <p className="font-romantic italic text-lg text-[#3B2138] leading-relaxed min-h-[72px]">
              “{ROSE_LINES[roseTalkIdx]}”
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <RoyalButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  soundEngine.playSfx('giggle');
                  setRoseTalkIdx((i) => (i + 1) % ROSE_LINES.length);
                }}
              >
                Talk to Rose
              </RoyalButton>
              <RoyalButton variant="gold" size="sm" onClick={catchButterfly}>
                Catch Butterfly ({butterflies})
              </RoyalButton>
            </div>
          </div>
        </div>

        {/* 6 Interactive Flower Beds */}
        <div className="lg:col-span-8 royal-card rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#CDE9FA]/30 via-[#FFF9F7] to-[#F9DCE7]/45">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-royal text-2xl font-semibold text-[#3B2138]">Enchanted Flower Beds</h2>
              <p className="text-xs text-[#75476F]">Tap empty soil to plant, tap sprouts to water, and tap full blooms to harvest petals.</p>
            </div>
            <Sparkles className="w-5 h-5 text-[#E8C98C]" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {gardenPlots.map((plot) => {
              const seedMeta = SEEDS.find((s) => s.id === plot.seedType) || SEEDS[0];
              const stageLabel =
                plot.stage === 0
                  ? 'Empty Soil · Plant Seed'
                  : plot.stage === 1
                  ? 'Tiny Sprout · Water Me'
                  : plot.stage === 2
                  ? 'Dewy Bud · Water Again'
                  : 'Full Bloom · Harvest!';
              return (
                <button
                  key={plot.id}
                  onClick={() => handlePlotAction(plot.id)}
                  className="group rounded-2xl border border-[#E8C98C]/60 bg-white/90 hover:bg-[#FFF9F7] p-5 flex flex-col items-center justify-between min-h-[185px] transition-all hover:-translate-y-1 cursor-pointer shadow-sm"
                >
                  <div className="text-[11px] font-medium text-[#75476F]/75">
                    {plot.stage === 0 ? 'Plot ' + (plot.id + 1) : seedMeta.name}
                  </div>

                  <div className="my-3 flex items-center justify-center h-20">
                    {plot.stage === 0 && (
                      <div className="w-16 h-6 rounded-full bg-[#C79C83]/45 border border-[#A67B60]/40" />
                    )}
                    {plot.stage === 1 && (
                      <div className="flex flex-col items-center">
                        <div className="w-1.5 h-8 bg-[#7BB686] rounded-full" />
                        <div className="w-6 h-3 rounded-full bg-[#92CA9C] -mt-6 -ml-4 rotate-[-20deg]" />
                      </div>
                    )}
                    {plot.stage === 2 && (
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full border-2 border-[#75476F]/20" style={{ backgroundColor: seedMeta.color }} />
                        <div className="w-1.5 h-10 bg-[#7BB686] rounded-full" />
                      </div>
                    )}
                    {plot.stage === 3 && (
                      <div className="flex flex-col items-center animate-float-slow">
                        <Flower2 className="w-14 h-14" style={{ color: seedMeta.color }} />
                      </div>
                    )}
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#75476F]">
                    {plot.stage > 0 && plot.stage < 3 && <Droplets className="w-3.5 h-3.5 text-[#5FA8D3]" />}
                    <span>{stageLabel}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </DestinationFrame>
  );
};
