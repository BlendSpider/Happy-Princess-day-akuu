import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Film } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DestinationFrame, ResilientImage } from '../components/ui/RoyalUI';

export const VideoTheatre: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { db } = useKingdom();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  if (!db) return null;
  const videos = db.videos.filter((v) => v.visible);
  const active = videos[selectedIdx] || videos[0];

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const pct = Number(e.target.value);
    v.currentTime = (pct / 100) * v.duration;
    setProgress(pct);
  };

  const handleFullscreen = () => {
    if (stageRef.current?.requestFullscreen) {
      void stageRef.current.requestFullscreen();
    }
  };

  return (
    <DestinationFrame
      title="The Royal Video Theatre"
      subtitle="Velvet screening hall for personal video surprises & cinematic tributes"
      chapterNumber={5}
      onBack={onBack}
    >
      {active && (
        <div className="space-y-6">
          <div ref={stageRef} className="rounded-3xl overflow-hidden border-2 border-[#E8C98C] bg-[#160B1A] shadow-2xl">
            {/* Letterbox Cinema Stage */}
            <div className="aspect-video w-full relative flex items-center justify-center bg-black">
              {active.url ? (
                <video
                  ref={videoRef}
                  src={active.url}
                  poster={active.thumbnailUrl}
                  onTimeUpdate={(e) => {
                    const el = e.currentTarget;
                    if (el.duration) setProgress((el.currentTime / el.duration) * 100);
                  }}
                  onEnded={() => setPlaying(false)}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="relative w-full h-full">
                  <ResilientImage src={active.thumbnailUrl} alt={active.title} className="w-full h-full object-cover opacity-65" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50 flex flex-col items-center justify-center text-center px-6 text-[#FFF9F7]">
                    <Film className="w-10 h-10 text-[#E8C98C] mb-3" />
                    <h2 className="font-royal text-3xl sm:text-4xl">{active.title}</h2>
                    <p className="text-sm text-[#F9DCE7] max-w-lg mt-2">{active.caption}</p>
                    <p className="text-xs text-[#E8C98C] mt-4">
                      Upload any personal MP4 / WebM video in Tarun’s Control Room to screen it here.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Theatre Controls */}
            <div className="px-5 py-3.5 bg-[#241229] text-[#FFF9F7] flex flex-wrap items-center gap-4">
              <button
                onClick={togglePlay}
                disabled={!active.url}
                aria-label={playing ? 'Pause video' : 'Play video'}
                className="w-9 h-9 rounded-full bg-[#E8C98C] text-[#3B2138] flex items-center justify-center disabled:opacity-40 cursor-pointer"
              >
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={handleSeek}
                disabled={!active.url}
                aria-label="Video progress"
                className="flex-1 accent-[#F6B6CE] cursor-pointer"
              />
              <button onClick={toggleMute} aria-label="Toggle mute" className="text-[#F9DCE7] hover:text-white cursor-pointer">
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button onClick={handleFullscreen} aria-label="Fullscreen" className="text-[#F9DCE7] hover:text-white cursor-pointer">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Thumbnail Reel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {videos.map((v, idx) => (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedIdx(idx);
                  setPlaying(false);
                  setProgress(0);
                }}
                className={`text-left royal-card rounded-2xl overflow-hidden border transition-all cursor-pointer ${
                  idx === selectedIdx ? 'border-[#75476F] ring-1 ring-[#75476F]' : 'border-[#E8C98C]/45'
                }`}
              >
                <div className="aspect-video bg-[#1D1022]">
                  <ResilientImage src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-3.5">
                  <div className="text-xs text-[#75476F]/75">{v.date} · {v.durationLabel}</div>
                  <div className="font-romantic font-semibold text-sm text-[#3B2138] mt-0.5">{v.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </DestinationFrame>
  );
};
