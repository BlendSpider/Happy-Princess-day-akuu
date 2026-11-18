import React from 'react';
import { Sparkles, Download } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DestinationFrame, GildedFrameCard, RoyalButton } from '../components/ui/RoyalUI';
import { DRESS_STYLES, PrincessAvatar } from '../components/PrincessAvatar';
import { CrownCrestIcon } from '../assets/royal/RoyalIcons';
import { soundEngine } from '../audio/soundEngine';

const TIARAS = [
  { id: 'pearl-crest', label: 'Pearl Crest' },
  { id: 'rose-gold', label: 'Champagne Gold' },
  { id: 'imperial-diamond', label: 'Imperial Diamond' },
  { id: 'none', label: 'No Tiara' },
];

const HAIRSTYLES = [
  { id: 'princess-waves', label: 'Princess Waves' },
  { id: 'midnight-braid', label: 'Midnight Braid' },
  { id: 'chestnut-curls', label: 'Chestnut Curls' },
  { id: 'golden-silk', label: 'Golden Silk' },
  { id: 'royal-updo', label: 'Royal Updo' },
];

const NECKLACES = [
  { id: 'heart-locket', label: 'Heart Locket' },
  { id: 'pearl-strand', label: 'Pearl Strand' },
  { id: 'gold-ribbon', label: 'Gold Choker' },
  { id: 'none', label: 'None' },
];

const POSES: Array<{ id: 'wave' | 'spin' | 'curtsy' | 'jump'; label: string }> = [
  { id: 'wave', label: 'Royal Wave' },
  { id: 'spin', label: 'Twirl' },
  { id: 'curtsy', label: 'Curtsy' },
  { id: 'jump', label: 'Joy Hop' },
];

export const DressingRoom: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { db, updateProgress, grantReward, showToast } = useKingdom();

  if (!db) return null;
  const { avatar } = db.progress;

  const setField = <K extends keyof typeof avatar>(key: K, val: (typeof avatar)[K]) => {
    soundEngine.playSfx('sparkle');
    void updateProgress({ avatar: { ...avatar, [key]: val } });
  };

  const handleSaveLook = () => {
    soundEngine.playSfx('wand');
    void grantReward({ achievementId: 'royal-stylist', points: 25 });
    showToast('Your royal look has been saved to the palace wardrobe ♡');
  };

  const handleExportPortrait = () => {
    soundEngine.playSfx('glass');
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 0, 800);
    grad.addColorStop(0, '#FFF9F7');
    grad.addColorStop(0.5, '#F9DCE7');
    grad.addColorStop(1, '#DCCCFB');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 800);

    ctx.strokeStyle = '#E8C98C';
    ctx.lineWidth = 10;
    ctx.strokeRect(24, 24, 592, 752);

    ctx.fillStyle = '#3B2138';
    ctx.font = '600 38px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(avatar.nameplateTitle || 'Princess Akuu', 320, 110);

    ctx.fillStyle = '#75476F';
    ctx.font = 'italic 22px Georgia, serif';
    const dressLabel = DRESS_STYLES[avatar.dress]?.name || 'Royal Gown';
    ctx.fillText(`Wearing ${dressLabel}`, 320, 155);

    ctx.fillStyle = '#75476F';
    ctx.font = '20px sans-serif';
    ctx.fillText('Akuu’s Princess World · Official Royal Portrait', 320, 720);

    const link = document.createElement('a');
    link.download = 'princess-akuu-portrait.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Royal Portrait downloaded!');
  };

  return (
    <DestinationFrame
      title="Princess Dressing Room"
      subtitle="Boutique dress closet, tiaras, hairstyles, makeup & gilded palace mirror"
      chapterNumber={2}
      onBack={onBack}
      rightSlot={
        <div className="flex items-center gap-2">
          <RoyalButton variant="secondary" size="sm" onClick={handleExportPortrait}>
            <Download className="w-3.5 h-3.5" />
            Save Portrait
          </RoyalButton>
          <RoyalButton variant="glossy" size="sm" onClick={handleSaveLook}>
            <Sparkles className="w-3.5 h-3.5" />
            Save Look ♡
          </RoyalButton>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Animated Gilded Mirror Stage */}
        <GildedFrameCard
          showBow
          className="lg:col-span-5 flex flex-col items-center bg-gradient-to-b from-[#FFF9F7] via-[#F9DCE7]/45 to-[#DCCCFB]/35"
        >
          <div className="flex items-center gap-2 text-xs font-romantic italic text-[#75476F] mb-3">
            <CrownCrestIcon className="w-5 h-5" />
            Choose your dream dress ♡
          </div>
          <div className="w-full max-w-xs aspect-[3/4] rounded-[140px_140px_28px_28px] border-4 border-[#E8C98C] bg-gradient-to-b from-[#FFFFFF] via-[#F9DCE7]/35 to-[#CDE9FA]/35 shadow-inner flex flex-col items-center justify-center p-4">
            <PrincessAvatar avatar={avatar} size={230} />
          </div>

          {/* Pose Buttons */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {POSES.map((p) => (
              <button
                key={p.id}
                onClick={() => setField('pose', p.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  avatar.pose === p.id
                    ? 'bg-[#75476F] text-white'
                    : 'bg-[#F9DCE7]/70 text-[#75476F] hover:bg-[#F6B6CE]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Nameplate Input */}
          <div className="mt-5 w-full max-w-xs">
            <label className="block text-xs font-medium text-[#75476F] mb-1">
              Royal Nameplate
            </label>
            <input
              type="text"
              value={avatar.nameplateTitle}
              onChange={(e) => setField('nameplateTitle', e.target.value)}
              maxLength={32}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E8C98C]/60 bg-white text-sm text-[#3B2138] focus:outline-none focus:ring-2 focus:ring-[#75476F]"
            />
          </div>
        </GildedFrameCard>

        {/* Boutique Wardrobe Rack & Makeup Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Dresses Closet Rack */}
          <GildedFrameCard className="bg-gradient-to-b from-[#FFF9F7] to-[#F9DCE7]/30">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-romantic text-xl font-semibold text-[#3B2138]">Royal Wardrobe Closet</h2>
              <span className="text-xs text-[#75476F]/75">Tap any gown on the rack</span>
            </div>
            {/* Brass Closet Rail */}
            <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-[#E8C98C]/40 via-[#E8C98C] to-[#E8C98C]/40 mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(DRESS_STYLES).map(([id, style]) => {
                const selected = avatar.dress === id;
                return (
                  <button
                    key={id}
                    onClick={() => setField('dress', id)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center ${
                      selected
                        ? 'border-[#75476F] bg-[#F9DCE7]/65 ring-2 ring-[#E8C98C] -translate-y-0.5'
                        : 'border-[#E8C98C]/50 bg-white hover:bg-[#FFF9F7]'
                    }`}
                  >
                    {/* Mini Gown & Gold Hanger SVG */}
                    <svg viewBox="0 0 60 66" className="w-12 h-14 mb-1.5" aria-hidden="true">
                      <path d="M30 4 Q34 4 34 8 Q34 11 30 12 L16 20 L44 20 L30 12" fill="none" stroke="#C89E54" strokeWidth="2" strokeLinecap="round" />
                      <path d="M23 20 L37 20 L34 32 L26 32 Z" fill={style.primary} stroke={style.trim} strokeWidth="1.2" />
                      <path d="M26 32 L12 60 Q30 65 48 60 L34 32 Z" fill={style.primary} stroke={style.trim} strokeWidth="1.4" />
                      <path d="M25 32 Q30 35 35 32" fill="none" stroke={style.trim} strokeWidth="2" />
                    </svg>
                    <div className="text-xs font-medium text-[#3B2138] leading-snug">{style.name}</div>
                  </button>
                );
              })}
            </div>
          </GildedFrameCard>

          {/* Tiaras & Necklaces */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="royal-card rounded-2xl p-5">
              <h3 className="font-romantic text-lg font-semibold text-[#3B2138] mb-3">Tiara Collection</h3>
              <div className="flex flex-wrap gap-2">
                {TIARAS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setField('tiara', t.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      avatar.tiara === t.id
                        ? 'bg-[#75476F] text-white'
                        : 'bg-[#F9DCE7]/50 text-[#75476F] hover:bg-[#F9DCE7]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="royal-card rounded-2xl p-5">
              <h3 className="font-romantic text-lg font-semibold text-[#3B2138] mb-3">Necklace Collection</h3>
              <div className="flex flex-wrap gap-2">
                {NECKLACES.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setField('necklace', n.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      avatar.necklace === n.id
                        ? 'bg-[#75476F] text-white'
                        : 'bg-[#F9DCE7]/50 text-[#75476F] hover:bg-[#F9DCE7]'
                    }`}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hairstyles & Makeup Studio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="royal-card rounded-2xl p-5">
              <h3 className="font-romantic text-lg font-semibold text-[#3B2138] mb-3">Hairstyle Salon</h3>
              <div className="flex flex-wrap gap-2">
                {HAIRSTYLES.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setField('hairstyle', h.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      avatar.hairstyle === h.id
                        ? 'bg-[#75476F] text-white'
                        : 'bg-[#F9DCE7]/50 text-[#75476F] hover:bg-[#F9DCE7]'
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="royal-card rounded-2xl p-5">
              <h3 className="font-romantic text-lg font-semibold text-[#3B2138] mb-3">Royal Makeup Studio</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-[#75476F] mb-1.5">Cheek Blush</div>
                  <div className="flex gap-2">
                    {['#F6B6CE', '#F18CAF', '#FFD7C2', '#E5989B'].map((c) => (
                      <button
                        key={c}
                        aria-label={`Select blush ${c}`}
                        onClick={() => setField('blushTone', c)}
                        className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
                          avatar.blushTone === c ? 'border-[#3B2138] scale-110' : 'border-white'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#75476F] mb-1.5">Lip Tint</div>
                  <div className="flex gap-2">
                    {['#F18CAF', '#C95D7A', '#E88D8D', '#9B4D6A'].map((c) => (
                      <button
                        key={c}
                        aria-label={`Select lip tint ${c}`}
                        onClick={() => setField('lipTint', c)}
                        className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
                          avatar.lipTint === c ? 'border-[#3B2138] scale-110' : 'border-white'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DestinationFrame>
  );
};
