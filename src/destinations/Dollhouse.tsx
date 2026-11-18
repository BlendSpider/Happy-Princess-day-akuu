import React from 'react';
import { Sparkles, Lamp, Coffee, BedDouble, Flower2, Armchair } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DestinationFrame } from '../components/ui/RoyalUI';
import { PrincessAvatar } from '../components/PrincessAvatar';
import { soundEngine } from '../audio/soundEngine';

const ROOMS = [
  { id: 'bedroom', label: 'Princess Bedroom' },
  { id: 'tea-parlour', label: 'Tea Parlour' },
  { id: 'vanity-suite', label: 'Vanity Suite' },
  { id: 'conservatory', label: 'Sunlit Conservatory' },
] as const;

const WALLPAPERS: Record<string, { label: string; bg: string }> = {
  'rosewater-stripe': { label: 'Rosewater Silk', bg: 'linear-gradient(135deg, #FFF9F7 0%, #F9DCE7 100%)' },
  'pearl-damask': { label: 'Pearl Cream', bg: 'linear-gradient(135deg, #FFF9F7 0%, #F5E6D3 100%)' },
  'lavender-silk': { label: 'Lavender Dream', bg: 'linear-gradient(135deg, #F7F2FF 0%, #DCCCFB 100%)' },
  'sky-garden': { label: 'Sky Blue Mist', bg: 'linear-gradient(135deg, #F4FAFF 0%, #CDE9FA 100%)' },
};

const FURNITURE_CATALOG = [
  { id: 'canopy-bed', label: 'Canopy Bed', icon: BedDouble },
  { id: 'pearl-lamp', label: 'Pearl Lamp', icon: Lamp },
  { id: 'tea-cart', label: 'Tea Cart', icon: Coffee },
  { id: 'rose-vase', label: 'Rose Vase', icon: Flower2 },
  { id: 'velvet-pouf', label: 'Velvet Pouf', icon: Armchair },
];

export const Dollhouse: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { db, updateProgress } = useKingdom();

  if (!db) return null;
  const { dollhouse, avatar } = db.progress;
  const room = dollhouse.activeRoom;
  const wallKey = dollhouse.wallpapers[room] || 'rosewater-stripe';
  const curtainsOpen = dollhouse.curtainsOpen[room] ?? true;
  const roomItems = dollhouse.placedItems.filter((i) => i.room === room);

  const switchRoom = (next: (typeof ROOMS)[number]['id']) => {
    soundEngine.playSfx('footstep');
    void updateProgress({ dollhouse: { ...dollhouse, activeRoom: next } });
  };

  const setWallpaper = (key: string) => {
    soundEngine.playSfx('sparkle');
    void updateProgress({
      dollhouse: { ...dollhouse, wallpapers: { ...dollhouse.wallpapers, [room]: key } },
    });
  };

  const toggleCurtains = () => {
    soundEngine.playSfx('paper');
    void updateProgress({
      dollhouse: {
        ...dollhouse,
        curtainsOpen: { ...dollhouse.curtainsOpen, [room]: !curtainsOpen },
      },
    });
  };

  const addFurniture = (itemId: string) => {
    soundEngine.playSfx('pop');
    const newItem = {
      id: `item-${Date.now()}`,
      room,
      itemId,
      x: 20 + ((roomItems.length * 17) % 60),
      y: 55 + ((roomItems.length * 9) % 24),
    };
    void updateProgress({
      dollhouse: { ...dollhouse, placedItems: [...dollhouse.placedItems, newItem] },
    });
  };

  const removeFurniture = (id: string) => {
    soundEngine.playSfx('pop');
    void updateProgress({
      dollhouse: {
        ...dollhouse,
        placedItems: dollhouse.placedItems.filter((i) => i.id !== id),
      },
    });
  };

  return (
    <DestinationFrame
      title="Kawaii Royal Dollhouse"
      subtitle="Walk between 4 suites, draw velvet curtains & arrange miniature furniture"
      chapterNumber={15}
      onBack={onBack}
    >
      {/* Room Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ROOMS.map((r) => (
          <button
            key={r.id}
            onClick={() => switchRoom(r.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
              room === r.id
                ? 'bg-[#75476F] text-white'
                : 'bg-[#F9DCE7]/70 text-[#75476F] hover:bg-[#F6B6CE]/60'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Dollhouse Room Stage */}
        <div
          className="lg:col-span-8 relative rounded-3xl border-2 border-[#E8C98C] min-h-[430px] overflow-hidden shadow-lg flex flex-col justify-between"
          style={{ background: WALLPAPERS[wallKey]?.bg || WALLPAPERS['rosewater-stripe'].bg }}
        >
          {/* Animated Window & Curtains */}
          <div className="relative flex justify-center pt-8">
            <div className="relative w-56 h-36 rounded-t-full border-4 border-[#E8C98C] bg-gradient-to-b from-[#CDE9FA] to-[#FFF9F7] overflow-hidden shadow-inner flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#E8C98C] animate-twinkle" />
              {/* Left & Right Animated Curtains */}
              <div
                className="absolute inset-y-0 left-0 bg-[#F18CAF]/85 border-r border-[#E8C98C] transition-all duration-500"
                style={{ width: curtainsOpen ? '18%' : '50%' }}
              />
              <div
                className="absolute inset-y-0 right-0 bg-[#F18CAF]/85 border-l border-[#E8C98C] transition-all duration-500"
                style={{ width: curtainsOpen ? '18%' : '50%' }}
              />
            </div>
          </div>

          {/* Placed Furniture Items */}
          {roomItems.map((item) => {
            const meta = FURNITURE_CATALOG.find((f) => f.id === item.itemId);
            const Icon = meta?.icon || Lamp;
            return (
              <button
                key={item.id}
                onClick={() => removeFurniture(item.id)}
                title="Click to pack away"
                className="absolute px-3 py-2 rounded-2xl bg-[#FFF9F7]/92 border border-[#E8C98C] shadow-md flex items-center gap-1.5 text-xs font-medium text-[#3B2138] hover:bg-[#F9DCE7] transition-all cursor-pointer"
                style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <Icon className="w-4 h-4 text-[#75476F]" />
                <span>{meta?.label}</span>
              </button>
            );
          })}

          {/* Wood Floor + Princess Avatar */}
          <div className="relative h-28 bg-gradient-to-b from-[#F5E0C8] to-[#E9C9A9] border-t border-[#E8C98C] flex items-end justify-center pb-3">
            <div className="-mt-24">
              <PrincessAvatar avatar={avatar} size={115} />
            </div>
          </div>
        </div>

        {/* Customization Sidebar */}
        <div className="lg:col-span-4 space-y-5">
          <div className="royal-card rounded-2xl p-5">
            <h3 className="font-romantic text-lg font-semibold text-[#3B2138] mb-3">Wallpaper & Curtains</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.entries(WALLPAPERS).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setWallpaper(k)}
                  className={`p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                    wallKey === k ? 'border-[#75476F] ring-1 ring-[#75476F]' : 'border-[#E8C98C]/40'
                  }`}
                  style={{ background: v.bg }}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <button
              onClick={toggleCurtains}
              className="w-full py-2 rounded-xl bg-[#F9DCE7] text-[#75476F] text-xs font-semibold hover:bg-[#F6B6CE]/70 transition-colors cursor-pointer"
            >
              {curtainsOpen ? 'Draw Velvet Curtains Closed' : 'Open Velvet Curtains'}
            </button>
          </div>

          <div className="royal-card rounded-2xl p-5">
            <h3 className="font-romantic text-lg font-semibold text-[#3B2138] mb-1">Place Furniture</h3>
            <p className="text-xs text-[#75476F]/80 mb-3">Tap an item to place it; tap placed items in the room to pack away.</p>
            <div className="grid grid-cols-2 gap-2">
              {FURNITURE_CATALOG.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => addFurniture(item.id)}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E8C98C]/45 bg-white hover:bg-[#FFF9F7] text-xs font-medium text-[#3B2138] cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-[#75476F]" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DestinationFrame>
  );
};
