import React from 'react';

export const SatinBow: React.FC<{ color?: string; accent?: string; className?: string }> = ({
  color = '#F6B6CE',
  accent = '#E8C98C',
  className = 'w-8 h-6',
}) => (
  <svg viewBox="0 0 64 44" className={className} aria-hidden="true">
    <path d="M32 20 C18 6, 4 8, 6 22 C8 34, 22 30, 32 22 Z" fill={color} stroke={accent} strokeWidth="2" />
    <path d="M32 20 C46 6, 60 8, 58 22 C56 34, 42 30, 32 22 Z" fill={color} stroke={accent} strokeWidth="2" />
    <path d="M28 24 L18 42 L26 39 L30 25 Z" fill={color} stroke={accent} strokeWidth="1.5" />
    <path d="M36 24 L46 42 L38 39 L34 25 Z" fill={color} stroke={accent} strokeWidth="1.5" />
    <circle cx="32" cy="21" r="5.5" fill={color} stroke={accent} strokeWidth="2" />
    <circle cx="32" cy="21" r="2" fill={accent} />
  </svg>
);

export const GoldFiligreeCorner: React.FC<{ className?: string; flipX?: boolean; flipY?: boolean }> = ({
  className = 'w-8 h-8',
  flipX = false,
  flipY = false,
}) => (
  <svg
    viewBox="0 0 40 40"
    className={className}
    style={{ transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})` }}
    aria-hidden="true"
  >
    <path d="M4 34 L4 10 Q4 4 10 4 L34 4" fill="none" stroke="#E8C98C" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M9 24 Q9 9 24 9" fill="none" stroke="#E8C98C" strokeWidth="1.3" strokeOpacity="0.8" />
    <circle cx="10" cy="10" r="2.2" fill="#F6B6CE" stroke="#E8C98C" strokeWidth="1" />
    <circle cx="4" cy="34" r="1.6" fill="#E8C98C" />
    <circle cx="34" cy="4" r="1.6" fill="#E8C98C" />
  </svg>
);

export const PearlGarland: React.FC<{ className?: string }> = ({ className = 'w-full h-4' }) => (
  <svg viewBox="0 0 240 16" className={className} preserveAspectRatio="none" aria-hidden="true">
    {Array.from({ length: 15 }).map((_, i) => {
      const x = 8 + i * 16;
      const y = 8 + Math.sin((i / 14) * Math.PI) * 4;
      return (
        <g key={i}>
          <circle cx={x} cy={y} r={i % 2 === 0 ? 3.2 : 2.3} fill="#FFF9F7" stroke="#E8C98C" strokeWidth="0.9" />
        </g>
      );
    })}
  </svg>
);

export const WaxSealHeart: React.FC<{ color?: string; className?: string }> = ({
  color = '#E8C98C',
  className = 'w-11 h-11',
}) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <circle cx="24" cy="24" r="21" fill={color} stroke="#FFF3D6" strokeWidth="2" />
    <circle cx="24" cy="24" r="16" fill="none" stroke="#75476F" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="3 2" />
    <path
      d="M24 33 C24 33 14 26.5 14 20.5 C14 17 16.8 14.5 19.8 14.5 C21.8 14.5 23.3 15.6 24 17 C24.7 15.6 26.2 14.5 28.2 14.5 C31.2 14.5 34 17 34 20.5 C34 26.5 24 33 24 33 Z"
      fill="#75476F"
    />
  </svg>
);

export const WingedHeartEmblem: React.FC<{ className?: string }> = ({ className = 'w-14 h-10' }) => (
  <svg viewBox="0 0 80 52" className={className} aria-hidden="true">
    <path d="M26 26 C14 14, 4 16, 4 24 C8 26, 14 27, 22 29 C10 30, 8 34, 12 37 C18 36, 23 33, 28 31 Z" fill="#FFF9F7" stroke="#E8C98C" strokeWidth="1.4" />
    <path d="M54 26 C66 14, 76 16, 76 24 C72 26, 66 27, 58 29 C70 30, 72 34, 68 37 C62 36, 57 33, 52 31 Z" fill="#FFF9F7" stroke="#E8C98C" strokeWidth="1.4" />
    <path
      d="M40 41 C40 41 25 31 25 22 C25 17 29 14 33.5 14 C36.5 14 38.8 15.8 40 18 C41.2 15.8 43.5 14 46.5 14 C51 14 55 17 55 22 C55 31 40 41 40 41 Z"
      fill="#F18CAF"
      stroke="#E8C98C"
      strokeWidth="2"
    />
  </svg>
);
