import React, { useState } from 'react';
import { Sparkles, Award } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DestinationFrame, RoyalButton } from '../components/ui/RoyalUI';
import { DRESS_STYLES, PrincessAvatar } from '../components/PrincessAvatar';
import { soundEngine } from '../audio/soundEngine';

const CHALLENGES = [
  {
    id: 'moonlight-gala',
    title: 'Moonlight Starlight Gala',
    prompt: 'Style Princess Akuu in dreamy lavender or sky tones with an imperial tiara!',
    favoredDresses: ['lavender-dream', 'sky-serenade', 'plum-coronation'],
    favoredTiaras: ['imperial-diamond', 'pearl-crest'],
  },
  {
    id: 'cherry-tea',
    title: 'Cherry Blossom Tea Party',
    prompt: 'Create a soft blush or peach coquette look with a pearl necklace.',
    favoredDresses: ['blush-tulle', 'rosewater-silk', 'peach-blossom', 'strawberry-velvet'],
    favoredTiaras: ['pearl-crest', 'rose-gold'],
  },
  {
    id: 'golden-coronation',
    title: 'Golden Hour Coronation',
    prompt: 'Wear champagne gold or rosewater silk fit for the Queen of Hearts!',
    favoredDresses: ['champagne-ballgown', 'rosewater-silk', 'plum-coronation'],
    favoredTiaras: ['rose-gold', 'imperial-diamond'],
  },
];

export const FashionStudio: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { db, updateProgress, grantReward, showToast } = useKingdom();
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [runwayScore, setRunwayScore] = useState<number | null>(null);
  const [walking, setWalking] = useState(false);

  if (!db) return null;
  const { avatar } = db.progress;
  const challenge = CHALLENGES[challengeIdx];

  const handleWalkRunway = () => {
    soundEngine.playSfx('wand');
    setWalking(true);
    setTimeout(() => {
      setWalking(false);
      let score = 82;
      if (challenge.favoredDresses.includes(avatar.dress)) score += 10;
      if (challenge.favoredTiaras.includes(avatar.tiara)) score += 6;
      if (avatar.necklace !== 'none') score += 2;
      setRunwayScore(score);
      soundEngine.playSfx('achievement');
      void grantReward({ coins: score >= 92 ? 45 : 25, points: 35 });
      showToast(`Runway Score: ${score}/100!`);
    }, 1300);
  };

  return (
    <DestinationFrame
      title="Princess Fashion Studio"
      subtitle="Themed couture challenges & spotlight runway walk"
      chapterNumber={17}
      onBack={onBack}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Runway Stage */}
        <div className="lg:col-span-6 rounded-3xl p-8 bg-gradient-to-b from-[#2B1730] via-[#4C294E] to-[#75476F] text-[#FFF9F7] border border-[#E8C98C]/60 flex flex-col items-center justify-between min-h-[440px]">
          <div className="text-center">
            <div className="text-xs uppercase tracking-widest text-[#E8C98C] mb-1">
              Couture Challenge {challengeIdx + 1} of {CHALLENGES.length}
            </div>
            <h2 className="font-royal text-3xl font-semibold">{challenge.title}</h2>
            <p className="text-sm text-[#F9DCE7]/90 mt-1.5 max-w-md">{challenge.prompt}</p>
          </div>

          <div className={`my-6 transition-transform duration-700 ${walking ? 'scale-110 translate-y-2' : ''}`}>
            <PrincessAvatar avatar={{ ...avatar, pose: walking ? 'spin' : avatar.pose }} size={200} />
          </div>

          <div className="w-full flex flex-col items-center gap-3">
            {runwayScore !== null && (
              <div className="inline-flex items-center gap-2 text-base font-romantic text-[#FFF3D6] tabular-nums">
                <Award className="w-5 h-5 text-[#E8C98C]" />
                Judges’ Applause: {runwayScore} / 100
              </div>
            )}
            <div className="flex flex-wrap gap-3 justify-center">
              <RoyalButton variant="gold" onClick={handleWalkRunway} disabled={walking}>
                <Sparkles className="w-4 h-4" />
                {walking ? 'Walking the Runway...' : 'Walk the Runway'}
              </RoyalButton>
              <RoyalButton
                variant="secondary"
                onClick={() => {
                  setRunwayScore(null);
                  setChallengeIdx((i) => (i + 1) % CHALLENGES.length);
                }}
              >
                Next Theme
              </RoyalButton>
            </div>
          </div>
        </div>

        {/* Quick Studio Outfit Picker */}
        <div className="lg:col-span-6 royal-card rounded-3xl p-6 sm:p-7 space-y-5">
          <h3 className="font-romantic text-xl font-semibold text-[#3B2138]">Quick Couture Rack</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(DRESS_STYLES).map(([id, style]) => (
              <button
                key={id}
                onClick={() => {
                  soundEngine.playSfx('pop');
                  void updateProgress({ avatar: { ...avatar, dress: id } });
                }}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                  avatar.dress === id ? 'border-[#75476F] bg-[#F9DCE7]/60' : 'border-[#E8C98C]/40 bg-white'
                }`}
              >
                <div className="w-5 h-5 rounded-full mb-1.5 border border-black/10" style={{ backgroundColor: style.primary }} />
                <div className="text-xs font-semibold text-[#3B2138]">{style.name}</div>
              </button>
            ))}
          </div>

          <div>
            <div className="text-xs font-semibold text-[#75476F] mb-2">Tiara Selection</div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'pearl-crest', label: 'Pearl Crest' },
                { id: 'rose-gold', label: 'Champagne Gold' },
                { id: 'imperial-diamond', label: 'Imperial Diamond' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    soundEngine.playSfx('sparkle');
                    void updateProgress({ avatar: { ...avatar, tiara: t.id } });
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer ${
                    avatar.tiara === t.id ? 'bg-[#75476F] text-white' : 'bg-[#F9DCE7]/60 text-[#75476F]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DestinationFrame>
  );
};
