import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Crown } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { soundEngine } from '../audio/soundEngine';
import { ThreeCarriageJourney } from './ThreeCarriageJourney';
import { RoyalButton } from './ui/RoyalUI';
import { SatinBow, WaxSealHeart } from '../assets/royal/RoyalOrnaments';
import { CrownCrestIcon } from '../assets/royal/RoyalIcons';

type OpeningScene = 1 | 2 | 3 | 4;

export const OpeningSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { db, grantReward } = useKingdom();
  const [scene, setScene] = useState<OpeningScene>(1);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [journeyProgress, setJourneyProgress] = useState(0);
  const [gatesOpened, setGatesOpened] = useState(false);

  const starRef = useRef<HTMLDivElement | null>(null);
  const nebulaRef = useRef<HTMLDivElement | null>(null);
  const universeTextRef = useRef<HTMLDivElement | null>(null);

  const cfg = db?.siteConfig;
  const tracks = db?.audioTracks || [];

  // Scene 1: Magical Universe GSAP choreography
  useEffect(() => {
    if (scene !== 1) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(starRef.current, { scale: 0.1, opacity: 0 }, { scale: 1.4, opacity: 1, duration: 2.0, ease: 'power2.out' })
        .to(nebulaRef.current, { opacity: 0.9, scale: 1.15, duration: 2.4, ease: 'sine.inOut' }, '-=1.1')
        .fromTo(universeTextRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' }, '-=1.5');
    });
    const timer = window.setTimeout(() => {
      setScene(2);
    }, 6200);
    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, [scene]);

  // Scene 3: Three.js Flying Carriage progress timeline
  useEffect(() => {
    if (scene !== 3) return;
    const start = performance.now();
    const duration = 6800;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setJourneyProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setScene(4);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [scene]);

  // Scene 4: Castle gate animation
  useEffect(() => {
    if (scene !== 4) return;
    soundEngine.playSfx('door');
    const t = window.setTimeout(() => setGatesOpened(true), 600);
    return () => clearTimeout(t);
  }, [scene]);

  const handleOpenInvitation = () => {
    soundEngine.playSfx('envelope');
    setTimeout(() => soundEngine.playSfx('paper'), 220);
    setTimeout(() => soundEngine.playSfx('chime'), 420);
    if (tracks[0]) soundEngine.playTrack(tracks[0]);
    setEnvelopeOpened(true);
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.55 },
      colors: ['#F6B6CE', '#E8C98C', '#F18CAF', '#FFF9F7'],
    });
  };

  const handleBoardCarriage = () => {
    soundEngine.playSfx('wand');
    setScene(3);
  };

  const handleEnterKingdom = () => {
    soundEngine.playSfx('chest');
    void grantReward({ achievementId: 'first-steps', points: 40 });
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0D0712] text-[#FFF9F7] flex flex-col items-center justify-center">
      {/* Skip Intro Button */}
      <button
        onClick={() => {
          soundEngine.playSfx('sparkle');
          onComplete();
        }}
        className="fixed top-5 right-5 z-50 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-[#E8C98C]/40 text-xs font-medium text-[#FFF9F7]/90 transition-colors cursor-pointer"
      >
        Skip Intro
      </button>

      {/* SCENE 1: THE MAGICAL UNIVERSE */}
      {scene === 1 && (
        <div className="relative w-full h-full flex flex-col items-center justify-center px-6 text-center">
          <div
            ref={nebulaRef}
            className="absolute w-[620px] h-[620px] rounded-full opacity-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(246,182,206,0.36) 0%, rgba(220,204,251,0.22) 45%, rgba(13,7,18,0) 75%)',
              filter: 'blur(26px)',
            }}
          />

          {/* Constellation SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" viewBox="0 0 800 500">
            <g stroke="#E8C98C" strokeOpacity="0.4" strokeWidth="1">
              <line x1="400" y1="250" x2="290" y2="170" />
              <line x1="400" y1="250" x2="520" y2="165" />
              <line x1="290" y1="170" x2="210" y2="255" />
              <line x1="520" y1="165" x2="600" y2="250" />
              <line x1="210" y1="255" x2="400" y2="370" />
              <line x1="600" y1="250" x2="400" y2="370" />
            </g>
            {[
              [290, 170],
              [520, 165],
              [210, 255],
              [600, 250],
              [400, 370],
            ].map(([cx, cy], idx) => (
              <circle key={idx} cx={cx} cy={cy} r="3.5" fill="#FFF3D6" className="animate-twinkle" />
            ))}
          </svg>

          <div
            ref={starRef}
            className="w-8 h-8 rounded-full bg-[#FFF9F7] shadow-[0_0_50px_18px_rgba(246,182,206,0.85)] mb-10"
          />

          <div ref={universeTextRef} className="max-w-xl relative z-10 opacity-0">
            <p className="font-royal text-3xl sm:text-5xl italic tracking-wide text-[#FFF9F7]">
              {cfg?.openingUniverseText || 'Somewhere in a world full of magic...'}
            </p>
            <button
              onClick={() => {
                soundEngine.playSfx('chime');
                setScene(2);
              }}
              className="mt-8 text-xs tracking-widest uppercase text-[#E8C98C]/90 hover:text-[#FFF9F7] transition-colors cursor-pointer"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* SCENE 2: THE ROYAL INVITATION */}
      {scene === 2 && (
        <div
          className="relative w-full h-full flex flex-col items-center justify-center px-4 py-10"
          style={{
            background: 'radial-gradient(circle at center, #321A34 0%, #150A1B 80%)',
          }}
        >
          {/* Floating rose petals */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-3.5 h-2.5 rounded-full bg-[#F6B6CE]/70"
                style={{
                  left: `${(i * 7.3) % 95}%`,
                  animation: `petalFall ${6 + (i % 4)}s linear ${(i % 5) * 0.7}s infinite`,
                }}
              />
            ))}
          </div>

          <p className="font-romantic italic text-xl sm:text-2xl text-[#F9DCE7] mb-8 text-center">
            {cfg?.openingInvitationText || 'A very special invitation has arrived...'}
          </p>

          {!envelopeOpened ? (
            <div className="flex flex-col items-center animate-float-slow">
              <div className="relative w-80 sm:w-96 h-56 rounded-2xl bg-gradient-to-br from-[#FFF9F7] to-[#F9DCE7] border-2 border-[#E8C98C] shadow-[0_25px_70px_-15px_rgba(246,182,206,0.5)] flex items-center justify-center overflow-hidden">
                {/* Envelope flap lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 240" preserveAspectRatio="none">
                  <path d="M0 0 L200 130 L400 0" fill="#F6B6CE" fillOpacity="0.42" stroke="#E8C98C" strokeWidth="2" />
                  <path d="M0 240 L150 110 M400 240 L250 110" stroke="#E8C98C" strokeOpacity="0.5" strokeWidth="1.5" />
                </svg>
                {/* Pink satin ribbon + bow */}
                <div className="absolute inset-x-0 h-5 bg-[#F18CAF]/75 border-y border-[#E8C98C]/50" />
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                  <SatinBow className="w-12 h-9" />
                </div>
                {/* Golden Wax Seal */}
                <div className="relative z-10 drop-shadow-lg">
                  <WaxSealHeart className="w-16 h-16" />
                </div>
              </div>
              <div className="mt-8">
                <RoyalButton variant="glossy" size="lg" onClick={handleOpenInvitation}>
                  <Sparkles className="w-4 h-4" />
                  OPEN YOUR INVITATION
                </RoyalButton>
              </div>
            </div>
          ) : (
            <div className="relative max-w-lg w-full bg-[#FFF9F7] text-[#3B2138] rounded-2xl border-2 border-[#E8C98C] shadow-2xl p-7 sm:p-10 text-center animate-[fadeIn_0.6s_ease-out]">
              <CrownCrestIcon className="w-10 h-9 mx-auto mb-3" />
              <div className="font-handwritten text-2xl sm:text-3xl leading-relaxed whitespace-pre-line text-[#5A3256]">
                {cfg?.openingLetterBody}
              </div>
              <div className="mt-8">
                <RoyalButton variant="glossy" size="lg" onClick={handleBoardCarriage}>
                  TAKE ME TO MY KINGDOM ♡
                </RoyalButton>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SCENE 3: THE MAGICAL JOURNEY (Three.js 3D Flying Carriage) */}
      {scene === 3 && (
        <div className="relative w-full h-full">
          <ThreeCarriageJourney progress={journeyProgress} />
          <div className="relative z-10 h-full flex flex-col items-center justify-end pb-16 px-6 text-center pointer-events-none">
            <div className="px-6 py-4 rounded-2xl bg-[#1B1026]/70 border border-[#E8C98C]/40 max-w-lg">
              <p className="font-royal text-2xl sm:text-3xl italic text-[#FFF9F7]">
                Gliding across starlit clouds toward your castle...
              </p>
              <div className="mt-3 w-full h-1.5 rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#F6B6CE] to-[#E8C98C] transition-all duration-100"
                  style={{ width: `${Math.round(journeyProgress * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCENE 4: THE ROYAL CASTLE REVEAL */}
      {scene === 4 && (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <img
            src="/src/assets/images/royal_castle_hero_1794980444296.jpg"
            alt="Akuu's Princess Castle"
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[2200ms] ease-out ${
              gatesOpened ? 'scale-100' : 'scale-110'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E0F24]/90 via-[#1E0F24]/45 to-[#1E0F24]/25" />

          {/* Glowing Heart Pathway */}
          <div className="absolute bottom-0 inset-x-0 h-32 flex items-center justify-center gap-6 opacity-80 pointer-events-none">
            {Array.from({ length: 7 }).map((_, i) => (
              <Heart
                key={i}
                className="w-5 h-5 text-[#F6B6CE] fill-[#F6B6CE]/70 animate-float-slow"
                style={{ animationDelay: `${i * 0.25}s` }}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-2xl px-6 text-center">
            <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#E8C98C] mb-3">
              <Crown className="w-4 h-4" />
              Her Little Kingdom, Her Endless Magic
            </div>
            <h1 className="font-royal text-4xl sm:text-6xl font-semibold text-[#FFF9F7] leading-tight">
              {cfg?.castleWelcomeTitle || 'Welcome home, Princess Akuu.'}
            </h1>
            <p className="font-romantic italic text-lg sm:text-2xl text-[#F9DCE7] mt-4">
              {cfg?.castleWelcomeSubtitle || 'Your kingdom is ready. Your adventures are waiting.'}
            </p>
            <div className="mt-8">
              <RoyalButton variant="gold" size="lg" onClick={handleEnterKingdom}>
                ENTER MY KINGDOM
              </RoyalButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
