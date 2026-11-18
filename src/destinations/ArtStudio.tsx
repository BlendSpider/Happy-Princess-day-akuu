import React, { useEffect, useRef, useState } from 'react';
import { Brush, Download, Eraser, Sparkles, Trash2 } from 'lucide-react';
import { DestinationFrame, RoyalButton } from '../components/ui/RoyalUI';
import { soundEngine } from '../audio/soundEngine';

const PALETTE = ['#75476F', '#F18CAF', '#F6B6CE', '#E8C98C', '#DCCCFB', '#8BBCE0', '#3B2138', '#FFF9F7'];

export const ArtStudio: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState('#F18CAF');
  const [brushSize, setBrushSize] = useState(8);
  const [tool, setTool] = useState<'brush' | 'glitter' | 'heart' | 'eraser'>('brush');
  const drawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFF9F7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const paintAt = (x: number, y: number) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    if (tool === 'heart') {
      ctx.save();
      ctx.fillStyle = color;
      ctx.font = `${brushSize * 3 + 12}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('♡', x, y);
      ctx.restore();
      return;
    }

    if (tool === 'glitter') {
      for (let i = 0; i < 8; i++) {
        const ox = (Math.random() - 0.5) * brushSize * 3.5;
        const oy = (Math.random() - 0.5) * brushSize * 3.5;
        ctx.fillStyle = i % 2 === 0 ? color : '#E8C98C';
        ctx.beginPath();
        ctx.arc(x + ox, y + oy, 1.5 + Math.random() * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }

    ctx.fillStyle = tool === 'eraser' ? '#FFF9F7' : color;
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearCanvas = () => {
    soundEngine.playSfx('paper');
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#FFF9F7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveArtwork = () => {
    soundEngine.playSfx('sparkle');
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = 'princess-akuu-artwork.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  return (
    <DestinationFrame
      title="The Royal Art Studio"
      subtitle="Paint with pastel palettes, glitter brushes & heart stamps"
      chapterNumber={18}
      onBack={onBack}
      rightSlot={
        <div className="flex gap-2">
          <RoyalButton variant="secondary" size="sm" onClick={clearCanvas}>
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </RoyalButton>
          <RoyalButton variant="gold" size="sm" onClick={saveArtwork}>
            <Download className="w-3.5 h-3.5" />
            Save Art
          </RoyalButton>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-3 royal-card rounded-3xl p-5 space-y-5">
          <div>
            <div className="text-xs font-semibold text-[#75476F] mb-2">Tools</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'brush', label: 'Brush', icon: Brush },
                { id: 'glitter', label: 'Glitter', icon: Sparkles },
                { id: 'heart', label: 'Heart Stamp', icon: Sparkles },
                { id: 'eraser', label: 'Eraser', icon: Eraser },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTool(t.id as typeof tool)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer ${
                      tool === t.id ? 'bg-[#75476F] text-white' : 'bg-[#F9DCE7]/60 text-[#75476F]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-[#75476F] mb-2">Palette</div>
            <div className="flex flex-wrap gap-2">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  aria-label={`Color ${c}`}
                  className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
                    color === c ? 'border-[#3B2138] scale-110' : 'border-[#E8C98C]/50'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-[#75476F] mb-1">Brush Size ({brushSize}px)</div>
            <input
              type="range"
              min={3}
              max={28}
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full accent-[#75476F]"
            />
          </div>
        </div>

        <div className="lg:col-span-9 royal-card rounded-3xl p-4 bg-white">
          <canvas
            ref={canvasRef}
            width={900}
            height={520}
            onPointerDown={(e) => {
              drawingRef.current = true;
              const { x, y } = getCoords(e);
              paintAt(x, y);
            }}
            onPointerMove={(e) => {
              if (!drawingRef.current) return;
              const { x, y } = getCoords(e);
              paintAt(x, y);
            }}
            onPointerUp={() => {
              drawingRef.current = false;
            }}
            onPointerLeave={() => {
              drawingRef.current = false;
            }}
            className="w-full h-auto rounded-2xl border border-[#E8C98C]/50 touch-none cursor-crosshair"
          />
        </div>
      </div>
    </DestinationFrame>
  );
};
