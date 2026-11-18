import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, RotateCcw, Download, Play } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DestinationFrame, RoyalButton } from '../components/ui/RoyalUI';
import { PrincessLakeSilhouetteSVG } from '../assets/royal/RoyalCharacters';
import { RoseBouquetSVG } from '../assets/royal/RoyalIcons';
import { soundEngine } from '../audio/soundEngine';

const LINES = [
  'Before you leave this little kingdom...',
  'You deserve every little bit of magic.',
  'You deserve to feel special.',
  'You deserve all the beautiful things this world can offer.',
  'And no matter how many magical places exist...',
  'There’s only one princess whose smile makes my world brighter.',
];

export const GrandFinale: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { db, grantReward, showToast } = useKingdom();
  const [act, setAct] = useState<'portal' | 'kitten' | 'reveals' | 'video' | 'celebration'>('portal');
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    void grantReward({ achievementId: 'finale-witness' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (act !== 'reveals') return;
    if (lineIdx < LINES.length) {
      const t = window.setTimeout(() => {
        soundEngine.playSfx('chime');
        setLineIdx((i) => i + 1);
      }, 2400);
      return () => clearTimeout(t);
    }
  }, [act, lineIdx]);

  const triggerFireworks = () => {
    soundEngine.playSfx('firework');
    confetti({
      particleCount: 95,
      spread: 110,
      origin: { y: 0.5 },
      colors: ['#F6B6CE', '#E8C98C', '#F18CAF', '#DCCCFB', '#FFF9F7'],
    });
  };

  const downloadKeepsake = () => {
    soundEngine.playSfx('sparkle');
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 0, 1080);
    grad.addColorStop(0, '#2A1432');
    grad.addColorStop(0.55, '#683A63');
    grad.addColorStop(1, '#F6B6CE');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    ctx.strokeStyle = '#E8C98C';
    ctx.lineWidth = 10;
    ctx.strokeRect(48, 48, 984, 984);

    ctx.fillStyle = '#FFF3D6';
    ctx.font = '600 32px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('A K U U', 540, 220);

    ctx.fillStyle = '#FFF9F7';
    ctx.font = 'bold 58px Georgia, serif';
    ctx.fillText('Happy Princess Day, My Akuu ♡', 540, 440);

    ctx.fillStyle = '#F9DCE7';
    ctx.font = 'italic 34px Georgia, serif';
    ctx.fillText('Every kingdom needs a princess.', 540, 560);
    ctx.fillText('Mine has always been you.', 540, 615);

    ctx.fillStyle = '#FFF3D6';
    ctx.font = 'italic 38px Georgia, serif';
    ctx.fillText('With endless love, Your Tarun', 540, 820);

    const a = document.createElement('a');
    a.download = 'happy-princess-day-akuu-keepsake.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
    showToast('Princess Day Keepsake Card downloaded ♡');
  };

  if (!db) return null;
  const { siteConfig } = db;

  return (
    <DestinationFrame
      title="The Grand Surprise Chamber"
      subtitle="A sunset rose garden, a little messenger & Tarun’s final Princess Day surprise"
      chapterNumber={24}
      onBack={onBack}
    >
      <div className="relative rounded-3xl overflow-hidden border-2 border-[#E8C98C] min-h-[560px] bg-[#1E0F24] text-[#FFF9F7] shadow-2xl flex flex-col items-center justify-center p-6 sm:p-12 text-center">
        <img
          src="/src/assets/images/grand_finale_sunset_1794980446163.jpg"
          alt="Rose Garden Sunset Portal"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
            act === 'celebration' ? 'opacity-50 scale-105' : 'opacity-65'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B0D22]/90 via-[#2C1436]/55 to-[#1B0D22]/75" />

        {/* ACT 1: PORTAL */}
        {act === 'portal' && (
          <div className="relative z-10 max-w-xl space-y-6">
            <div className="w-24 h-24 rounded-full mx-auto border-2 border-[#E8C98C] bg-[#F6B6CE]/20 flex items-center justify-center shadow-[0_0_50px_rgba(246,182,206,0.65)] animate-float-slow">
              <Sparkles className="w-10 h-10 text-[#FFF3D6]" />
            </div>
            <h2 className="font-royal text-4xl sm:text-5xl font-semibold">The Sunset Rose Portal</h2>
            <p className="font-romantic italic text-lg text-[#F9DCE7]">
              Beyond this archway waits a warm sunset garden and a final letter carried by Mochi.
            </p>
            <RoyalButton
              variant="gold"
              size="lg"
              onClick={() => {
                soundEngine.playSfx('wand');
                setAct('kitten');
              }}
            >
              Step Through the Portal
            </RoyalButton>
          </div>
        )}

        {/* ACT 2: KITTEN WITH PINK ENVELOPE */}
        {act === 'kitten' && (
          <div className="relative z-10 max-w-lg space-y-6">
            <div className="p-6 rounded-3xl bg-[#FFF9F7]/15 border border-[#E8C98C]/60 backdrop-blur-sm">
              <div className="text-xs uppercase tracking-widest text-[#E8C98C] mb-3">Special Delivery</div>
              <p className="font-romantic italic text-2xl text-[#FFF9F7] mb-5">
                Little Mochi trots along the glowing rose pathway carrying a pink satin envelope in her paws...
              </p>
              <RoyalButton
                variant="gold"
                size="lg"
                onClick={() => {
                  soundEngine.playSfx('envelope');
                  setLineIdx(0);
                  setAct('reveals');
                }}
              >
                Open Final Envelope
              </RoyalButton>
            </div>
          </div>
        )}

        {/* ACT 3: TIMED CINEMATIC REVEALS */}
        {act === 'reveals' && (
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="space-y-3 min-h-[220px] flex flex-col justify-center">
              {LINES.slice(0, lineIdx + 1).map((line, i) => (
                <p
                  key={i}
                  className={`font-royal transition-opacity duration-700 ${
                    i === LINES.length - 1 ? 'text-3xl sm:text-4xl text-[#FFF3D6]' : 'text-xl sm:text-2xl text-[#F9DCE7]'
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>

            {lineIdx >= LINES.length && (
              <div className="pt-4 space-y-4 animate-[fadeIn_0.8s_ease-out]">
                <h2 className="font-royal text-4xl sm:text-6xl font-bold animate-shimmer-gold">
                  Happy Princess Day, My Akuu ♡
                </h2>
                <p className="font-handwritten text-3xl text-[#F9DCE7]">With endless love, Your Tarun.</p>
                <div className="pt-2">
                  <RoyalButton
                    variant="gold"
                    size="lg"
                    onClick={() => {
                      soundEngine.playSfx('chime');
                      setAct('video');
                    }}
                  >
                    <Play className="w-4 h-4" />
                    Play Final Video Message
                  </RoyalButton>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ACT 4: FINAL PERSONALISED VIDEO MESSAGE */}
        {act === 'video' && (
          <div className="relative z-10 max-w-3xl w-full space-y-5">
            <h3 className="font-royal text-3xl text-[#FFF3D6]">{siteConfig.finalVideoTitle}</h3>
            <div className="rounded-2xl overflow-hidden border-2 border-[#E8C98C] bg-black/75 aspect-video flex items-center justify-center">
              {siteConfig.finalVideoUrl ? (
                <video src={siteConfig.finalVideoUrl} controls autoPlay className="w-full h-full object-contain" />
              ) : (
                <div className="p-8 space-y-4 text-center">
                  <Heart className="w-12 h-12 text-[#F6B6CE] fill-[#F6B6CE] mx-auto animate-float-slow" />
                  <p className="font-handwritten text-3xl text-[#FFF9F7] leading-relaxed max-w-xl mx-auto">
                    {siteConfig.princessDayMessage}
                  </p>
                  <p className="text-xs text-[#E8C98C]">
                    (Tarun can upload a personal final video anytime in the Control Room!)
                  </p>
                </div>
              )}
            </div>
            <RoyalButton
              variant="gold"
              size="lg"
              onClick={() => {
                triggerFireworks();
                setAct('celebration');
              }}
            >
              Illuminate the Kingdom Sky ✨
            </RoyalButton>
          </div>
        )}

        {/* ACT 5: CASTLE FIREWORKS & AKUU STARS FINALE */}
        {act === 'celebration' && (
          <div className="relative z-10 max-w-2xl space-y-6">
            {/* Golden Stars Spelling A K U U */}
            <div className="flex items-center justify-center gap-5 sm:gap-8">
              {['A', 'K', 'U', 'U'].map((ch, idx) => (
                <div
                  key={idx}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#E8C98C] bg-[#FFF3D6]/15 flex items-center justify-center font-royal text-3xl font-bold text-[#FFF3D6] shadow-[0_0_30px_rgba(232,201,140,0.75)] animate-twinkle"
                >
                  {ch}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6">
              <PrincessLakeSilhouetteSVG className="w-32 h-32 drop-shadow-lg" />
              <RoseBouquetSVG className="w-24 h-24 animate-float-slow" />
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F7]/12 border border-[#E8C98C]/60">
              <p className="font-handwritten text-3xl sm:text-4xl text-[#FFF9F7] leading-snug">
                “Every kingdom needs a princess. Mine has always been you.”
              </p>
              <div className="font-romantic italic text-base text-[#E8C98C] mt-3">
                Forever yours, Tarun ♡
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <RoyalButton variant="gold" onClick={triggerFireworks}>
                Launch Fireworks
              </RoyalButton>
              <RoyalButton variant="secondary" onClick={downloadKeepsake}>
                <Download className="w-4 h-4" />
                Download Keepsake
              </RoyalButton>
              <RoyalButton
                variant="primary"
                onClick={() => {
                  setLineIdx(0);
                  setAct('portal');
                }}
              >
                <RotateCcw className="w-4 h-4" />
                Replay Finale
              </RoyalButton>
            </div>
          </div>
        )}
      </div>
    </DestinationFrame>
  );
};
