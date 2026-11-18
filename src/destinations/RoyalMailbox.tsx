import React, { useState } from 'react';
import { Mail, Sparkles, Waves } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DestinationFrame, RoyalButton } from '../components/ui/RoyalUI';
import { soundEngine } from '../audio/soundEngine';

const FLOATING_NOTES = [
  'Note 1: Drink water and rest whenever you feel tired today, my princess ♡',
  'Note 2: You make even ordinary Tuesday evenings feel like a celebration.',
  'Note 3: Whenever you doubt yourself, borrow the way my eyes see you.',
  'Note 4: A hug is waiting for you whenever we meet next!',
];

export const RoyalMailbox: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { db, grantReward } = useKingdom();
  const [bottleOpened, setBottleOpened] = useState(false);
  const [activeNote, setActiveNote] = useState(0);

  if (!db) return null;

  return (
    <DestinationFrame
      title="The Royal Mailbox"
      subtitle="Floating love notes, daily surprise envelopes & message in a bottle"
      chapterNumber={20}
      onBack={onBack}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Floating Love Notes */}
        <div className="royal-card rounded-3xl p-7 bg-gradient-to-b from-[#FFF9F7] to-[#F9DCE7]/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#75476F] mb-2">
              <Mail className="w-4 h-4 text-[#F18CAF]" />
              Floating Love Notes
            </div>
            <h2 className="font-royal text-2xl font-semibold text-[#3B2138]">Sweet Little Envelopes</h2>
          </div>

          <div className="my-6 p-6 rounded-2xl bg-white border border-[#E8C98C]/60 shadow-sm animate-float-slow">
            <p className="font-handwritten text-2xl sm:text-3xl text-[#5A3256] leading-snug">
              {FLOATING_NOTES[activeNote]}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {FLOATING_NOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  soundEngine.playSfx('envelope');
                  setActiveNote(i);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer ${
                  activeNote === i ? 'bg-[#75476F] text-white' : 'bg-white border border-[#E8C98C]/50 text-[#75476F]'
                }`}
              >
                Envelope #{i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Message in a Bottle */}
        <div className="royal-card rounded-3xl p-7 bg-gradient-to-b from-[#CDE9FA]/50 to-[#FFF9F7] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#75476F] mb-2">
              <Waves className="w-4 h-4 text-[#5FA8D3]" />
              Starlight Lagoon Shore
            </div>
            <h2 className="font-royal text-2xl font-semibold text-[#3B2138]">Message in a Bottle</h2>
            <p className="text-sm text-[#75476F]/85 mt-1">A shimmering glass bottle washed ashore just for Akuu.</p>
          </div>

          <div className="my-6 p-6 rounded-2xl bg-white/90 border border-[#E8C98C]/50 text-center">
            {!bottleOpened ? (
              <div className="space-y-4">
                <Sparkles className="w-10 h-10 text-[#E8C98C] mx-auto animate-float-slow" />
                <RoyalButton
                  variant="gold"
                  onClick={() => {
                    soundEngine.playSfx('glass');
                    setBottleOpened(true);
                    void grantReward({ coins: 20, points: 20 });
                  }}
                >
                  Uncork the Bottle
                </RoyalButton>
              </div>
            ) : (
              <div className="font-handwritten text-2xl text-[#3B2138] leading-relaxed">
                “Across every ocean and every starlit sky, my favourite destination is always right beside you. — Tarun ♡”
              </div>
            )}
          </div>

          <div className="text-xs text-[#75476F]/80">
            Open the Love Library anytime to read full multi-page letters.
          </div>
        </div>
      </div>
    </DestinationFrame>
  );
};
