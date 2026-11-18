import React, { useEffect, useState } from 'react';
import { Lock, Unlock, Maximize2, X, Play, Pause, Volume2, Clock, Sparkles } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DestinationFrame, ResilientImage, RoyalButton } from '../components/ui/RoyalUI';
import { SatinBow } from '../assets/royal/RoyalOrnaments';
import type { PhotoMemory } from '../types/kingdom';
import { soundEngine } from '../audio/soundEngine';

type MuseumRoom = 'gallery' | 'videos' | 'hidden' | 'timeline';

export const MemoryMuseum: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { db, grantReward } = useKingdom();
  const [room, setRoom] = useState<MuseumRoom>('gallery');
  const [albumFilter, setAlbumFilter] = useState<string>('all');
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoMemory | null>(null);
  const [hiddenOpened, setHiddenOpened] = useState(false);

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [vPlaying, setVPlaying] = useState(false);
  const [vProgress, setVProgress] = useState(0);

  useEffect(() => {
    void grantReward({ achievementId: 'museum-patron' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!db) return null;
  const visiblePhotos = db.photos.filter((p) => p.visible);
  const galleryPhotos = visiblePhotos.filter((p) => !p.isHiddenBox && (albumFilter === 'all' || p.albumId === albumFilter));
  const hiddenMemory = visiblePhotos.find((p) => p.isHiddenBox) || visiblePhotos[0];
  const visibleVideos = db.videos.filter((v) => v.visible);

  const toggleVideoPlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setVPlaying(true);
    } else {
      v.pause();
      setVPlaying(false);
    }
  };

  return (
    <DestinationFrame
      title="The Memory Museum"
      subtitle="Four curated exhibition rooms preserving our favourite chapters"
      chapterNumber={4}
      onBack={onBack}
    >
      {/* Exhibition Room Selector */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-[#E8C98C]/35 pb-4">
        {[
          { id: 'gallery', label: 'Room I · Photo Gallery' },
          { id: 'videos', label: 'Room II · Video Memories' },
          { id: 'hidden', label: 'Room III · Hidden Memories' },
          { id: 'timeline', label: 'Room IV · Memory Timeline' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundEngine.playSfx('paper');
              setRoom(tab.id as MuseumRoom);
            }}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium cursor-pointer transition-colors ${
              room === tab.id
                ? 'bg-[#75476F] text-white shadow-sm'
                : 'bg-[#F9DCE7]/60 text-[#75476F] hover:bg-[#F6B6CE]/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ROOM 1: OPEN SCRAPBOOK PHOTO GALLERY */}
      {room === 'gallery' && (
        <div className="rounded-3xl border-2 border-[#E8C98C] bg-gradient-to-br from-[#FFF9F7] via-[#FCEEF3] to-[#FFF5E8] p-6 sm:p-10 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-7 pb-4 border-b border-[#E8C98C]/40">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#75476F]/75">Royal Scrapbook Album</div>
              <h2 className="font-handwritten text-3xl sm:text-4xl text-[#3B2138]">Our Beautiful Memories ♡</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setAlbumFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer ${
                  albumFilter === 'all' ? 'bg-[#75476F] text-white' : 'bg-white border border-[#E8C98C]/50 text-[#75476F]'
                }`}
              >
                All Albums
              </button>
              {db.albums.map((alb) => (
                <button
                  key={alb.id}
                  onClick={() => setAlbumFilter(alb.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer ${
                    albumFilter === alb.id ? 'bg-[#75476F] text-white' : 'bg-white border border-[#E8C98C]/50 text-[#75476F]'
                  }`}
                >
                  {alb.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {galleryPhotos.map((photo, idx) => (
              <div
                key={photo.id}
                className={`relative bg-white p-4 pb-6 rounded-2xl border-2 border-[#E8C98C]/65 shadow-md transition-transform duration-300 hover:-translate-y-1 ${
                  idx % 2 === 0 ? '-rotate-[0.9deg]' : 'rotate-[0.9deg]'
                } hover:rotate-0`}
              >
                <SatinBow className="w-8 h-6 absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none" />
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F9DCE7]/40 group">
                  <ResilientImage src={photo.url} alt={photo.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <button
                    onClick={() => {
                      soundEngine.playSfx('glass');
                      setLightboxPhoto(photo);
                    }}
                    aria-label={`Zoom ${photo.title}`}
                    className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-[#3B2138] flex items-center justify-center shadow hover:bg-white cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-4 px-1">
                  <div className="text-[11px] uppercase tracking-wider text-[#75476F]/75">{photo.date}</div>
                  <h3 className="font-romantic text-xl font-semibold text-[#3B2138] mt-0.5">{photo.title}</h3>
                  <p className="font-handwritten text-xl text-[#5A3256] mt-1 leading-snug">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ROOM 2: VIDEO MEMORIES */}
      {room === 'videos' && (
        <div className="space-y-6">
          {visibleVideos.map((vid) => (
            <div key={vid.id} className="royal-card rounded-3xl overflow-hidden border border-[#E8C98C]/60">
              <div className="bg-[#1D1022] aspect-video max-h-[460px] w-full relative flex items-center justify-center">
                {vid.url ? (
                  <video
                    ref={videoRef}
                    src={vid.url}
                    poster={vid.thumbnailUrl}
                    onTimeUpdate={(e) => {
                      const el = e.currentTarget;
                      if (el.duration) setVProgress((el.currentTime / el.duration) * 100);
                    }}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <ResilientImage src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover opacity-70" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/35 text-[#FFF9F7]">
                      <Sparkles className="w-8 h-8 text-[#E8C98C] mb-2" />
                      <div className="font-royal text-2xl">{vid.title}</div>
                      <p className="text-xs text-[#F9DCE7] max-w-md mt-1">{vid.caption}</p>
                    </div>
                  </div>
                )}
              </div>
              {vid.url && (
                <div className="px-5 py-3 bg-[#FFF9F7] flex items-center gap-4 border-t border-[#E8C98C]/35">
                  <button onClick={toggleVideoPlay} className="w-9 h-9 rounded-full bg-[#75476F] text-white flex items-center justify-center cursor-pointer">
                    {vPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <div className="flex-1 h-2 rounded-full bg-[#F9DCE7] overflow-hidden">
                    <div className="h-full bg-[#75476F]" style={{ width: `${vProgress}%` }} />
                  </div>
                  <Volume2 className="w-4 h-4 text-[#75476F]" />
                </div>
              )}
              <div className="p-6">
                <div className="text-xs text-[#75476F]/75">{vid.date} · {vid.durationLabel}</div>
                <h3 className="font-romantic text-2xl font-semibold text-[#3B2138] mt-1">{vid.title}</h3>
                <p className="text-sm text-[#75476F] mt-1">{vid.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ROOM 3: HIDDEN MEMORIES */}
      {room === 'hidden' && hiddenMemory && (
        <div className="max-w-2xl mx-auto text-center royal-card rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-[#FFF9F7] to-[#F9DCE7]/50">
          {!hiddenOpened ? (
            <div>
              <div className="w-20 h-20 rounded-full bg-[#75476F] text-[#E8C98C] mx-auto flex items-center justify-center shadow-lg mb-5 animate-float-slow">
                <Lock className="w-9 h-9" />
              </div>
              <h2 className="font-royal text-3xl font-semibold text-[#3B2138]">The Velvet Memory Box</h2>
              <p className="text-sm text-[#75476F] mt-2 max-w-md mx-auto">
                Click to unseal the hidden memory preserved inside this exhibition vault.
              </p>
              <div className="mt-6">
                <RoyalButton
                  variant="gold"
                  size="lg"
                  onClick={() => {
                    soundEngine.playSfx('chest');
                    setHiddenOpened(true);
                  }}
                >
                  <Unlock className="w-4 h-4" />
                  Unlock Hidden Memory
                </RoyalButton>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-widest text-[#75476F]">{hiddenMemory.date}</div>
              <h2 className="font-royal text-3xl font-semibold text-[#3B2138]">{hiddenMemory.title}</h2>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#E8C98C] shadow-md">
                <ResilientImage src={hiddenMemory.url} alt={hiddenMemory.title} className="w-full h-full object-cover" />
              </div>
              <p className="font-handwritten text-2xl text-[#5A3256]">{hiddenMemory.caption}</p>
            </div>
          )}
        </div>
      )}

      {/* ROOM 4: MEMORY TIMELINE */}
      {room === 'timeline' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {visiblePhotos.map((item, idx) => (
            <div key={item.id} className="royal-card rounded-3xl p-6 flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-full sm:w-52 aspect-[4/3] rounded-2xl overflow-hidden shrink-0 border border-[#E8C98C]/50">
                <ResilientImage src={item.url} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs text-[#75476F]/80 mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#E8C98C]" />
                  <span>0{idx + 1}. {item.date}</span>
                </div>
                <h3 className="font-romantic text-2xl font-semibold text-[#3B2138]">{item.title}</h3>
                <p className="text-sm text-[#75476F] mt-1.5 leading-relaxed">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-[#1B0F21]/90 flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="max-w-4xl w-full bg-[#FFF9F7] rounded-3xl overflow-hidden border-2 border-[#E8C98C] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8C98C]/35">
              <div>
                <div className="text-xs text-[#75476F]">{lightboxPhoto.date}</div>
                <h3 className="font-romantic text-xl font-semibold text-[#3B2138]">{lightboxPhoto.title}</h3>
              </div>
              <button
                onClick={() => setLightboxPhoto(null)}
                aria-label="Close lightbox"
                className="w-9 h-9 rounded-full bg-[#F9DCE7] text-[#3B2138] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-[#1B0F21] max-h-[65vh] flex items-center justify-center overflow-hidden">
              <ResilientImage src={lightboxPhoto.url} alt={lightboxPhoto.title} className="max-h-[65vh] w-auto object-contain" />
            </div>
            <p className="px-6 py-4 font-handwritten text-2xl text-[#5A3256]">{lightboxPhoto.caption}</p>
          </div>
        </div>
      )}
    </DestinationFrame>
  );
};
