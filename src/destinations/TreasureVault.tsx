import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Key, Lock, Unlock, Sparkles } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DestinationFrame, ResilientImage, RoyalButton } from '../components/ui/RoyalUI';
import { WingedTreasureChestSVG } from '../assets/royal/RoyalIcons';
import type { TreasureBox } from '../types/kingdom';
import { soundEngine } from '../audio/soundEngine';

export const TreasureVault: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { db, updateProgress, grantReward, showToast } = useKingdom();
  const [openedReward, setOpenedReward] = useState<TreasureBox | null>(null);

  if (!db) return null;
  const { treasureBoxes, progress } = db;

  const handleOpenBox = (box: TreasureBox) => {
    const alreadyOpen = progress.unlockedBoxes.includes(box.id);
    if (alreadyOpen) {
      soundEngine.playSfx('sparkle');
      setOpenedReward(box);
      return;
    }
    if (progress.keys < box.keysRequired) {
      soundEngine.playSfx('pop');
      showToast(`Collect ${box.keysRequired} Royal Keys in the Arcade or gardens to unlock ${box.name}.`);
      return;
    }

    soundEngine.playSfx('chest');
    confetti({ particleCount: 70, spread: 80, colors: ['#F6B6CE', '#E8C98C', '#F18CAF', '#FFF9F7'] });

    const nextBoxes = [...progress.unlockedBoxes, box.id];
    const nextDresses =
      box.rewardType === 'dress' && box.rewardItemId && !progress.unlockedDresses.includes(box.rewardItemId)
        ? [...progress.unlockedDresses, box.rewardItemId]
        : progress.unlockedDresses;

    void updateProgress({
      keys: progress.keys - box.keysRequired,
      unlockedBoxes: nextBoxes,
      unlockedDresses: nextDresses,
    });
    void grantReward({ achievementId: 'treasure-finder', points: 45, stars: 2 });
    setOpenedReward(box);
    showToast(`Unlocked: ${box.rewardTitle}`);
  };

  return (
    <DestinationFrame
      title="The Royal Treasure Vault"
      subtitle="Use keys earned across the kingdom to unlock winged mystery chests & special surprises"
      chapterNumber={14}
      onBack={onBack}
      rightSlot={
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#3B2138] tabular-nums">
          <Key className="w-4 h-4 text-[#E8C98C]" />
          Available Keys: {progress.keys}
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {treasureBoxes.map((box) => {
          const isUnlocked = progress.unlockedBoxes.includes(box.id);
          return (
            <div
              key={box.id}
              className="royal-card rounded-3xl p-6 flex flex-col justify-between border-2 transition-transform hover:-translate-y-1 bg-gradient-to-b from-[#FFF9F7] to-[#F9DCE7]/45"
              style={{ borderColor: box.themeColor }}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#75476F] mb-3">
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Key className="w-3.5 h-3.5" />
                    {box.keysRequired} Key{box.keysRequired > 1 ? 's' : ''}
                  </span>
                  {isUnlocked ? <Unlock className="w-4 h-4 text-[#75476F]" /> : <Lock className="w-4 h-4 text-[#75476F]/60" />}
                </div>
                <div className="rounded-2xl bg-gradient-to-b from-[#2B1730] to-[#5E3266] py-5 mb-4 flex items-center justify-center border border-[#E8C98C]/60">
                  <WingedTreasureChestSVG className="w-32 h-24 animate-float-slow" open={isUnlocked} color={box.themeColor} />
                </div>
                <h2 className="font-royal text-2xl font-semibold text-[#3B2138]">{box.name}</h2>
                <p className="text-sm text-[#75476F]/85 mt-1.5">
                  {isUnlocked ? box.rewardTitle : 'Contains an enchanted surprise waiting for Princess Akuu.'}
                </p>
              </div>

              <div className="mt-6">
                <RoyalButton
                  variant={isUnlocked ? 'secondary' : 'glossy'}
                  size="sm"
                  className="w-full"
                  onClick={() => handleOpenBox(box)}
                >
                  {isUnlocked ? 'View Reward' : `Open Treasure (${box.keysRequired} Keys)`}
                </RoyalButton>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reward Reveal Modal */}
      {openedReward && (
        <div
          className="fixed inset-0 z-50 bg-[#1B0F21]/80 flex items-center justify-center p-4"
          onClick={() => setOpenedReward(null)}
        >
          <div
            className="max-w-md w-full bg-[#FFF9F7] rounded-3xl border-2 border-[#E8C98C] p-7 text-center shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Sparkles className="w-9 h-9 text-[#E8C98C] mx-auto" />
            <div className="text-xs uppercase tracking-widest text-[#75476F]">{openedReward.name}</div>
            <h3 className="font-royal text-3xl font-semibold text-[#3B2138]">{openedReward.rewardTitle}</h3>
            {openedReward.rewardImageUrl && (
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#E8C98C]/60">
                <ResilientImage src={openedReward.rewardImageUrl} alt={openedReward.rewardTitle} className="w-full h-full object-cover" />
              </div>
            )}
            <p className="text-sm text-[#5A3256] leading-relaxed">{openedReward.rewardDescription}</p>
            <RoyalButton variant="primary" onClick={() => setOpenedReward(null)}>
              Keep Treasure ♡
            </RoyalButton>
          </div>
        </div>
      )}
    </DestinationFrame>
  );
};
