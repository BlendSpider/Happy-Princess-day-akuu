import React from 'react';

export const FluffyKittenMascot: React.FC<{
  className?: string;
  sleeping?: boolean;
  winking?: boolean;
  accessory?: 'none' | 'pink-bow' | 'mini-crown' | 'pearl-collar';
}> = ({ className = 'w-44 h-44', sleeping = false, winking = false, accessory = 'mini-crown' }) => (
  <svg viewBox="0 0 220 210" className={className}>
    <ellipse cx="110" cy="188" rx="58" ry="10" fill="#75476F" fillOpacity="0.16" />
    {/* Fluffy Tail */}
    <path d="M148 156 C184 150, 192 114, 172 104 C160 98, 152 114, 158 130" fill="#FFF9F7" stroke="#E8C98C" strokeWidth="2.5" strokeLinecap="round" />
    {/* Ears */}
    <path d="M62 88 L72 34 L104 66 Z" fill="#FFF9F7" stroke="#E8C98C" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M158 88 L148 34 L116 66 Z" fill="#FFF9F7" stroke="#E8C98C" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M70 80 L76 48 L96 68 Z" fill="#F6B6CE" />
    <path d="M150 80 L144 48 L124 68 Z" fill="#F6B6CE" />
    {/* Body */}
    <ellipse cx="110" cy="148" rx="46" ry="36" fill="#FFF9F7" stroke="#E8C98C" strokeWidth="2.5" />
    {/* Paws */}
    <ellipse cx="86" cy="176" rx="13" ry="8" fill="#FFF9F7" stroke="#E8C98C" strokeWidth="2" />
    <ellipse cx="134" cy="176" rx="13" ry="8" fill="#FFF9F7" stroke="#E8C98C" strokeWidth="2" />
    {/* Head */}
    <ellipse cx="110" cy="98" rx="52" ry="44" fill="#FFF9F7" stroke="#E8C98C" strokeWidth="2.5" />
    {/* Neck Satin Bow */}
    <g transform="translate(110, 134)">
      <path d="M0 0 L-16 -7 L-14 8 Z M0 0 L16 -7 L14 8 Z" fill="#F6B6CE" stroke="#E8C98C" strokeWidth="1.4" />
      <circle cx="0" cy="0" r="4.5" fill="#F18CAF" stroke="#E8C98C" strokeWidth="1.2" />
    </g>
    {/* Crown / Bow Accessory */}
    {(accessory === 'mini-crown' || accessory === 'pearl-collar') && (
      <g transform="translate(86, 36)">
        <path d="M4 22 L10 6 L18 15 L24 2 L30 15 L38 6 L44 22 Z" fill="#E8C98C" stroke="#B88D48" strokeWidth="1.6" />
        <circle cx="24" cy="12" r="3" fill="#F18CAF" />
      </g>
    )}
    {accessory === 'pink-bow' && (
      <g transform="translate(136, 54)">
        <path d="M0 6 L-14 0 L-12 14 Z M0 6 L14 0 L12 14 Z" fill="#F18CAF" stroke="#E8C98C" strokeWidth="1.4" />
        <circle cx="0" cy="6" r="4" fill="#FFF9F7" />
      </g>
    )}
    {/* Eyes */}
    {sleeping ? (
      <>
        <path d="M82 96 Q90 102 98 96" fill="none" stroke="#3B2138" strokeWidth="3" strokeLinecap="round" />
        <path d="M122 96 Q130 102 138 96" fill="none" stroke="#3B2138" strokeWidth="3" strokeLinecap="round" />
      </>
    ) : (
      <>
        <ellipse cx="90" cy="95" rx="6.5" ry="7.5" fill="#3B2138" />
        <circle cx="88" cy="92" r="2.2" fill="#FFFFFF" />
        {winking ? (
          <path d="M122 96 Q130 90 138 96" fill="none" stroke="#3B2138" strokeWidth="3" strokeLinecap="round" />
        ) : (
          <>
            <ellipse cx="130" cy="95" rx="6.5" ry="7.5" fill="#3B2138" />
            <circle cx="128" cy="92" r="2.2" fill="#FFFFFF" />
          </>
        )}
      </>
    )}
    {/* Rosy Cheeks & Mouth */}
    <ellipse cx="75" cy="107" rx="8.5" ry="4.5" fill="#F6B6CE" fillOpacity="0.65" />
    <ellipse cx="145" cy="107" rx="8.5" ry="4.5" fill="#F6B6CE" fillOpacity="0.65" />
    <polygon points="106,104 114,104 110,109" fill="#F18CAF" />
    <path d="M102 112 Q106 116 110 111 Q114 116 118 112" fill="none" stroke="#75476F" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export const ChibiPrincessGreeting: React.FC<{ className?: string }> = ({ className = 'w-28 h-28' }) => (
  <svg viewBox="0 0 140 150" className={className} aria-hidden="true">
    <path d="M36 56 C30 92, 34 112, 48 118 L92 118 C106 112, 110 92, 104 56 C98 28, 42 28, 36 56 Z" fill="#46253A" />
    <path d="M46 106 L94 106 L106 142 L34 142 Z" fill="#F6B6CE" stroke="#E8C98C" strokeWidth="2" />
    <circle cx="70" cy="64" r="26" fill="#FDE6DA" />
    <ellipse cx="55" cy="70" rx="5" ry="3" fill="#F18CAF" fillOpacity="0.45" />
    <ellipse cx="85" cy="70" rx="5" ry="3" fill="#F18CAF" fillOpacity="0.45" />
    <circle cx="60" cy="63" r="3.4" fill="#3B2138" />
    <circle cx="80" cy="63" r="3.4" fill="#3B2138" />
    <circle cx="59" cy="61.8" r="1.2" fill="#FFF" />
    <circle cx="79" cy="61.8" r="1.2" fill="#FFF" />
    <path d="M65 74 Q70 78 75 74" fill="none" stroke="#F18CAF" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M44 54 Q56 40 70 48 Q84 40 96 54 Q84 36 70 36 Q56 36 44 54 Z" fill="#46253A" />
    <path d="M54 34 L58 22 L66 29 L70 18 L74 29 L82 22 L86 34 Z" fill="#E8C98C" stroke="#B5893D" strokeWidth="1.4" />
  </svg>
);

export const PrincessLakeSilhouetteSVG: React.FC<{ className?: string }> = ({ className = 'w-44 h-44' }) => (
  <svg viewBox="0 0 180 180" className={className} aria-hidden="true">
    {/* Billowing Pink Ballgown from behind */}
    <path d="M72 86 C48 118, 22 155, 28 170 C62 178, 118 178, 152 170 C158 155, 132 118, 108 86 Z" fill="#F6B6CE" stroke="#E8C98C" strokeWidth="2" />
    <path d="M76 64 L104 64 L108 88 L72 88 Z" fill="#F18CAF" />
    {/* Long flowing hair */}
    <path d="M72 34 C66 56, 68 82, 82 92 L98 92 C112 82, 114 56, 108 34 C102 22, 78 22, 72 34 Z" fill="#3B2138" />
    {/* Tiara */}
    <path d="M78 24 L82 14 L87 20 L90 12 L93 20 L98 14 L102 24 Z" fill="#E8C98C" />
  </svg>
);
