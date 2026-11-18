import React from 'react';

export const CrownCrestIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 48 40" className={className} aria-hidden="true">
    <path d="M6 32 L10 14 L18 22 L24 8 L30 22 L38 14 L42 32 Z" fill="#E8C98C" stroke="#B5893D" strokeWidth="2" strokeLinejoin="round" />
    <rect x="6" y="32" width="36" height="5" rx="2.5" fill="#DFB66B" stroke="#B5893D" strokeWidth="1.5" />
    <circle cx="24" cy="7" r="2.6" fill="#F18CAF" />
    <circle cx="10" cy="13" r="2" fill="#FFF9F7" />
    <circle cx="38" cy="13" r="2" fill="#FFF9F7" />
    <circle cx="24" cy="25" r="3" fill="#F18CAF" stroke="#FFF9F7" strokeWidth="1" />
  </svg>
);

export const MagicWandAsset: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <line x1="8" y1="40" x2="29" y2="19" stroke="#E8C98C" strokeWidth="4" strokeLinecap="round" />
    <polygon
      points="33,6 36,14 44,14 38,19 40,27 33,22 26,27 28,19 22,14 30,14"
      fill="#F6B6CE"
      stroke="#E8C98C"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="33" cy="17" r="3" fill="#FFF9F7" />
  </svg>
);

export const WingedTreasureChestSVG: React.FC<{ className?: string; open?: boolean; color?: string }> = ({
  className = 'w-32 h-28',
  open = false,
  color = '#F18CAF',
}) => (
  <svg viewBox="0 0 160 130" className={className} aria-hidden="true">
    {/* Fairy Wings */}
    <path d="M44 64 C16 32, 6 52, 18 70 C8 78, 16 94, 42 82 Z" fill="#FFF9F7" fillOpacity="0.85" stroke="#E8C98C" strokeWidth="2" />
    <path d="M116 64 C144 32, 154 52, 142 70 C152 78, 144 94, 118 82 Z" fill="#FFF9F7" fillOpacity="0.85" stroke="#E8C98C" strokeWidth="2" />
    {/* Glow Aura */}
    {open && <ellipse cx="80" cy="60" rx="46" ry="24" fill="#FFF3D6" fillOpacity="0.65" />}
    {/* Chest Body */}
    <rect x="38" y="64" width="84" height="44" rx="10" fill={color} stroke="#E8C98C" strokeWidth="3.5" />
    <rect x="44" y="68" width="72" height="36" rx="6" fill="none" stroke="#FFF9F7" strokeOpacity="0.45" strokeWidth="1.5" />
    {/* Chest Lid */}
    <path
      d={open ? 'M36 52 C42 26, 118 26, 124 52 Z' : 'M36 66 C42 38, 118 38, 124 66 Z'}
      fill={color}
      stroke="#E8C98C"
      strokeWidth="3.5"
    />
    {/* Gold Clasp & Heart Gem */}
    <rect x="70" y={open ? '48' : '58'} width="20" height="16" rx="4" fill="#E8C98C" stroke="#B5893D" strokeWidth="1.5" />
    <circle cx="80" cy={open ? '56' : '66'} r="4" fill="#FFF9F7" />
  </svg>
);

export const RoseBouquetSVG: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <path d="M35 60 L50 92 L65 60 Z" fill="#F9DCE7" stroke="#E8C98C" strokeWidth="2" />
    <circle cx="36" cy="42" r="13" fill="#F6B6CE" stroke="#E8C98C" strokeWidth="1.6" />
    <circle cx="64" cy="42" r="13" fill="#F18CAF" stroke="#E8C98C" strokeWidth="1.6" />
    <circle cx="50" cy="30" r="14" fill="#F9DCE7" stroke="#E8C98C" strokeWidth="1.6" />
    <circle cx="50" cy="48" r="13" fill="#DCCCFB" stroke="#E8C98C" strokeWidth="1.6" />
    <path d="M40 68 Q50 74 60 68" fill="none" stroke="#F18CAF" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const RoyalKeyAsset: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
    <circle cx="13" cy="20" r="7" fill="#FFF3D6" stroke="#C89E54" strokeWidth="2.5" />
    <circle cx="13" cy="20" r="2.5" fill="#F18CAF" />
    <path d="M20 20 L35 20 M29 20 L29 26 M34 20 L34 25" stroke="#C89E54" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
