import React, { useEffect, useState } from 'react';
import { Music, Pause, Play, SkipForward, Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import { useKingdom } from '../context/KingdomContext';

export const FloatingMusicBar: React.FC = () => {
  const { db, navigateTo } = useKingdom();
  const [state, setState] = useState(soundEngine.getState());
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    return soundEngine.subscribe(() => setState(soundEngine.getState()));
  }, []);

  const tracks = db?.audioTracks || [];
  const activeTrack = state.currentTrack || tracks[0];

  const handleNext = () => {
    if (!tracks.length) return;
    const idx = tracks.findIndex((t) => t.id === activeTrack?.id);
    const next = tracks[(idx + 1) % tracks.length];
    soundEngine.playTrack(next);
  };

  if (!activeTrack) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-[calc(100vw-2rem)]">
      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          aria-label="Expand Music Player"
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FFF9F7]/95 border border-[#E8C98C]/60 shadow-lg text-xs font-medium text-[#75476F] hover:bg-[#F9DCE7] transition-colors cursor-pointer"
        >
          <Music className="w-4 h-4 text-[#F18CAF]" />
          <span className="truncate max-w-[130px]">{state.isPlaying ? activeTrack.title : 'Music'}</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      ) : (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#FFF9F7]/95 border border-[#E8C98C]/60 shadow-lg text-[#3B2138]">
          <button
            onClick={() => navigateTo('music-room')}
            className="flex items-center gap-2 text-left min-w-0 cursor-pointer group"
            title="Open Music Room"
          >
            <div className="w-8 h-8 rounded-full bg-[#F9DCE7] border border-[#E8C98C]/60 flex items-center justify-center shrink-0">
              <Music className="w-4 h-4 text-[#75476F]" />
            </div>
            <div className="min-w-0 max-w-[140px]">
              <div className="text-xs font-semibold truncate group-hover:text-[#75476F]">{activeTrack.title}</div>
              <div className="text-[11px] text-[#75476F]/75 truncate">{activeTrack.artist}</div>
            </div>
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => soundEngine.togglePlay(activeTrack)}
              aria-label={state.isPlaying ? 'Pause music' : 'Play music'}
              className="w-8 h-8 rounded-full bg-[#75476F] text-[#FFF9F7] flex items-center justify-center hover:bg-[#5E3659] transition-colors cursor-pointer"
            >
              {state.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
            <button
              onClick={handleNext}
              aria-label="Next track"
              className="w-8 h-8 rounded-full bg-[#F9DCE7]/70 text-[#75476F] flex items-center justify-center hover:bg-[#F6B6CE] transition-colors cursor-pointer"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => soundEngine.setMuted(!state.muted)}
              aria-label={state.muted ? 'Unmute' : 'Mute'}
              className="w-8 h-8 rounded-full bg-[#F9DCE7]/70 text-[#75476F] flex items-center justify-center hover:bg-[#F6B6CE] transition-colors cursor-pointer"
            >
              {state.muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setMinimized(true)}
              aria-label="Minimize music player"
              className="w-7 h-7 rounded-full text-[#75476F]/70 flex items-center justify-center hover:bg-[#F9DCE7]/60 cursor-pointer"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
