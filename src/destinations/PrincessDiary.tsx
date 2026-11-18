import React, { useState } from 'react';
import { Heart, Search, Bookmark, Sparkles, Feather } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DestinationFrame, GildedFrameCard, RoyalButton } from '../components/ui/RoyalUI';
import { PearlGarland, SatinBow, WaxSealHeart } from '../assets/royal/RoyalOrnaments';
import { soundEngine } from '../audio/soundEngine';

type DiaryTab = 'diary' | 'wishes' | 'memories' | 'write';

const RIBBON_TABS: Array<{ id: DiaryTab; label: string; color: string }> = [
  { id: 'diary', label: 'My Diary', color: 'from-[#F6B6CE] to-[#F18CAF] text-white' },
  { id: 'wishes', label: 'My Wishes', color: 'from-[#DCCCFB] to-[#B79CED] text-[#3B2138]' },
  { id: 'memories', label: 'Bookmarks', color: 'from-[#CDE9FA] to-[#98CBEB] text-[#3B2138]' },
  { id: 'write', label: 'Write Entry', color: 'from-[#F5DEB0] to-[#E8C98C] text-[#3B2138]' },
];

export const PrincessDiary: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { db, hasBackend, commitLocalDb, refreshKingdom, grantReward, showToast } = useKingdom();
  const [activeTab, setActiveTab] = useState<DiaryTab>('diary');
  const [search, setSearch] = useState('');
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('Magical');
  const [saving, setSaving] = useState(false);

  if (!db) return null;
  const filteredEntries = db.diaryEntries.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.content.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'memories') return matchesSearch && bookmarked.includes(e.id);
    return matchesSearch;
  });

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      let savedViaApi = false;
      if (hasBackend) {
        try {
          const res = await fetch('/api/diary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, mood, sticker: 'heart' }),
          });
          if (res.ok && (res.headers.get('content-type') || '').includes('application/json')) {
            savedViaApi = true;
            await refreshKingdom();
          }
        } catch {
          // fallback below
        }
      }

      if (!savedViaApi) {
        const entry = {
          id: `diary-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          title: title.trim(),
          content: content.trim(),
          mood,
          sticker: 'heart',
          author: 'Akuu' as const,
        };
        commitLocalDb((prev) => ({ ...prev, diaryEntries: [entry, ...prev.diaryEntries] }));
      }

      soundEngine.playSfx('paper');
      setTitle('');
      setContent('');
      setActiveTab('diary');
      await grantReward({ achievementId: 'diary-writer', points: 25, coins: 25 });
      showToast('Saved to Akuu’s Princess Diary ♡');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DestinationFrame
      title="The Princess Diary"
      subtitle="Open gilded storybook with pastel ribbon bookmarks, wishes & secret journal pages"
      chapterNumber={22}
      onBack={onBack}
    >
      {/* Open Storybook Spread + Right-Edge Pastel Ribbon Bookmark Tabs */}
      <div className="relative flex flex-col lg:flex-row items-stretch gap-0">
        {/* Main Two-Page Open Book */}
        <div className="flex-1 rounded-[28px] border-4 border-[#E8C98C] bg-gradient-to-r from-[#FFF7F2] via-[#FFF9F7] to-[#FFF2F7] shadow-[0_24px_60px_-20px_rgba(117,71,111,0.35)] p-6 sm:p-8 relative overflow-hidden">
          {/* Center Book Spine Shadow */}
          <div className="hidden lg:block absolute inset-y-4 left-1/2 -translate-x-1/2 w-6 bg-gradient-to-r from-transparent via-[#E8C98C]/25 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <WaxSealHeart className="w-9 h-9" />
              <div>
                <div className="text-xs uppercase tracking-widest text-[#75476F]/80">Illuminated Journal</div>
                <h2 className="font-royal text-2xl sm:text-3xl font-semibold text-[#3B2138]">
                  Dear Princess Akuu...
                </h2>
              </div>
            </div>
            <SatinBow className="w-11 h-8" />
          </div>

          <PearlGarland className="w-full h-3.5 mb-6 opacity-80" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Book Page: Things That Make My Princess Special / Compose */}
            <div className="lg:col-span-5 space-y-6 lg:pr-4">
              {activeTab === 'write' ? (
                <form onSubmit={handleSaveEntry} className="rounded-2xl border border-[#E8C98C]/60 bg-white/80 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#75476F]">
                    <Feather className="w-4 h-4 text-[#F18CAF]" />
                    Quill & Ink · New Diary Page
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Page title..."
                    className="w-full rounded-xl border border-[#E8C98C]/60 bg-[#FFF9F7] px-3.5 py-2 text-sm text-[#3B2138]"
                  />
                  <div className="flex flex-wrap gap-2">
                    {['Magical', 'Cozy', 'Joyful', 'Grateful'].map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setMood(m)}
                        className={`px-3 py-1 rounded-full text-xs cursor-pointer ${
                          mood === m ? 'bg-[#75476F] text-white' : 'bg-[#F9DCE7]/70 text-[#75476F]'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                    placeholder="Write down today’s memory or secret thought..."
                    className="w-full rounded-xl border border-[#E8C98C]/60 bg-[#FFF9F7] p-3 text-sm text-[#3B2138]"
                  />
                  <RoyalButton type="submit" variant="glossy" size="sm" disabled={saving}>
                    <Sparkles className="w-3.5 h-3.5" />
                    {saving ? 'Sealing Page...' : 'Seal & Save Page'}
                  </RoyalButton>
                </form>
              ) : (
                <GildedFrameCard className="bg-gradient-to-br from-[#FFF9F7] to-[#F9DCE7]/55" showBow>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#75476F] mb-2">
                    <Heart className="w-4 h-4 text-[#F18CAF] fill-[#F18CAF]" />
                    Dedicated Page · Written by Tarun
                  </div>
                  <h3 className="font-royal text-2xl font-semibold text-[#3B2138] mb-3">
                    {activeTab === 'wishes' ? 'My Princess Wishes' : 'Things That Make My Princess Special'}
                  </h3>
                  <ul className="space-y-2.5 text-sm text-[#3B2138]">
                    {db.compliments.map((c, idx) => (
                      <li key={idx} className="pb-2 border-b border-[#E8C98C]/30 last:border-0 leading-relaxed font-handwritten text-xl text-[#5A3256]">
                        {idx + 1}. {c}
                      </li>
                    ))}
                  </ul>
                </GildedFrameCard>
              )}
            </div>

            {/* Right Book Page: Handwritten Entries & Search */}
            <div className="lg:col-span-7 space-y-4 lg:pl-4">
              <div className="relative">
                <Search className="w-4 h-4 text-[#75476F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search storybook pages..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8C98C]/60 bg-white/90 text-sm text-[#3B2138]"
                />
              </div>

              {filteredEntries.length === 0 ? (
                <div className="rounded-2xl border border-[#E8C98C]/45 bg-white/75 p-8 text-center text-sm text-[#75476F]">
                  {activeTab === 'memories'
                    ? 'Tap the bookmark ribbon on any entry to save it to your favorite memories.'
                    : 'No diary pages matched that search.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEntries.map((entry) => {
                    const marked = bookmarked.includes(entry.id);
                    return (
                      <article
                        key={entry.id}
                        className="rounded-2xl p-5 bg-white/85 border border-[#E8C98C]/55 shadow-sm"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(transparent, transparent 27px, rgba(232,201,140,0.18) 28px)',
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-xs text-[#75476F]/75">
                              {entry.date} · {entry.mood} · By {entry.author}
                            </div>
                            <h3 className="font-royal text-2xl font-semibold text-[#3B2138] mt-0.5">{entry.title}</h3>
                          </div>
                          <button
                            onClick={() => {
                              soundEngine.playSfx('pop');
                              setBookmarked((prev) =>
                                prev.includes(entry.id) ? prev.filter((id) => id !== entry.id) : [...prev, entry.id]
                              );
                            }}
                            aria-label="Bookmark page"
                            className={`p-2 rounded-lg cursor-pointer transition-colors ${
                              marked ? 'bg-[#F18CAF] text-white' : 'bg-[#F9DCE7]/70 text-[#75476F]'
                            }`}
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="font-handwritten text-2xl text-[#5A3256] mt-3 leading-relaxed whitespace-pre-line">
                          {entry.content}
                        </p>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right-Edge Pastel Ribbon Bookmarks */}
        <nav aria-label="Diary ribbon bookmarks" className="flex lg:flex-col gap-2 mt-4 lg:mt-8 lg:-ml-2 z-10 shrink-0">
          {RIBBON_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEngine.playSfx('paper');
                  setActiveTab(tab.id);
                }}
                className={`px-4 py-2.5 rounded-full lg:rounded-l-none lg:rounded-r-2xl border border-[#E8C98C] bg-gradient-to-r ${tab.color} text-xs font-semibold shadow-md transition-transform cursor-pointer ${
                  active ? 'lg:translate-x-2 scale-[1.03] ring-2 ring-[#FFF3D6]' : 'opacity-85 hover:opacity-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </DestinationFrame>
  );
};
