import React, { useEffect, useState } from 'react';
import { Sparkles, Wind, Droplets } from 'lucide-react';
import { DestinationFrame, RoyalButton } from '../components/ui/RoyalUI';
import { useKingdom } from '../context/KingdomContext';
import { soundEngine } from '../audio/soundEngine';

export const RoyalSpa: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { grantReward, showToast } = useKingdom();
  const [bubbles, setBubbles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({ id: i, popped: false, x: 10 + (i % 4) * 24, y: 18 + Math.floor(i / 4) * 28 }))
  );
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale Gently' | 'Hold Softly' | 'Exhale Peace'>('Inhale Gently');
  const [ritualDone, setRitualDone] = useState<string[]>([]);

  useEffect(() => {
    if (!breathingActive) return;
    const phases: Array<typeof breathPhase> = ['Inhale Gently', 'Hold Softly', 'Exhale Peace'];
    let idx = 0;
    const timer = window.setInterval(() => {
      idx = (idx + 1) % phases.length;
      setBreathPhase(phases[idx]);
    }, 3200);
    return () => clearInterval(timer);
  }, [breathingActive]);

  const popBubble = (id: number) => {
    soundEngine.playSfx('bubble');
    setBubbles((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, popped: true } : b));
      if (next.every((b) => b.popped)) {
        void grantReward({ coins: 25, points: 30 });
        showToast('Rosewater bath bliss complete! (+25 Coins)');
        setTimeout(() => {
          setBubbles(next.map((b) => ({ ...b, popped: false })));
        }, 1200);
      }
      return next;
    });
  };

  const completeRitual = (step: string) => {
    soundEngine.playSfx('chime');
    if (!ritualDone.includes(step)) {
      setRitualDone([...ritualDone, step]);
      void grantReward({ points: 15, coins: 15 });
    }
  };

  return (
    <DestinationFrame
      title="The Royal Spa"
      subtitle="Rosewater bubbles, calm breathing lotus & gentle self-care rituals"
      chapterNumber={16}
      onBack={onBack}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rose Petal Bubble Bath */}
        <div className="royal-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-[#FFF9F7] to-[#F9DCE7]/60">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#75476F] mb-1">
              <Droplets className="w-4 h-4 text-[#F18CAF]" />
              Rosewater Bubble Sanctuary
            </div>
            <h2 className="font-royal text-2xl font-semibold text-[#3B2138]">Pop the Floating Pearls</h2>
            <p className="text-sm text-[#75476F]/85 mt-1">Tap every shimmering rosewater bubble to refresh the bath and earn coins.</p>
          </div>

          <div className="relative h-64 mt-5 rounded-2xl bg-gradient-to-b from-[#CDE9FA]/45 to-[#F6B6CE]/45 border border-[#E8C98C]/50 overflow-hidden">
            {bubbles.map((b) =>
              !b.popped ? (
                <button
                  key={b.id}
                  onClick={() => popBubble(b.id)}
                  aria-label="Pop spa bubble"
                  className="absolute w-12 h-12 rounded-full bg-white/75 border border-white shadow-md hover:scale-110 transition-transform cursor-pointer animate-float-slow"
                  style={{ left: `${b.x}%`, top: `${b.y}%`, animationDelay: `${b.id * 0.25}s` }}
                />
              ) : null
            )}
          </div>
        </div>

        {/* Guided Breathing & Self-Care Rituals */}
        <div className="space-y-6">
          <div className="royal-card rounded-3xl p-6 sm:p-8 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#75476F] mb-2">
              <Wind className="w-4 h-4 text-[#E8C98C]" />
              Calm Lotus Breathing
            </div>
            <div className="my-4 flex justify-center">
              <div
                className={`w-32 h-32 rounded-full bg-gradient-to-br from-[#F6B6CE] to-[#DCCCFB] flex items-center justify-center border-2 border-[#E8C98C] transition-transform duration-[2800ms] ${
                  breathingActive && breathPhase === 'Inhale Gently'
                    ? 'scale-125'
                    : breathingActive && breathPhase === 'Hold Softly'
                    ? 'scale-125'
                    : 'scale-95'
                }`}
              >
                <span className="font-romantic text-sm text-[#3B2138] px-3">
                  {breathingActive ? breathPhase : 'Ready'}
                </span>
              </div>
            </div>
            <RoyalButton variant="secondary" size="sm" onClick={() => setBreathingActive(!breathingActive)}>
              {breathingActive ? 'Pause Breathing Guide' : 'Begin Calm Breathing'}
            </RoyalButton>
          </div>

          <div className="royal-card rounded-3xl p-6">
            <h3 className="font-romantic text-xl font-semibold text-[#3B2138] mb-3">Self-Care Checklist</h3>
            <div className="space-y-2.5">
              {[
                'Mist with Lavender Rosewater',
                'Warm Jade Roller Massage',
                'Sip Honey Chamomile Tea',
                'Read One Kind Reminder',
              ].map((step) => {
                const done = ritualDone.includes(step);
                return (
                  <button
                    key={step}
                    onClick={() => completeRitual(step)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-colors cursor-pointer ${
                      done
                        ? 'bg-[#F9DCE7]/60 border-[#75476F]/40 text-[#3B2138]'
                        : 'bg-white border-[#E8C98C]/45 text-[#75476F] hover:bg-[#FFF9F7]'
                    }`}
                  >
                    <span>{step}</span>
                    <Sparkles className={`w-4 h-4 ${done ? 'text-[#F18CAF]' : 'text-[#E8C98C]/50'}`} />
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
