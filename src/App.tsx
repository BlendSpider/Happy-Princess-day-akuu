import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { KingdomProvider, useKingdom } from './context/KingdomContext';
import { OpeningSequence } from './components/OpeningSequence';
import { KingdomTopBar } from './components/KingdomTopBar';
import { KingdomHub } from './components/KingdomHub';
import { FloatingMusicBar } from './components/FloatingMusicBar';
import { CursorMagicTrail } from './components/CursorMagicTrail';
import { AdminControlRoom } from './components/AdminControlRoom';

import { RoyalPalace } from './destinations/RoyalPalace';
import { DressingRoom } from './destinations/DressingRoom';
import { MagicalGarden } from './destinations/MagicalGarden';
import { MemoryMuseum } from './destinations/MemoryMuseum';
import { VideoTheatre } from './destinations/VideoTheatre';
import { LoveLibrary } from './destinations/LoveLibrary';
import { PrincessArcade } from './destinations/PrincessArcade';
import { KittyKingdom } from './destinations/KittyKingdom';
import { MusicRoom } from './destinations/MusicRoom';
import { RoyalBakery } from './destinations/RoyalBakery';
import { MagicalCafe } from './destinations/MagicalCafe';
import { StarObservatory } from './destinations/StarObservatory';
import { FairyForest } from './destinations/FairyForest';
import { TreasureVault } from './destinations/TreasureVault';
import { Dollhouse } from './destinations/Dollhouse';
import { RoyalSpa } from './destinations/RoyalSpa';
import { FashionStudio } from './destinations/FashionStudio';
import { ArtStudio } from './destinations/ArtStudio';
import { LoveGarden } from './destinations/LoveGarden';
import { RoyalMailbox } from './destinations/RoyalMailbox';
import { DreamCloudWorld } from './destinations/DreamCloudWorld';
import { PrincessDiary } from './destinations/PrincessDiary';
import { AchievementHall } from './destinations/AchievementHall';
import { GrandFinale } from './destinations/GrandFinale';
import { RoyalLoader } from './assets/royal/RoyalLoader';

const KingdomViewport: React.FC<{ showOpening: boolean; onCloseOpening: () => void }> = ({
  showOpening,
  onCloseOpening,
}) => {
  const { loading, activeDestination, navigateTo, toastMessage } = useKingdom();

  if (loading) {
    return <RoyalLoader />;
  }

  const goHub = () => navigateTo('hub');

  const renderDestination = () => {
    switch (activeDestination) {
      case 'royal-palace': return <RoyalPalace onBack={goHub} />;
      case 'dressing-room': return <DressingRoom onBack={goHub} />;
      case 'magical-garden': return <MagicalGarden onBack={goHub} />;
      case 'memory-museum': return <MemoryMuseum onBack={goHub} />;
      case 'video-theatre': return <VideoTheatre onBack={goHub} />;
      case 'love-library': return <LoveLibrary onBack={goHub} />;
      case 'princess-arcade': return <PrincessArcade onBack={goHub} />;
      case 'kitty-kingdom': return <KittyKingdom onBack={goHub} />;
      case 'music-room': return <MusicRoom onBack={goHub} />;
      case 'royal-bakery': return <RoyalBakery onBack={goHub} />;
      case 'magical-cafe': return <MagicalCafe onBack={goHub} />;
      case 'star-observatory': return <StarObservatory onBack={goHub} />;
      case 'fairy-forest': return <FairyForest onBack={goHub} />;
      case 'treasure-vault': return <TreasureVault onBack={goHub} />;
      case 'dollhouse': return <Dollhouse onBack={goHub} />;
      case 'royal-spa': return <RoyalSpa onBack={goHub} />;
      case 'fashion-studio': return <FashionStudio onBack={goHub} />;
      case 'art-studio': return <ArtStudio onBack={goHub} />;
      case 'love-garden': return <LoveGarden onBack={goHub} />;
      case 'royal-mailbox': return <RoyalMailbox onBack={goHub} />;
      case 'dream-cloud': return <DreamCloudWorld onBack={goHub} />;
      case 'princess-diary': return <PrincessDiary onBack={goHub} />;
      case 'achievement-hall': return <AchievementHall onBack={goHub} />;
      case 'grand-finale': return <GrandFinale onBack={goHub} />;
      default: return <KingdomHub />;
    }
  };

  return (
    <>
      <CursorMagicTrail />
      {showOpening ? (
        <OpeningSequence onComplete={onCloseOpening} />
      ) : (
        <div className="min-h-screen flex flex-col">
          <KingdomTopBar />
          <main className="flex-1">{renderDestination()}</main>
          <FloatingMusicBar />
        </div>
      )}

      <AdminControlRoom />

      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-[#3B2138] text-[#FFF9F7] border border-[#E8C98C] shadow-xl text-xs sm:text-sm font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#E8C98C] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};

export default function App() {
  const [showOpening, setShowOpening] = useState(true);

  return (
    <KingdomProvider onReplayOpening={() => setShowOpening(true)}>
      <KingdomViewport
        showOpening={showOpening}
        onCloseOpening={() => setShowOpening(false)}
      />
    </KingdomProvider>
  );
}
