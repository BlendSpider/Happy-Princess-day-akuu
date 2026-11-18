import React, { useState } from 'react';
import { BookOpen, Lock, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DestinationFrame, RoyalButton } from '../components/ui/RoyalUI';
import { soundEngine } from '../audio/soundEngine';

export const LoveLibrary: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { db } = useKingdom();
  const [letterIdx, setLetterIdx] = useState(0);
  const [poemRevealed, setPoemRevealed] = useState(false);

  if (!db) return null;
  const { letters, progress } = db;
  const activeLetter = letters[letterIdx] || letters[0];
  const isLocked =
    activeLetter?.isSecret &&
    progress.keys < (activeLetter.unlockKeysRequired || 2) &&
    !progress.unlockedBoxes.includes('box-golden');

  const flipPage = (dir: -1 | 1) => {
    soundEngine.playSfx('paper');
    setLetterIdx((i) => (i + dir + letters.length) % letters.length);
  };

  return (
    <DestinationFrame
      title="The Love Library"
      subtitle="Leather-bound letters, wax-sealed promises & Tarun’s hidden poems"
      chapterNumber={6}
      onBack={onBack}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive Page-Turning Letter Book */}
        <div className="lg:col-span-8 royal-card rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#FFF9F7] via-[#FFF9F7] to-[#F9DCE7]/45 border-2 border-[#E8C98C]">
          {activeLetter && (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8C98C]/40">
                <div>
                  <div className="text-xs text-[#75476F]/80">{activeLetter.date} · Shelf {letterIdx + 1} of {letters.length}</div>
                  <h2 className="font-royal text-3xl font-semibold text-[#3B2138]">{activeLetter.title}</h2>
                </div>
                <div
                  className="w-11 h-11 rounded-full border-2 border-[#FFF9F7] shadow flex items-center justify-center shrink-0"
                  style={{ backgroundColor: activeLetter.sealColor }}
                >
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
              </div>

              <div className="py-8 min-h-[240px]">
                {isLocked ? (
                  <div className="text-center py-10 space-y-3">
                    <Lock className="w-10 h-10 text-[#75476F]/60 mx-auto" />
                    <h3 className="font-romantic text-xl text-[#3B2138]">Sealed Secret Letter</h3>
                    <p className="text-sm text-[#75476F] max-w-md mx-auto">
                      Gather {activeLetter.unlockKeysRequired || 2} Royal Keys in the Princess Arcade or open The Golden Heart Box in the Vault to break this seal.
                    </p>
                  </div>
                ) : (
                  <div className="font-handwritten text-2xl sm:text-3xl leading-relaxed text-[#4A2546] whitespace-pre-line">
                    {activeLetter.body}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#E8C98C]/40 flex flex-wrap items-center justify-between gap-4">
                <span className="font-romantic italic text-sm text-[#75476F]">{activeLetter.from}</span>
                <div className="flex items-center gap-2">
                  <RoyalButton variant="secondary" size="sm" onClick={() => flipPage(-1)}>
                    <ChevronLeft className="w-4 h-4" />
                    Previous Page
                  </RoyalButton>
                  <RoyalButton variant="secondary" size="sm" onClick={() => flipPage(1)}>
                    Next Page
                    <ChevronRight className="w-4 h-4" />
                  </RoyalButton>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Poem Reveal Shelf */}
        <div className="lg:col-span-4 space-y-5">
          <div className="royal-card rounded-3xl p-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#75476F] mb-2">
              <BookOpen className="w-4 h-4 text-[#E8C98C]" />
              Personalised Poem Reveal
            </div>
            <h3 className="font-romantic text-xl font-semibold text-[#3B2138] mb-3">A Verse for Akuu</h3>
            {!poemRevealed ? (
              <RoyalButton
                variant="primary"
                size="sm"
                onClick={() => {
                  soundEngine.playSfx('chime');
                  setPoemRevealed(true);
                }}
              >
                Unfold Royal Poem
              </RoyalButton>
            ) : (
              <p className="font-handwritten text-2xl leading-relaxed text-[#5A3256]">
                “In skies of blush and quiet gold,
                <br />
                A thousand tiny stars unfold—
                <br />
                Yet none shine half as soft or true,
                <br />
                As every moment spent with you.”
              </p>
            )}
          </div>
        </div>
      </div>
    </DestinationFrame>
  );
};
