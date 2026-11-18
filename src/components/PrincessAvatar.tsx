import React from 'react';
import type { AvatarState } from '../types/kingdom';

export const DRESS_STYLES: Record<string, { name: string; primary: string; trim: string; skirt: string }> = {
  'blush-tulle': { name: 'Blush Tulle Gown', primary: '#F6B6CE', trim: '#E8C98C', skirt: '#F9DCE7' },
  'lavender-dream': { name: 'Lavender Mist Gown', primary: '#DCCCFB', trim: '#E8C98C', skirt: '#EFE8FD' },
  'champagne-ballgown': { name: 'Champagne Rose Gown', primary: '#F5DFB5', trim: '#C89E54', skirt: '#FFF4DC' },
  'strawberry-velvet': { name: 'Strawberry Velvet Gown', primary: '#F18CAF', trim: '#FFF9F7', skirt: '#FAD0DF' },
  'sky-serenade': { name: 'Sky Serenade Gown', primary: '#CDE9FA', trim: '#E8C98C', skirt: '#EBF6FD' },
  'rosewater-silk': { name: 'Rosewater Silk Ballgown', primary: '#F39CB9', trim: '#E8C98C', skirt: '#FCE6EE' },
  'plum-coronation': { name: 'Royal Plum Coronation', primary: '#75476F', trim: '#E8C98C', skirt: '#A978A2' },
  'peach-blossom': { name: 'Peach Blossom Gown', primary: '#FFD7C2', trim: '#E8C98C', skirt: '#FFEBE0' },
};

export const PrincessAvatar: React.FC<{
  avatar: AvatarState;
  size?: number;
  className?: string;
}> = ({ avatar, size = 220, className = '' }) => {
  const dress = DRESS_STYLES[avatar.dress] || DRESS_STYLES['blush-tulle'];
  const poseAnim =
    avatar.pose === 'spin'
      ? 'animate-[spin_1.5s_ease-in-out]'
      : avatar.pose === 'jump'
      ? 'animate-bounce'
      : avatar.pose === 'curtsy'
      ? 'translate-y-2 scale-y-95'
      : '';

  const hairFill =
    avatar.hairstyle === 'midnight-braid'
      ? '#2C1B28'
      : avatar.hairstyle === 'chestnut-curls'
      ? '#5A382E'
      : avatar.hairstyle === 'golden-silk'
      ? '#D9B166'
      : '#3E2334';

  return (
    <div
      className={`inline-flex flex-col items-center select-none transition-transform duration-300 ${poseAnim} ${className}`}
      style={{ width: size }}
    >
      <svg viewBox="0 0 220 280" className="w-full h-auto drop-shadow-md">
        <defs>
          <linearGradient id="gownGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={dress.primary} />
            <stop offset="100%" stopColor={dress.skirt} />
          </linearGradient>
        </defs>

        {/* Soft ground shadow */}
        <ellipse cx="110" cy="264" rx="58" ry="8" fill="#75476F" fillOpacity="0.14" />

        {/* Back hair */}
        <path
          d={
            avatar.hairstyle === 'royal-updo'
              ? 'M76 62 C76 34, 144 34, 144 62 C144 82, 76 82, 76 62 Z'
              : 'M72 64 C65 110, 62 145, 78 158 C95 164, 125 164, 142 158 C158 145, 155 110, 148 64 C140 36, 80 36, 72 64 Z'
          }
          fill={hairFill}
        />

        {/* Shoes */}
        <ellipse cx="94" cy="256" rx="10" ry="5" fill={dress.trim} />
        <ellipse cx="126" cy="256" rx="10" ry="5" fill={dress.trim} />

        {/* Ballgown Skirt */}
        <path
          d="M86 144 C70 185, 42 232, 46 250 C78 258, 142 258, 174 250 C178 232, 150 185, 134 144 Z"
          fill="url(#gownGrad)"
          stroke={dress.trim}
          strokeWidth="2.2"
        />
        {/* Skirt scalloped lace overlay */}
        <path
          d="M52 240 Q80 228 110 242 Q140 228 168 240"
          fill="none"
          stroke={dress.trim}
          strokeWidth="2"
          strokeDasharray="4 3"
        />
        {/* Gown waist ribbon */}
        <path d="M84 140 Q110 148 136 140 L134 148 Q110 155 86 148 Z" fill={dress.trim} />

        {/* Bodice */}
        <path d="M86 108 L134 108 L136 142 Q110 148 84 142 Z" fill={dress.primary} stroke={dress.trim} strokeWidth="1.8" />
        {/* Puff sleeves */}
        <circle cx="80" cy="116" r="11" fill={dress.skirt} stroke={dress.trim} strokeWidth="1.6" />
        <circle cx="140" cy="116" r="11" fill={dress.skirt} stroke={dress.trim} strokeWidth="1.6" />

        {/* Arms */}
        <path
          d={avatar.pose === 'wave' ? 'M76 120 Q54 110 52 84' : 'M76 122 Q62 142 74 156'}
          fill="none"
          stroke="#FBE0D3"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M144 122 Q158 142 146 156"
          fill="none"
          stroke="#FBE0D3"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Neck & Necklace */}
        <rect x="103" y="94" width="14" height="16" rx="6" fill="#FBE0D3" />
        {avatar.necklace !== 'none' && (
          <path d="M98 106 Q110 115 122 106" fill="none" stroke={dress.trim} strokeWidth="2.4" />
        )}
        {avatar.necklace === 'heart-locket' && (
          <circle cx="110" cy="114" r="3.6" fill="#F18CAF" stroke="#E8C98C" strokeWidth="1.2" />
        )}
        {avatar.necklace === 'pearl-strand' && (
          <>
            <circle cx="103" cy="110" r="2.2" fill="#FFF9F7" />
            <circle cx="110" cy="112" r="2.5" fill="#FFF9F7" />
            <circle cx="117" cy="110" r="2.2" fill="#FFF9F7" />
          </>
        )}

        {/* Face */}
        <ellipse cx="110" cy="72" rx="26" ry="27" fill="#FDE6DA" />
        {/* Blush */}
        <ellipse cx="93" cy="79" rx="5.5" ry="3.2" fill={avatar.blushTone || '#F6B6CE'} fillOpacity="0.6" />
        <ellipse cx="127" cy="79" rx="5.5" ry="3.2" fill={avatar.blushTone || '#F6B6CE'} fillOpacity="0.6" />

        {/* Eyes */}
        <ellipse cx="99" cy="71" rx="3.4" ry="4.4" fill="#3B2138" />
        <ellipse cx="121" cy="71" rx="3.4" ry="4.4" fill="#3B2138" />
        <circle cx="97.8" cy="69.5" r="1.2" fill="#FFFFFF" />
        <circle cx="119.8" cy="69.5" r="1.2" fill="#FFFFFF" />

        {/* Smile */}
        <path d="M104 83 Q110 88 116 83" fill="none" stroke={avatar.lipTint || '#F18CAF'} strokeWidth="2.3" strokeLinecap="round" />

        {/* Front bangs */}
        <path
          d="M84 62 Q95 45 110 54 Q125 45 136 62 Q126 42 110 42 Q94 42 84 62 Z"
          fill={hairFill}
        />

        {/* Tiara */}
        {avatar.tiara !== 'none' && (
          <g transform="translate(86, 26)">
            <path
              d="M4 18 L10 6 L18 14 L24 2 L30 14 L38 6 L44 18 Z"
              fill={avatar.tiara === 'imperial-diamond' ? '#CDE9FA' : '#E8C98C'}
              stroke="#B88D48"
              strokeWidth="1.4"
            />
            <circle cx="24" cy="9" r="2.6" fill="#F18CAF" />
            <circle cx="12" cy="13" r="1.8" fill="#FFF9F7" />
            <circle cx="36" cy="13" r="1.8" fill="#FFF9F7" />
          </g>
        )}
      </svg>
      {avatar.nameplateTitle && (
        <div className="mt-1 px-4 py-1 border border-[#E8C98C]/60 bg-[#FFF9F7]/90 rounded-lg text-xs font-romantic tracking-wide text-[#75476F]">
          {avatar.nameplateTitle}
        </div>
      )}
    </div>
  );
};
