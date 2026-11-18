import React, { useEffect, useState } from 'react';
import { Play, Pause, Shuffle, Repeat, Volume2, Piano, Sliders, Mic, Heart } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DestinationFrame, RoyalButton } from '../components/ui/RoyalUI';
import { SatinBow } from '../assets/royal/RoyalOrnaments';
import { soundEngine, type SfxName } from '../audio/soundEngine';

const PIANO_KEYS = [
  { note: 'C4', freq: 261.63, sharp: false },
  { note: 'C#4', freq: 277.18, sharp: true },
  { note: 'D4', freq: 293.66, sharp: false },
  { note: 'D#4', freq: 311.13, sharp: true },
  { note: 'E4', freq: 329.63, sharp: false },
  { note: 'F4', freq: 349.23, sharp: false },
  { note: 'F#4', freq: 369.99, sharp: true },
  { note: 'G4', freq: 392.0, sharp: false },
  { note: 'G#4', freq: 415.3, sharp: true },
  { note: 'A4', freq: 440.0, sharp: false },
  { note: 'A#4', freq: 466.16, sharp: true },
  { note: 'B4', freq: 493.88, sharp: false },
  { note: 'C5', freq: 523.25, sharp: false },
  { note: 'D5', freq: 587.33, sharp: false },
];

export const MusicRoom: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { db, updateProgress } = useKingdom();
  const [audioState, setAudioState] = useState(soundEngine.getState());
  const [bars, setBars] = useState<number[]>(Array(16).fill(0.1));
  const [catFilter, setCatFilter] = useState<string>('all');
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(true);
  const [voicePitch, setVoicePitch] = useState<'female' | 'male'>('female');

  useEffect(() => {
    const unsub = soundEngine.subscribe(() => setAudioState(soundEngine.getState()));
    const timer = window.setInterval(() => {
      setBars(soundEngine.getVisualiserBars(16));
    }, 90);
    return () => {
      unsub();
      clearInterval(timer);
    };
  }, []);

  if (!db) return null;
  const tracks = db.audioTracks.filter((t) => catFilter === 'all' || t.category === catFilter);
  const activeTrack = audioState.currentTrack || db.audioTracks[0];

  const handleToggleAmbient = (kind: 'rain' | 'forest' | 'fountain') => {
    const isOn = audioState.activeAmbients.includes(kind);
    soundEngine.toggleAmbient(kind, !isOn, 0.24);
  };

  const playVoiceGreeting = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(
      'Happy Princess Day, dearest Akuu! Welcome to your musical sanctuary, created with endless love by Tarun.'
    );
    utter.pitch = voicePitch === 'female' ? 1.25 : 0.85;
    utter.rate = 0.94;
    window.speechSynthesis.speak(utter);
  };

  return (
    <DestinationFrame
      title="The Royal Music Room"
      subtitle="Blush-pink heart turntable, audio-reactive visualiser, playable piano & ambient studio"
      chapterNumber={9}
      onBack={onBack}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Blush-Pink Heart-Lid Retro Turntable & Visualiser */}
        <div className="lg:col-span-6 royal-card rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#FFF9F7] to-[#F9DCE7]/65 border-2 border-[#E8C98C]/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <div className="text-xs text-[#75476F]/80 uppercase tracking-wider">Royal Vinyl Radio</div>
                <h2 className="font-royal text-2xl sm:text-3xl font-semibold text-[#3B2138]">{activeTrack?.title}</h2>
                <p className="text-xs text-[#75476F]">{activeTrack?.artist}</p>
              </div>
              <SatinBow className="w-10 h-7 shrink-0" />
            </div>

            {/* Heart-Lid Retro Turntable Deck */}
            <div className="relative rounded-3xl border-2 border-[#E8C98C] bg-gradient-to-b from-[#F9DCE7] to-[#F6B6CE]/75 p-5 shadow-inner mb-6">
              {/* Open Lid Arch with Heart Window */}
              <div className="mx-auto w-44 h-12 rounded-t-3xl bg-gradient-to-b from-[#FFF9F7] to-[#F9DCE7] border-2 border-b-0 border-[#E8C98C] flex items-center justify-center -mt-9 mb-3 shadow-sm">
                <Heart className="w-5 h-5 text-[#F18CAF] fill-[#F18CAF]" />
              </div>

              <div className="flex items-center justify-center gap-6">
                {/* Spinning Vinyl Record */}
                <div className="relative w-36 h-36 rounded-full bg-[#241227] border-4 border-[#E8C98C] shadow-lg flex items-center justify-center">
                  <div
                    className={`w-28 h-28 rounded-full border border-white/10 flex items-center justify-center ${
                      audioState.isPlaying ? 'animate-[spin_4.5s_linear_infinite]' : ''
                    }`}
                    style={{
                      background:
                        'repeating-radial-gradient(circle, #2D1831 0px, #2D1831 4px, #1D0E20 5px, #1D0E20 8px)',
                    }}
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#F6B6CE] to-[#F18CAF] border-2 border-[#E8C98C] flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FFF9F7]" />
                    </div>
                  </div>
                </div>

                {/* Rose-Gold Tonearm */}
                <svg viewBox="0 0 60 110" className="w-14 h-28 shrink-0" aria-hidden="true">
                  <circle cx="42" cy="18" r="12" fill="#E8C98C" stroke="#FFF9F7" strokeWidth="2" />
                  <path
                    d={audioState.isPlaying ? 'M42 20 L26 68 L14 88' : 'M42 20 L42 74 L38 92'}
                    fill="none"
                    stroke="#C89E54"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  <rect
                    x={audioState.isPlaying ? '7' : '31'}
                    y={audioState.isPlaying ? '84' : '88'}
                    width="12"
                    height="8"
                    rx="2"
                    fill="#F18CAF"
                    stroke="#E8C98C"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Music Visualiser */}
          <div className="mb-5 h-24 rounded-2xl bg-[#27152B] border border-[#E8C98C]/55 px-4 py-3 flex items-end justify-between gap-1.5">
            {bars.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-gradient-to-t from-[#F18CAF] via-[#F6B6CE] to-[#E8C98C] transition-all duration-100"
                style={{ height: `${Math.max(10, Math.round(v * 100))}%` }}
              />
            ))}
          </div>

          {activeTrack?.lyrics && (
            <p className="font-romantic italic text-sm text-[#5A3256] mb-5 text-center">
              “{activeTrack.lyrics}”
            </p>
          )}

          {/* Player Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <RoyalButton
                  variant="glossy"
                  size="sm"
                  onClick={() => activeTrack && soundEngine.togglePlay(activeTrack)}
                >
                  {audioState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {audioState.isPlaying ? 'Pause' : 'Play'}
                </RoyalButton>
                <button
                  onClick={() => setShuffle(!shuffle)}
                  aria-label="Toggle shuffle"
                  className={`p-2 rounded-lg cursor-pointer ${shuffle ? 'bg-[#75476F] text-white' : 'bg-white text-[#75476F]'}`}
                >
                  <Shuffle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setRepeat(!repeat)}
                  aria-label="Toggle repeat"
                  className={`p-2 rounded-lg cursor-pointer ${repeat ? 'bg-[#75476F] text-white' : 'bg-white text-[#75476F]'}`}
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 w-36">
                <Volume2 className="w-4 h-4 text-[#75476F] shrink-0" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={audioState.volume}
                  onChange={(e) => {
                    const vol = Number(e.target.value);
                    soundEngine.setVolume(vol);
                    void updateProgress({ preferences: { ...db.progress.preferences, musicVolume: vol } });
                  }}
                  aria-label="Music volume"
                  className="w-full accent-[#75476F]"
                />
              </div>
            </div>

            {/* Category Filter + Playlist */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {['all', 'fairytale', 'romantic', 'piano', 'orchestral', 'ambient', 'personal'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCatFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs capitalize cursor-pointer ${
                    catFilter === cat ? 'bg-[#75476F] text-white' : 'bg-white/80 text-[#75476F]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {tracks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => soundEngine.playTrack(t)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs cursor-pointer transition-colors ${
                    activeTrack?.id === t.id && audioState.isPlaying
                      ? 'bg-[#75476F] text-white'
                      : 'bg-white/90 text-[#3B2138] hover:bg-white'
                  }`}
                >
                  <span className="font-semibold truncate">{t.title}</span>
                  <span className="opacity-75 shrink-0 ml-2">{t.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Piano + Ambient Studio + Voice Greeting */}
        <div className="lg:col-span-6 space-y-6">
          {/* Interactive Royal Piano */}
          <div className="royal-card rounded-3xl p-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#75476F] mb-3">
              <Piano className="w-4 h-4 text-[#E8C98C]" />
              Interactive Royal Piano (Tap Keys to Play)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PIANO_KEYS.map((k) => (
                <button
                  key={k.note}
                  onClick={() => soundEngine.playPianoNote(k.freq)}
                  className={`h-24 rounded-b-xl border transition-transform active:scale-95 cursor-pointer flex items-end justify-center pb-2 text-[11px] font-semibold ${
                    k.sharp
                      ? 'w-9 bg-[#3B2138] text-[#FFF3D6] border-[#E8C98C]/60'
                      : 'w-11 bg-white text-[#3B2138] border-[#E8C98C] hover:bg-[#F9DCE7]/40'
                  }`}
                >
                  {k.note}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Mixing Studio & SFX */}
          <div className="royal-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#75476F]">
              <Sliders className="w-4 h-4 text-[#E8C98C]" />
              Ambient Sound Studio & Soundboard
            </div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: 'rain', label: 'Ambient Rain Mode' },
                  { id: 'forest', label: 'Magical Forest' },
                  { id: 'fountain', label: 'Water Fountain' },
                ] as const
              ).map((amb) => {
                const active = audioState.activeAmbients.includes(amb.id);
                return (
                  <button
                    key={amb.id}
                    onClick={() => handleToggleAmbient(amb.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      active ? 'bg-[#75476F] text-white' : 'bg-[#F9DCE7]/70 text-[#75476F]'
                    }`}
                  >
                    {amb.label} {active ? '(On)' : ''}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E8C98C]/30">
              {(['sparkle', 'wand', 'heart', 'purr', 'chime', 'bubble', 'bloom', 'firework'] as SfxName[]).map((sfx) => (
                <button
                  key={sfx}
                  onClick={() => soundEngine.playSfx(sfx)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#E8C98C]/50 text-xs capitalize text-[#3B2138] hover:bg-[#FFF9F7] cursor-pointer"
                >
                  {sfx}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Greeting Player */}
          <div className="royal-card rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#75476F]">
                <Mic className="w-4 h-4 text-[#F18CAF]" />
                Custom Voice Greeting
              </div>
              <p className="text-xs text-[#75476F]/85 mt-0.5">Choose warm female or male voice synthesis.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVoicePitch(voicePitch === 'female' ? 'male' : 'female')}
                className="px-3 py-1.5 rounded-lg bg-[#F9DCE7] text-xs font-medium text-[#75476F] cursor-pointer"
              >
                Voice: {voicePitch === 'female' ? 'Female' : 'Male'}
              </button>
              <RoyalButton variant="gold" size="sm" onClick={playVoiceGreeting}>
                Hear Greeting
              </RoyalButton>
            </div>
          </div>
        </div>
      </div>
    </DestinationFrame>
  );
};
