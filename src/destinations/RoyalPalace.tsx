import React, { useState } from 'react';
import { Lock, Unlock, Sparkles, Heart } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DestinationFrame, GildedFrameCard, RoyalButton } from '../components/ui/RoyalUI';
import { PrincessAvatar } from '../components/PrincessAvatar';
import { CrownCrestIcon, RoyalKeyAsset } from '../assets/royal/RoyalIcons';
import { WingedHeartEmblem } from '../assets/royal/RoyalOrnaments';
import { soundEngine } from '../audio/soundEngine';

export const RoyalPalace: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { db, navigateTo, grantReward, showToast } = useKingdom();
  const [complimentIdx, setComplimentIdx] = useState(0);
  const [secretOpen, setSecretOpen] = useState(false);
  const [throneSparkle, setThroneSparkle] = useState(false);

  if (!db) return null;
  const { progress, compliments, siteConfig } = db;
  const canOpenSecretDoor = progress.keys >= 3 || progress.unlockedBoxes.includes('box-secret');

  const handleNextCompliment = () => {
    soundEngine.playSfx('heart');
    setComplimentIdx((i) => (i + 1) % Math.max(1, compliments.length));
  };

  const handleSitOnThrone = () => {
    soundEngine.playSfx('wand');
    setThroneSparkle(true);
    setTimeout(() => setThroneSparkle(false), 1800);
    void grantReward({ points: 15, coins: 10 });
    showToast('All hail Princess Akuu! (+10 Coins)');
  };

  const handleOpenSecretDoor = () => {
    if (!canOpenSecretDoor) {
      soundEngine.playSfx('pop');
      showToast('Collect 3 keys in the Arcade or unlock The Princess Secret Box to open this door.');
      return;
    }
    soundEngine.playSfx('door');
    setSecretOpen(true);
  };

  return (
    <DestinationFrame
      title="The Royal Palace"
      subtitle="Throne room, daily royal decree & the secret starlight chamber"
      chapterNumber={1}
      onBack={onBack}
      rightSlot={
        <RoyalButton variant="gold" size="sm" onClick={() => navigateTo('dressing-room')}>
          Visit Dressing Room
        </RoyalButton>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Throne Room Hero */}
        <GildedFrameCard showBow className="lg:col-span-7 flex flex-col justify-between bg-gradient-to-br from-[#FFF9F7] via-[#F9DCE7]/45 to-[#DCCCFB]/30">
          <div>
            <div className="text-xs font-medium text-[#75476F]/80 mb-2">Throne Hall · Heart of the Kingdom</div>
            <h2 className="font-royal text-3xl font-semibold text-[#3B2138]">
              {progress.avatar.nameplateTitle}’s Royal Sanctuary
            </h2>
            <p className="text-sm text-[#75476F] mt-2 leading-relaxed">
              {siteConfig.princessDayMessage}
            </p>
          </div>

          <div className="my-6 py-6 rounded-2xl bg-[#FFF9F7]/80 border border-[#E8C98C]/50 flex flex-col items-center justify-center relative overflow-hidden">
            {throneSparkle && (
              <div className="absolute inset-0 bg-gradient-to-t from-[#E8C98C]/20 via-[#F6B6CE]/20 to-transparent pointer-events-none animate-pulse" />
            )}
            <div className="flex items-center gap-2 text-xs font-romantic italic text-[#75476F] mb-2">
              <CrownCrestIcon className="w-5 h-5" />
              The Champagne-Gold Throne
            </div>
            <PrincessAvatar avatar={progress.avatar} size={170} />
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              <RoyalButton variant="glossy" size="sm" onClick={handleSitOnThrone}>
                <Sparkles className="w-3.5 h-3.5" />
                Claim Royal Blessing
              </RoyalButton>
              <RoyalButton variant="secondary" size="sm" onClick={() => navigateTo('achievement-hall')}>
                View Royal Certificate
              </RoyalButton>
            </div>
          </div>
        </GildedFrameCard>

        {/* Right Column: Daily Compliment + Mystery Door */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="royal-card rounded-3xl p-6 sm:p-7">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#75476F]/80">Tarun’s Compliment Mirror</span>
              <WingedHeartEmblem className="w-10 h-7" />
            </div>
            <blockquote className="font-romantic italic text-xl text-[#3B2138] leading-relaxed min-h-[84px]">
              “{compliments[complimentIdx] || 'You are magic in human form.'}”
            </blockquote>
            <div className="mt-5 flex items-center justify-between">
              <RoyalButton variant="secondary" size="sm" onClick={handleNextCompliment}>
                Another Sweet Note
              </RoyalButton>
              <Heart className="w-4 h-4 text-[#F18CAF] fill-[#F18CAF]" />
            </div>
          </div>

          {/* Mystery Secret Castle Room */}
          <div className="royal-card rounded-3xl p-6 sm:p-7 flex-1 flex flex-col justify-between bg-gradient-to-br from-[#2E1833] to-[#4A254B] text-[#FFF9F7]">
            <div>
              <div className="flex items-center justify-between text-xs text-[#E8C98C] mb-2">
                <span>Hidden Wing · Mystery Door</span>
                {canOpenSecretDoor ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <h3 className="font-royal text-2xl font-semibold">The Secret Starlight Parlor</h3>
              {!secretOpen ? (
                <p className="text-sm text-[#F9DCE7]/85 mt-2 leading-relaxed">
                  Behind this velvet arch lies a private keepsake room written only for Akuu. Requires 3 royal keys.
                </p>
              ) : (
                <div className="mt-3 p-4 rounded-2xl bg-white/10 border border-[#E8C98C]/40">
                  <div className="font-handwritten text-2xl text-[#FFF3D6] leading-snug">
                    “Secret Note: Even in a thousand lifetimes, my heart would still choose you in every single one. — Tarun ♡”
                  </div>
                </div>
              )}
            </div>

            {!secretOpen && (
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs text-[#E8C98C] tabular-nums">
                  <RoyalKeyAsset className="w-4 h-4" />
                  {progress.keys} / 3 keys
                </span>
                <RoyalButton variant="gold" size="sm" onClick={handleOpenSecretDoor}>
                  Open Secret Door
                </RoyalButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </DestinationFrame>
  );
};
