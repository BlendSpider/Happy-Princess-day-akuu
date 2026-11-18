import React from 'react';
import { Award, Download, CheckCircle2, Lock } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DESTINATIONS } from '../data/destinations';
import { DestinationFrame, RoyalButton } from '../components/ui/RoyalUI';
import { soundEngine } from '../audio/soundEngine';

export const AchievementHall: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { db, navigateTo, showToast } = useKingdom();

  if (!db) return null;
  const { progress, achievements } = db;

  const downloadCertificate = () => {
    soundEngine.playSfx('chest');
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 1200, 850);
    grad.addColorStop(0, '#FFF9F7');
    grad.addColorStop(0.5, '#F9DCE7');
    grad.addColorStop(1, '#FFF9F7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 850);

    ctx.strokeStyle = '#E8C98C';
    ctx.lineWidth = 14;
    ctx.strokeRect(32, 32, 1136, 786);
    ctx.lineWidth = 3;
    ctx.strokeRect(52, 52, 1096, 746);

    ctx.fillStyle = '#75476F';
    ctx.font = '600 26px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('OFFICIAL ROYAL PROCLAMATION · AKUU’S PRINCESS WORLD', 600, 140);

    ctx.fillStyle = '#3B2138';
    ctx.font = 'bold 64px Georgia, serif';
    ctx.fillText('Princess Day Royal Certificate', 600, 235);

    ctx.fillStyle = '#75476F';
    ctx.font = 'italic 30px Georgia, serif';
    ctx.fillText('This certifies that', 600, 315);

    ctx.fillStyle = '#3B2138';
    ctx.font = 'bold 58px Georgia, serif';
    ctx.fillText('Akriti (Beloved Akuu)', 600, 395);

    ctx.fillStyle = '#5A3256';
    ctx.font = '24px Georgia, serif';
    ctx.fillText(
      `is forever crowned Princess of Tarun’s Heart, having explored ${progress.visitedDestinations.length} of 24 realms`,
      600,
      480,
    );
    ctx.fillText(
      `and gathered ${progress.stars} Stars, ${progress.coins} Royal Coins, and ${progress.unlockedAchievements.length} Badges.`,
      600,
      525,
    );

    ctx.fillStyle = '#75476F';
    ctx.font = 'italic 36px Georgia, serif';
    ctx.fillText('With endless love, Tarun ♡', 600, 665);

    const a = document.createElement('a');
    a.download = 'akuu-royal-princess-certificate.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
    showToast('Official Royal Certificate downloaded!');
  };

  return (
    <DestinationFrame
      title="Royal Achievement Hall"
      subtitle="Collect royal badges, track your kingdom journey & claim your Princess Day certificate"
      chapterNumber={23}
      onBack={onBack}
      rightSlot={
        <RoyalButton variant="gold" size="sm" onClick={downloadCertificate}>
          <Download className="w-3.5 h-3.5" />
          Download Royal Certificate
        </RoyalButton>
      }
    >
      {/* Progress Map Summary */}
      <div className="royal-card rounded-3xl p-6 sm:p-8 mb-8 bg-gradient-to-r from-[#FFF9F7] via-[#F9DCE7]/45 to-[#DCCCFB]/35">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="font-royal text-2xl sm:text-3xl font-semibold text-[#3B2138]">
              Kingdom Exploration Map
            </h2>
            <p className="text-sm text-[#75476F]">
              {progress.visitedDestinations.length} of {DESTINATIONS.length} destinations discovered · {progress.unlockedAchievements.length} of {achievements.length} badges earned
            </p>
          </div>
          <div className="text-sm font-medium text-[#3B2138] tabular-nums">
            {Math.round((progress.visitedDestinations.length / DESTINATIONS.length) * 100)}% Explored
          </div>
        </div>
        <div className="w-full h-3 rounded-full bg-[#F9DCE7] overflow-hidden border border-[#E8C98C]/40 mb-5">
          <div
            className="h-full bg-gradient-to-r from-[#F18CAF] to-[#E8C98C] transition-all duration-500"
            style={{ width: `${Math.round((progress.visitedDestinations.length / DESTINATIONS.length) * 100)}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {DESTINATIONS.map((d) => {
            const visited = progress.visitedDestinations.includes(d.id);
            return (
              <button
                key={d.id}
                onClick={() => navigateTo(d.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  visited
                    ? 'bg-[#75476F] text-white'
                    : 'bg-white border border-[#E8C98C]/40 text-[#75476F] hover:bg-[#F9DCE7]'
                }`}
              >
                {d.number}. {d.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Achievement Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach) => {
          const unlocked = progress.unlockedAchievements.includes(ach.id);
          return (
            <div
              key={ach.id}
              className={`royal-card rounded-2xl p-5 flex items-start gap-4 ${
                unlocked ? 'bg-white border-[#E8C98C]' : 'bg-[#FFF9F7]/70 opacity-80'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  unlocked ? 'bg-[#F9DCE7] text-[#75476F]' : 'bg-[#75476F]/10 text-[#75476F]/50'
                }`}
              >
                {unlocked ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Award className={`w-4 h-4 shrink-0 ${unlocked ? 'text-[#E8C98C]' : 'text-[#75476F]/40'}`} />
                  <h3 className="font-romantic font-semibold text-base text-[#3B2138]">{ach.title}</h3>
                </div>
                <p className="text-xs text-[#75476F]/85 mt-1 leading-relaxed">{ach.description}</p>
                <div className="text-[11px] text-[#75476F] mt-2 tabular-nums">
                  Reward: {ach.rewardStars} Stars · {ach.rewardCoins} Coins
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DestinationFrame>
  );
};
