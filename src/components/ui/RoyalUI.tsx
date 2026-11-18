import React, { useState } from 'react';
import { ArrowLeft, Crown, Sparkles, Heart } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';
import { GoldFiligreeCorner, SatinBow } from '../../assets/royal/RoyalOrnaments';

export const RoyalButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'gold' | 'glossy';
    size?: 'sm' | 'md' | 'lg';
  }
> = ({ variant = 'primary', size = 'md', className = '', onClick, children, ...rest }) => {
  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };
  const variants = {
    primary:
      'bg-gradient-to-b from-[#8A5683] to-[#75476F] text-[#FFF9F7] hover:brightness-105 border border-[#E8C98C]/60 shadow-[0_6px_16px_-6px_rgba(117,71,111,0.55)]',
    glossy:
      'bg-gradient-to-b from-[#FFA8C7] via-[#F18CAF] to-[#E36F97] text-[#FFF9F7] hover:brightness-105 border border-[#FFF3D6]/90 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_8px_18px_-6px_rgba(241,140,175,0.65)]',
    secondary:
      'bg-gradient-to-b from-[#FFF9F7] to-[#F9DCE7] text-[#75476F] hover:to-[#F6B6CE]/70 border border-[#E8C98C]/70 shadow-sm',
    gold:
      'bg-gradient-to-b from-[#F5DEB0] via-[#E8C98C] to-[#D4A95A] text-[#3B2138] hover:brightness-105 border border-[#FFF3D6] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_8px_18px_-6px_rgba(200,158,84,0.5)]',
    ghost: 'bg-transparent text-[#75476F] hover:bg-[#F9DCE7]/60 border border-transparent',
  };

  return (
    <button
      {...rest}
      onClick={(e) => {
        soundEngine.playSfx('pop');
        onClick?.(e);
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap shrink-0 transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75476F] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const GildedFrameCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  showBow?: boolean;
}> = ({ children, className = '', showBow = false }) => (
  <div className={`relative royal-card rounded-3xl border-2 border-[#E8C98C]/75 p-6 ${className}`}>
    <GoldFiligreeCorner className="w-6 h-6 absolute top-2 left-2 pointer-events-none opacity-80" />
    <GoldFiligreeCorner className="w-6 h-6 absolute top-2 right-2 pointer-events-none opacity-80" flipX />
    <GoldFiligreeCorner className="w-6 h-6 absolute bottom-2 left-2 pointer-events-none opacity-80" flipY />
    <GoldFiligreeCorner className="w-6 h-6 absolute bottom-2 right-2 pointer-events-none opacity-80" flipX flipY />
    {showBow && (
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 pointer-events-none">
        <SatinBow className="w-10 h-7" />
      </div>
    )}
    {children}
  </div>
);

export const HeartToggle: React.FC<{
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => {
      soundEngine.playSfx('pop');
      onChange(!checked);
    }}
    className="inline-flex items-center gap-2.5 text-xs font-medium text-[#3B2138] cursor-pointer"
  >
    <span
      className={`w-12 h-6 rounded-full p-0.5 border border-[#E8C98C] transition-colors flex items-center ${
        checked ? 'bg-[#F18CAF] justify-end' : 'bg-[#F9DCE7] justify-start'
      }`}
    >
      <span className="w-5 h-5 rounded-full bg-white shadow flex items-center justify-center">
        <Heart className={`w-3 h-3 ${checked ? 'text-[#F18CAF] fill-[#F18CAF]' : 'text-[#75476F]/40'}`} />
      </span>
    </span>
    <span>{label}</span>
  </button>
);

export const RoyalProgressBar: React.FC<{
  value: number;
  max?: number;
  label: string;
  color?: string;
}> = ({ value, max = 100, label, color = '#F18CAF' }) => {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium text-[#3B2138] mb-1 tabular-nums">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-3 rounded-full bg-[#F9DCE7] border border-[#E8C98C]/60 overflow-hidden p-0.5">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export const DestinationFrame: React.FC<{
  title: string;
  subtitle: string;
  chapterNumber?: number;
  onBack: () => void;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, subtitle, chapterNumber, onBack, rightSlot, children }) => {
  return (
    <div className="min-h-screen bg-[#FFF9F7] pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8C98C]/35">
          <div className="flex items-center gap-4">
            <RoyalButton variant="secondary" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
              Back to Kingdom
            </RoyalButton>
            <div>
              {typeof chapterNumber === 'number' && (
                <div className="text-xs text-[#75476F]/70 font-medium">
                  Chapter {String(chapterNumber).padStart(2, '0')} · Akuu’s Kingdom
                </div>
              )}
              <h1 className="font-royal text-3xl sm:text-4xl font-semibold text-[#3B2138] leading-tight">
                {title}
              </h1>
              <p className="text-sm text-[#75476F]/85 mt-0.5">{subtitle}</p>
            </div>
          </div>
          {rightSlot && <div className="flex items-center gap-3">{rightSlot}</div>}
        </div>
        <div className="pt-8">{children}</div>
      </div>
    </div>
  );
};

export const ResilientImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}> = ({ src, alt, className = '', fallbackLabel }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F9DCE7] via-[#DCCCFB]/40 to-[#FFF9F7] text-[#75476F] p-6 text-center ${className}`}
      >
        <Crown className="w-7 h-7 mb-2 text-[#E8C98C]" />
        <span className="font-romantic text-sm">{fallbackLabel || alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      loading="lazy"
    />
  );
};

export const SparkleDivider: React.FC<{ label?: string }> = ({ label }) => (
  <div className="flex items-center gap-4 my-6">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#E8C98C]/60 to-transparent" />
    {label ? (
      <span className="inline-flex items-center gap-1.5 text-xs font-romantic italic text-[#75476F]/80">
        <Sparkles className="w-3.5 h-3.5 text-[#E8C98C]" />
        {label}
      </span>
    ) : (
      <Sparkles className="w-4 h-4 text-[#E8C98C]" />
    )}
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#E8C98C]/60 to-transparent" />
  </div>
);
