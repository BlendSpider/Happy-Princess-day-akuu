import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Crown,
  Star,
  Key,
  Coins,
  Compass,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DESTINATIONS } from '../data/destinations';
import type { KingdomWing } from '../types/kingdom';
import { PrincessAvatar } from './PrincessAvatar';
import { SparkleDivider } from './ui/RoyalUI';
import { ChibiPrincessGreeting, FluffyKittenMascot } from '../assets/royal/RoyalCharacters';
import { SatinBow } from '../assets/royal/RoyalOrnaments';
import { soundEngine } from '../audio/soundEngine';

const WING_TABS: Array<{ id: 'all' | KingdomWing; label: string }> = [
  { id: 'all', label: 'All 24 Realms' },
  { id: 'royal', label: 'Royal Wing' },
  { id: 'gardens', label: 'Gardens & Wonders' },
  { id: 'memories', label: 'Memories & Letters' },
  { id: 'play', label: 'Play & Create' },
];

export const KingdomHub: React.FC = () => {
  const { db, navigateTo, updateProgress, grantReward, showToast, replayOpening } = useKingdom();
  const [wingFilter, setWingFilter] = useState<'all' | KingdomWing>('all');
  const [fountainRipples, setFountainRipples] = useState(0);

  if (!db) return null;
  const { progress, siteConfig } = db;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const filteredDestinations =
    wingFilter === 'all' ? DESTINATIONS : DESTINATIONS.filter((d) => d.wing === wingFilter);

  const handleHiddenStar = (starId: string) => {
    if (progress.hiddenStarsFound.includes(starId)) {
      soundEngine.playSfx('chime');
      showToast('This secret star is already glowing in your constellation ♡');
      return;
    }
    const nextStars = [...progress.hiddenStarsFound, starId];
    void updateProgress({ hiddenStarsFound: nextStars });
    void grantReward({
      stars: 2,
      keys: 1,
      coins: 50,
      points: 60,
      achievementId: nextStars.length >= 2 ? 'secret-seeker' : undefined,
    });
    soundEngine.playSfx('sparkle');
    showToast('You discovered a hidden castle star! (+2 Stars, +1 Key)');
  };

  const handleFountainClick = () => {
    soundEngine.playSfx('fountain');
    setFountainRipples((n) => n + 1);
    void grantReward({ coins: 5, points: 10 });
  };

  return (
    <div className="min-h-screen bg-[#FFF9F7] pb-28">
      {/* HERO INTERACTIVE KINGDOM CANVAS */}
      <section className="relative overflow-hidden border-b border-[#E8C98C]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 lg:py-10">
          {/* Greeting + Royal Treasury Strip */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
            <div className="max-w-2xl">
              <div className="text-xs font-medium tracking-wider uppercase text-[#75476F]/80 mb-1.5">
                Her Little Kingdom · Created with endless love by Tarun
              </div>
              <h1 className="font-royal text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#3B2138] leading-[1.08] text-balance">
                {greeting}, my Princess Akuu ♡
              </h1>
              <p className="font-romantic italic text-lg sm:text-xl text-[#75476F] mt-2">
                Your little world is filled with surprises today.
              </p>
            </div>

            {/* Quiet Unboxed Royal Treasury Stats */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#3B2138] tabular-nums">
              <span className="inline-flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[#E8C98C]" />
                <strong>{progress.points}</strong> pts
              </span>
              <span className="text-[#E8C98C]" aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="w-4 h-4 text-[#E8C98C] fill-[#E8C98C]" />
                <strong>{progress.stars}</strong> stars
              </span>
              <span className="text-[#E8C98C]" aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Key className="w-4 h-4 text-[#75476F]" />
                <strong>{progress.keys}</strong> keys
              </span>
              <span className="text-[#E8C98C]" aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-[#C69A4B]" />
                <strong>{progress.coins}</strong> coins
              </span>
              <span className="text-[#E8C98C]" aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#F18CAF]" />
                <strong>{progress.visitedDestinations.length}</strong>/24 realms
              </span>
            </div>
          </div>

          {/* Interactive Miniature Castle World Stage (Ref Sheets 1 & 2 layout) */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-[#E8C98C] shadow-xl bg-[#27152B] min-h-[470px] sm:min-h-[540px] flex flex-col justify-between">
            <img
              src="/src/assets/images/royal_castle_hero_1794980444296.jpg"
              alt="Akuu's Interactive Princess Castle"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241129]/85 via-[#241129]/15 to-[#241129]/35" />

            {/* Hidden Secret Star Easter Egg */}
            <button
              onClick={() => handleHiddenStar('castle-sky-star')}
              aria-label="Secret glowing sky star"
              title="A secret twinkling star — click to collect!"
              className="absolute top-5 left-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-[#FFF3D6] hover:scale-125 transition-transform cursor-pointer animate-twinkle"
            >
              <Sparkles className="w-6 h-6 drop-shadow-[0_0_8px_rgba(255,243,214,0.95)]" />
            </button>

            <div className="relative z-10 p-5 sm:p-7 flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              {/* Left: Chibi Princess Akuu Speech Bubble & Announcement */}
              <div className="flex items-start gap-3 max-w-lg">
                <div className="hidden sm:block shrink-0 -mt-2 animate-float-slow">
                  <ChibiPrincessGreeting className="w-24 h-24 drop-shadow-lg" />
                </div>
                <div className="relative rounded-2xl bg-[#FFF9F7]/94 border-2 border-[#E8C98C] px-5 py-4 text-[#3B2138] shadow-lg">
                  <SatinBow className="w-7 h-5 absolute -top-2.5 right-4" />
                  <div className="text-[11px] uppercase tracking-widest font-semibold text-[#75476F] mb-1">
                    Royal Decree · Castle Courtyard
                  </div>
                  <p className="text-sm leading-relaxed text-[#3B2138]">
                    {siteConfig.announcementText}
                  </p>
                </div>
              </div>

              {/* Right-Side Quick-Jump Castle Wing Navigation (Ref Sheet 2 motif) */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <button
                    onClick={() =>
                      void updateProgress({
                        preferences: {
                          ...progress.preferences,
                          sfxEnabled: !progress.preferences.sfxEnabled,
                        },
                      })
                    }
                    className="px-3 py-1.5 rounded-full bg-[#FFF9F7]/92 border border-[#E8C98C]/70 text-xs font-medium text-[#75476F] hover:bg-[#F9DCE7] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {progress.preferences.sfxEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    {progress.preferences.sfxEnabled ? 'SFX On' : 'Muted'}
                  </button>
                  <button
                    onClick={replayOpening}
                    className="px-3 py-1.5 rounded-full bg-[#FFF9F7]/92 border border-[#E8C98C]/70 text-xs font-medium text-[#75476F] hover:bg-[#F9DCE7] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Replay Intro
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-1 gap-1.5 w-full sm:w-40">
                  {[
                    { id: 'royal-palace', label: 'Palace' },
                    { id: 'princess-arcade', label: 'Games (15)' },
                    { id: 'memory-museum', label: 'Gallery' },
                    { id: 'music-room', label: 'Music' },
                    { id: 'princess-diary', label: 'Diary' },
                    { id: 'treasure-vault', label: 'Vault' },
                  ].map((wing) => (
                    <button
                      key={wing.id}
                      onClick={() => navigateTo(wing.id as Parameters<typeof navigateTo>[0])}
                      className="px-4 py-2 rounded-full bg-[#FFF9F7]/92 hover:bg-gradient-to-r hover:from-[#F9DCE7] hover:to-[#FFF9F7] border border-[#E8C98C] text-xs font-semibold text-[#3B2138] shadow-md transition-all hover:scale-[1.03] cursor-pointer text-center"
                    >
                      {wing.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Courtyard Landmarks + Princess Avatar & Crowned Kitten */}
            <div className="relative z-10 p-5 sm:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-wrap gap-2.5 max-w-xl">
                {[
                  { id: 'dressing-room', label: 'Dressing Room' },
                  { id: 'magical-garden', label: 'Magical Garden' },
                  { id: 'dollhouse', label: 'Dollhouse' },
                  { id: 'dream-cloud', label: '3D Snow Globe' },
                  { id: 'grand-finale', label: 'Grand Finale ♡' },
                ].map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => navigateTo(spot.id as Parameters<typeof navigateTo>[0])}
                    className="px-4 py-2 rounded-full bg-gradient-to-b from-[#FFA8C7] to-[#F18CAF] text-white border border-[#FFF3D6]/85 text-xs sm:text-sm font-semibold shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    {spot.label}
                  </button>
                ))}
                <button
                  onClick={handleFountainClick}
                  className="px-4 py-2 rounded-full bg-[#CDE9FA]/95 hover:bg-[#CDE9FA] border border-white/80 text-xs sm:text-sm font-semibold text-[#3B2138] shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  Wish Fountain {fountainRipples > 0 ? `(${fountainRipples})` : ''}
                </button>
              </div>

              {/* Princess Akuu + Crowned Kitten Mochi */}
              <div className="flex items-end gap-3 self-end bg-[#FFF9F7]/92 rounded-3xl border-2 border-[#E8C98C] px-5 py-3 shadow-xl">
                <button
                  onClick={() => navigateTo('dressing-room')}
                  title="Customize Princess Akuu"
                  className="cursor-pointer hover:scale-[1.03] transition-transform"
                >
                  <PrincessAvatar avatar={progress.avatar} size={102} />
                </button>
                <button
                  onClick={() => navigateTo('kitty-kingdom')}
                  title="Visit Kitty Kingdom"
                  className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform pb-1"
                >
                  <FluffyKittenMascot className="w-20 h-20" accessory={progress.pet.accessory} sleeping={progress.pet.isSleeping} />
                  <span className="text-[11px] font-semibold text-[#75476F] -mt-1">
                    {progress.pet.happiness}% Joy
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE 24 MAGICAL DESTINATIONS ATLAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-royal text-3xl sm:text-4xl font-semibold text-[#3B2138]">
              Explore Your 24 Magical Destinations
            </h2>
            <p className="text-sm text-[#75476F] mt-1">
              Every building opens its own interactive realm, stories, and collectibles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-[#F9DCE7]/70 border border-[#E8C98C]/60">
            {WING_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  soundEngine.playSfx('pop');
                  setWingFilter(tab.id);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  wingFilter === tab.id
                    ? 'bg-[#75476F] text-white shadow-sm'
                    : 'text-[#75476F] hover:text-[#3B2138]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDestinations.map((dest) => {
            const visited = progress.visitedDestinations.includes(dest.id);
            return (
              <button
                key={dest.id}
                onClick={() => navigateTo(dest.id)}
                className="group text-left royal-card rounded-2xl p-5 border border-[#E8C98C]/60 transition-all duration-200 hover:-translate-y-1 hover:border-[#E8C98C] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75476F] cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#75476F]/75 mb-2 tabular-nums">
                    <span>
                      {String(dest.number).padStart(2, '0')} · {dest.wing.charAt(0).toUpperCase() + dest.wing.slice(1)}
                    </span>
                    <span className={visited ? 'text-[#75476F] font-semibold' : 'text-[#75476F]/60'}>
                      {visited ? 'Visited' : 'New'}
                    </span>
                  </div>
                  <h3 className="font-romantic text-xl font-semibold text-[#3B2138] group-hover:text-[#75476F] transition-colors">
                    {dest.title}
                  </h3>
                  <p className="text-sm text-[#75476F]/85 mt-1.5 leading-relaxed">
                    {dest.subtitle}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E8C98C]/30 flex items-center justify-between text-xs font-medium text-[#75476F]">
                  <span>Enter Realm</span>
                  <span
                    className="w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125"
                    style={{ backgroundColor: dest.accent }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <SparkleDivider label="Dedicated to My Akuu · With endless love, Tarun" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 text-xs text-[#75476F]/80">
          <div className="inline-flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-[#F18CAF] fill-[#F18CAF]" />
            <span>Akuu’s Princess World · Her Little Kingdom, Her Endless Magic</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('achievement-hall')}
              className="hover:text-[#3B2138] underline underline-offset-2 cursor-pointer"
            >
              Royal Certificate
            </button>
            <button
              onClick={() => navigateTo('grand-finale')}
              className="hover:text-[#3B2138] underline underline-offset-2 cursor-pointer"
            >
              Enter Sunset Finale
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
