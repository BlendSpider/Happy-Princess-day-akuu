import React from 'react';
import { CrownCrestIcon } from './RoyalIcons';

export const RoyalLoader: React.FC<{ message?: string }> = ({
  message = 'Preparing Princess Akuu’s Kingdom...',
}) => (
  <div className="min-h-screen bg-gradient-to-b from-[#FFF9F7] via-[#F9DCE7]/60 to-[#DCCCFB]/40 flex flex-col items-center justify-center gap-4 px-6 text-center">
    <div className="relative w-20 h-20 rounded-full bg-[#FFF9F7] border-2 border-[#E8C98C] shadow-lg flex items-center justify-center animate-float-slow">
      <CrownCrestIcon className="w-11 h-11" />
    </div>
    <p className="font-royal text-2xl italic text-[#75476F]">{message}</p>
  </div>
);
