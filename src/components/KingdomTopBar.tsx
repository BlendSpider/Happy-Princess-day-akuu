import React from 'react';
import { useKingdom } from '../context/KingdomContext';
import { RoyalButton } from './ui/RoyalUI';

export const KingdomTopBar: React.FC = () => {
  const { navigateTo, activeDestination, setShowAdminModal } = useKingdom();

  return (
    <header className="sticky top-0 z-30 bg-[#FFF9F7]/92 border-b border-[#E8C98C]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line brand wordmark */}
        <button
          onClick={() => navigateTo('hub')}
          className="font-royal text-xl sm:text-2xl font-semibold text-[#3B2138] hover:text-[#75476F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Akuu’s Princess World
        </button>

        {/* Zone 2: 5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#75476F]">
          {[
            { id: 'royal-palace', label: 'Palace' },
            { id: 'memory-museum', label: 'Museum' },
            { id: 'princess-arcade', label: 'Arcade' },
            { id: 'princess-diary', label: 'Diary' },
            { id: 'grand-finale', label: 'Finale' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id as Parameters<typeof navigateTo>[0])}
              className={`whitespace-nowrap shrink-0 pb-0.5 border-b transition-colors cursor-pointer ${
                activeDestination === item.id
                  ? 'border-[#75476F] text-[#3B2138] font-semibold'
                  : 'border-transparent hover:border-[#E8C98C] hover:text-[#3B2138]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="shrink-0">
          <RoyalButton variant="secondary" size="sm" onClick={() => setShowAdminModal(true)}>
            Control Room
          </RoyalButton>
        </div>
      </div>
    </header>
  );
};
