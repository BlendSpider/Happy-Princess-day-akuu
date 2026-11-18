import React, { useState } from 'react';
import { Utensils, Bath, Moon, Sun } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DestinationFrame, RoyalButton, RoyalProgressBar } from '../components/ui/RoyalUI';
import { FluffyKittenMascot } from '../assets/royal/RoyalCharacters';
import { soundEngine } from '../audio/soundEngine';

const PETS = [
  { id: 'mochi-kitten', name: 'Mochi', kind: 'Blush Kitten', color: '#F6B6CE' },
  { id: 'snowdrop-bunny', name: 'Snowdrop', kind: 'Pearl Bunny', color: '#FFF9F7' },
  { id: 'pip-teddy', name: 'Pip', kind: 'Honey Teddy', color: '#FFD7C2' },
] as const;

const ACCESSORIES = [
  { id: 'none', label: 'Natural' },
  { id: 'pink-bow', label: 'Pink Satin Bow' },
  { id: 'mini-crown', label: 'Tiny Gold Crown' },
  { id: 'pearl-collar', label: 'Pearl Collar' },
] as const;

export const KittyKingdom: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { db, updateProgress, grantReward, showToast } = useKingdom();
  const [reaction, setReaction] = useState<string>('Mochi purrs softly and leans into your hand ♡');
  const [bouncing, setBouncing] = useState(false);

  if (!db) return null;
  const { pet } = db.progress;
  const activeMeta = PETS.find((p) => p.id === pet.activePet) || PETS[0];

  const triggerBounce = () => {
    setBouncing(true);
    setTimeout(() => setBouncing(false), 700);
  };

  const handleFeed = () => {
    soundEngine.playSfx(pet.activePet === 'snowdrop-bunny' ? 'hop' : 'purr');
    triggerBounce();
    const nextHunger = Math.min(100, pet.hunger + 16);
    const nextHappiness = Math.min(100, pet.happiness + 8);
    void updateProgress({
      pet: { ...pet, hunger: nextHunger, happiness: nextHappiness, isSleeping: false },
    });
    void grantReward({ achievementId: 'pet-whisperer', points: 15, coins: 10 });
    setReaction(`${activeMeta.name} happily nibbles strawberry macarons!`);
  };

  const handleBath = () => {
    soundEngine.playSfx('bubble');
    triggerBounce();
    void updateProgress({
      pet: { ...pet, happiness: Math.min(100, pet.happiness + 12), energy: Math.min(100, pet.energy + 6), isSleeping: false },
    });
    setReaction(`${activeMeta.name} sparkles after a warm lavender bubble bath!`);
  };

  const handleToggleSleep = () => {
    soundEngine.playSfx('chime');
    const sleeping = !pet.isSleeping;
    void updateProgress({
      pet: { ...pet, isSleeping: sleeping, energy: sleeping ? 100 : pet.energy },
    });
    setReaction(sleeping ? `${activeMeta.name} curls up for a dreamy nap...` : `${activeMeta.name} wakes up stretching!`);
  };

  const handlePetHead = () => {
    soundEngine.playSfx('purr');
    triggerBounce();
    void updateProgress({
      pet: { ...pet, happiness: Math.min(100, pet.happiness + 10) },
    });
    showToast(`${activeMeta.name} loves you!`);
  };

  return (
    <DestinationFrame
      title="Kitty Kingdom"
      subtitle="Feed, bathe, dress & cuddle your loyal royal companions"
      chapterNumber={8}
      onBack={onBack}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pet Stage */}
        <div className="lg:col-span-7 royal-card rounded-3xl border-2 border-[#E8C98C] p-8 flex flex-col items-center justify-between bg-gradient-to-b from-[#FFF9F7] via-[#F9DCE7]/50 to-[#DCCCFB]/35 min-h-[430px]">
          <div className="flex flex-wrap gap-2 justify-center">
            {PETS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  soundEngine.playSfx(p.id === 'snowdrop-bunny' ? 'hop' : 'purr');
                  void updateProgress({ pet: { ...pet, activePet: p.id } });
                  setReaction(`${p.name} trots over excitedly!`);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  pet.activePet === p.id
                    ? 'bg-[#75476F] text-white shadow-sm'
                    : 'bg-white border border-[#E8C98C]/60 text-[#75476F]'
                }`}
              >
                {p.name} ({p.kind})
              </button>
            ))}
          </div>

          <button
            onClick={handlePetHead}
            title="Tap to cuddle!"
            className={`my-6 cursor-pointer transition-transform duration-300 hover:scale-105 ${
              bouncing ? '-translate-y-4' : ''
            }`}
          >
            {pet.activePet === 'mochi-kitten' ? (
              <FluffyKittenMascot
                className="w-52 h-48 drop-shadow-md"
                sleeping={pet.isSleeping}
                winking={bouncing}
                accessory={pet.accessory}
              />
            ) : (
              <svg viewBox="0 0 220 200" className="w-52 h-48 drop-shadow-md">
                <ellipse cx="110" cy="178" rx="56" ry="10" fill="#75476F" fillOpacity="0.15" />
                {pet.activePet === 'snowdrop-bunny' ? (
                  <>
                    <ellipse cx="82" cy="44" rx="14" ry="34" fill="#FFF9F7" stroke="#E8C98C" strokeWidth="2.5" />
                    <ellipse cx="138" cy="44" rx="14" ry="34" fill="#FFF9F7" stroke="#E8C98C" strokeWidth="2.5" />
                    <ellipse cx="82" cy="46" rx="7" ry="22" fill="#F6B6CE" />
                    <ellipse cx="138" cy="46" rx="7" ry="22" fill="#F6B6CE" />
                  </>
                ) : (
                  <>
                    <circle cx="72" cy="64" r="20" fill="#FFD7C2" stroke="#E8C98C" strokeWidth="2.5" />
                    <circle cx="148" cy="64" r="20" fill="#FFD7C2" stroke="#E8C98C" strokeWidth="2.5" />
                    <circle cx="72" cy="64" r="10" fill="#F6B6CE" />
                    <circle cx="148" cy="64" r="10" fill="#F6B6CE" />
                  </>
                )}
                <ellipse cx="110" cy="138" rx="44" ry="36" fill={activeMeta.color} stroke="#E8C98C" strokeWidth="2.5" />
                <ellipse cx="110" cy="96" rx="48" ry="40" fill={activeMeta.color} stroke="#E8C98C" strokeWidth="2.5" />
                {pet.isSleeping ? (
                  <>
                    <path d="M85 95 Q92 100 99 95" fill="none" stroke="#3B2138" strokeWidth="3" strokeLinecap="round" />
                    <path d="M121 95 Q128 100 135 95" fill="none" stroke="#3B2138" strokeWidth="3" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <circle cx="92" cy="94" r="5" fill="#3B2138" />
                    <circle cx="128" cy="94" r="5" fill="#3B2138" />
                    <circle cx="90.5" cy="92" r="1.8" fill="#FFFFFF" />
                    <circle cx="126.5" cy="92" r="1.8" fill="#FFFFFF" />
                  </>
                )}
                <ellipse cx="80" cy="104" rx="7" ry="4" fill="#F18CAF" fillOpacity="0.45" />
                <ellipse cx="140" cy="104" rx="7" ry="4" fill="#F18CAF" fillOpacity="0.45" />
                <polygon points="106,101 114,101 110,106" fill="#75476F" />
                <path d="M103 108 Q110 113 117 108" fill="none" stroke="#75476F" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            )}
          </button>

          <p className="font-romantic italic text-base text-[#3B2138] text-center mb-4">{reaction}</p>

          <div className="flex flex-wrap gap-2.5 justify-center">
            <RoyalButton variant="glossy" size="sm" onClick={handleFeed}>
              <Utensils className="w-3.5 h-3.5" />
              Feed Treat
            </RoyalButton>
            <RoyalButton variant="secondary" size="sm" onClick={handleBath}>
              <Bath className="w-3.5 h-3.5" />
              Bubble Bath
            </RoyalButton>
            <RoyalButton variant="gold" size="sm" onClick={handleToggleSleep}>
              {pet.isSleeping ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              {pet.isSleeping ? 'Wake Up' : 'Lullaby Nap'}
            </RoyalButton>
          </div>
        </div>

        {/* Pet Stats & Accessories */}
        <div className="lg:col-span-5 space-y-6">
          <div className="royal-card rounded-3xl border-2 border-[#E8C98C]/70 p-6 space-y-4">
            <h2 className="font-romantic text-xl font-semibold text-[#3B2138]">Companion Care Meters</h2>
            <RoyalProgressBar label="Happiness" value={pet.happiness} color="#F18CAF" />
            <RoyalProgressBar label="Fullness" value={pet.hunger} color="#E8C98C" />
            <RoyalProgressBar label="Energy" value={pet.energy} color="#8BBCE0" />
          </div>

          <div className="royal-card rounded-3xl p-6">
            <h3 className="font-romantic text-xl font-semibold text-[#3B2138] mb-3">Pet Accessories</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {ACCESSORIES.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => {
                    soundEngine.playSfx('sparkle');
                    void updateProgress({ pet: { ...pet, accessory: acc.id } });
                  }}
                  className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                    pet.accessory === acc.id
                      ? 'bg-[#75476F] text-white border-[#75476F]'
                      : 'bg-white border-[#E8C98C]/45 text-[#3B2138] hover:bg-[#FFF9F7]'
                  }`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DestinationFrame>
  );
};
