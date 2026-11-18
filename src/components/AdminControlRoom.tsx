import React, { useState } from 'react';
import { X, Upload, Trash2, Download, RotateCcw, Eye, EyeOff, Lock, Save } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { RoyalButton } from './ui/RoyalUI';

type AdminTab = 'story' | 'photos' | 'videos' | 'letters' | 'audio' | 'vault' | 'backup';

const LOCAL_ADMIN_HASH = 'f00c621d9fbeecaf3b92fc67c0ed0901b01a4fb5c61a72daa2c0e446972bdd4d';

async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const AdminControlRoom: React.FC = () => {
  const { db, hasBackend, commitLocalDb, showAdminModal, setShowAdminModal, refreshKingdom, showToast } = useKingdom();
  const [token, setToken] = useState<string>(() => sessionStorage.getItem('akuu_admin_token') || '');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [tab, setTab] = useState<AdminTab>('story');
  const [busy, setBusy] = useState(false);

  // Story / Config fields
  const [openingUniverseText, setOpeningUniverseText] = useState('');
  const [openingLetterBody, setOpeningLetterBody] = useState('');
  const [announcementText, setAnnouncementText] = useState('');
  const [princessDayMessage, setPrincessDayMessage] = useState('');
  const [finalVideoUrl, setFinalVideoUrl] = useState('');
  const [configLoaded, setConfigLoaded] = useState(false);

  // New Photo form
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoAlbumId, setPhotoAlbumId] = useState('album-fairytale');
  const [photoUrl, setPhotoUrl] = useState('');
  const [albumTitle, setAlbumTitle] = useState('');

  // New Video form
  const [videoTitle, setVideoTitle] = useState('');
  const [videoCaption, setVideoCaption] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // New Letter & Compliment
  const [letterTitle, setLetterTitle] = useState('');
  const [letterBody, setLetterBody] = useState('');
  const [complimentText, setComplimentText] = useState('');

  // New Audio track
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtist, setTrackArtist] = useState('');
  const [trackUrl, setTrackUrl] = useState('');

  if (!showAdminModal || !db) return null;

  if (!configLoaded) {
    setOpeningUniverseText(db.siteConfig.openingUniverseText);
    setOpeningLetterBody(db.siteConfig.openingLetterBody);
    setAnnouncementText(db.siteConfig.announcementText);
    setPrincessDayMessage(db.siteConfig.princessDayMessage);
    setFinalVideoUrl(db.siteConfig.finalVideoUrl);
    setConfigLoaded(true);
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const isLocalSession = !hasBackend || token === 'local-admin-session';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (hasBackend) {
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        });
        const ct = res.headers.get('content-type') || '';
        if (res.status === 401) {
          setAuthError('Incorrect passphrase. Please try again.');
          return;
        }
        if (res.ok && ct.includes('application/json')) {
          const data = (await res.json()) as { token: string };
          sessionStorage.setItem('akuu_admin_token', data.token);
          setToken(data.token);
          setPassword('');
          showToast('Welcome to Tarun’s Control Room');
          return;
        }
      } catch {
        // fall through to static digest verification
      }
    }

    const digest = await sha256Hex(password);
    if (digest !== LOCAL_ADMIN_HASH) {
      setAuthError('Incorrect passphrase. Please try again.');
      return;
    }
    sessionStorage.setItem('akuu_admin_token', 'local-admin-session');
    setToken('local-admin-session');
    setPassword('');
    showToast('Welcome to Tarun’s Control Room');
  };

  const uploadFile = async (file: File): Promise<string> => {
    setBusy(true);
    try {
      const dataBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('File read error'));
        reader.readAsDataURL(file);
      });

      if (isLocalSession) {
        return dataBase64;
      }

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers,
        body: JSON.stringify({ filename: file.name, dataBase64 }),
      });
      if (!res.ok) return dataBase64;
      const data = (await res.json()) as { url: string };
      return data.url;
    } finally {
      setBusy(false);
    }
  };

  const saveConfig = async () => {
    setBusy(true);
    try {
      const patch = {
        openingUniverseText,
        openingLetterBody,
        announcementText,
        princessDayMessage,
        finalVideoUrl,
      };
      if (isLocalSession) {
        commitLocalDb((prev) => ({ ...prev, siteConfig: { ...prev.siteConfig, ...patch } }));
        showToast('Kingdom settings updated!');
        return;
      }
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers,
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        await refreshKingdom();
        showToast('Kingdom settings updated!');
      } else if (res.status === 401) {
        setToken('');
      }
    } finally {
      setBusy(false);
    }
  };

  const addItem = async (type: string, payload: Record<string, unknown>) => {
    setBusy(true);
    try {
      if (isLocalSession) {
        commitLocalDb((prev) => {
          if (type === 'compliments' && typeof payload.text === 'string') {
            return { ...prev, compliments: [payload.text, ...prev.compliments] };
          }
          const newItem = { id: `${type}-${Date.now()}`, ...payload };
          const list = prev[type as keyof typeof prev];
          if (Array.isArray(list)) {
            return { ...prev, [type]: [newItem, ...list] };
          }
          return prev;
        });
        showToast('Added successfully!');
        return;
      }
      const res = await fetch(`/api/admin/collection/${type}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await refreshKingdom();
        showToast('Added successfully!');
      }
    } finally {
      setBusy(false);
    }
  };

  const updateItem = async (type: string, id: string, payload: Record<string, unknown>) => {
    if (isLocalSession) {
      commitLocalDb((prev) => {
        const list = prev[type as keyof typeof prev];
        if (!Array.isArray(list)) return prev;
        return {
          ...prev,
          [type]: list.map((item) =>
            typeof item === 'object' && item !== null && 'id' in item && item.id === id ? { ...item, ...payload } : item
          ),
        };
      });
      return;
    }
    const res = await fetch(`/api/admin/collection/${type}/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });
    if (res.ok) await refreshKingdom();
  };

  const deleteItem = async (type: string, id: string) => {
    if (isLocalSession) {
      commitLocalDb((prev) => {
        if (type === 'compliments') {
          const idx = Number(id);
          return { ...prev, compliments: prev.compliments.filter((_, i) => i !== idx) };
        }
        const list = prev[type as keyof typeof prev];
        if (!Array.isArray(list)) return prev;
        return {
          ...prev,
          [type]: list.filter((item) => !(typeof item === 'object' && item !== null && 'id' in item && item.id === id)),
        };
      });
      showToast('Removed.');
      return;
    }
    const res = await fetch(`/api/admin/collection/${type}/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (res.ok) {
      await refreshKingdom();
      showToast('Removed.');
    }
  };

  const downloadBackup = async () => {
    let payload: unknown = db;
    if (!isLocalSession) {
      const res = await fetch('/api/admin/backup', { headers });
      if (!res.ok) return;
      payload = await res.json();
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `akuu-kingdom-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const restoreBackup = async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!parsed || !parsed.siteConfig || !parsed.progress) return;
    if (isLocalSession) {
      commitLocalDb(() => parsed);
      showToast('Kingdom restored from backup!');
      return;
    }
    const res = await fetch('/api/admin/restore', {
      method: 'POST',
      headers,
      body: JSON.stringify(parsed),
    });
    if (res.ok) {
      await refreshKingdom();
      showToast('Kingdom restored from backup!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1B0F21]/85 flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-4xl w-full bg-[#FFF9F7] rounded-3xl border-2 border-[#E8C98C] shadow-2xl overflow-hidden my-6">
        <div className="px-6 py-4 bg-[#75476F] text-[#FFF9F7] flex items-center justify-between">
          <div>
            <h2 className="font-royal text-2xl font-semibold">Tarun’s Control Room</h2>
            <p className="text-xs text-[#F9DCE7]">Manage photos, videos, letters, music, opening text & backups</p>
          </div>
          <div className="flex items-center gap-2">
            {token && (
              <button
                onClick={() => {
                  sessionStorage.removeItem('akuu_admin_token');
                  setToken('');
                }}
                className="text-xs text-[#F9DCE7] hover:text-white underline cursor-pointer mr-2"
              >
                Lock
              </button>
            )}
            <button
              onClick={() => setShowAdminModal(false)}
              aria-label="Close Control Room"
              className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!token ? (
          <form onSubmit={handleLogin} className="p-8 max-w-md mx-auto text-center space-y-4">
            <Lock className="w-9 h-9 text-[#75476F] mx-auto" />
            <h3 className="font-romantic text-xl font-semibold text-[#3B2138]">Enter Royal Passphrase</h3>
            <p className="text-xs text-[#75476F]">
              Protected area for Tarun to customize memories, messages & media.
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passphrase..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8C98C] bg-white text-sm text-[#3B2138]"
              autoFocus
            />
            {authError && <div className="text-xs text-rose-700">{authError}</div>}
            <RoyalButton type="submit" variant="primary" className="w-full">
              Unlock Control Room
            </RoyalButton>
          </form>
        ) : (
          <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
            {/* Tabs */}
            <div className="flex flex-wrap gap-1.5 pb-3 border-b border-[#E8C98C]/40">
              {[
                { id: 'story', label: 'Story & Opening' },
                { id: 'photos', label: 'Photos & Albums' },
                { id: 'videos', label: 'Videos & Finale' },
                { id: 'letters', label: 'Letters & Compliments' },
                { id: 'audio', label: 'Music & Audio' },
                { id: 'backup', label: 'Backup & Restore' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as AdminTab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                    tab === t.id ? 'bg-[#75476F] text-white' : 'bg-[#F9DCE7]/70 text-[#75476F]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'story' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#75476F] mb-1">Opening Universe Line</label>
                  <input
                    value={openingUniverseText}
                    onChange={(e) => setOpeningUniverseText(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8C98C]/60 bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#75476F] mb-1">Invitation Letter Body</label>
                  <textarea
                    rows={4}
                    value={openingLetterBody}
                    onChange={(e) => setOpeningLetterBody(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#E8C98C]/60 bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#75476F] mb-1">Kingdom Announcement Board</label>
                  <input
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8C98C]/60 bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#75476F] mb-1">Princess Day Message</label>
                  <textarea
                    rows={3}
                    value={princessDayMessage}
                    onChange={(e) => setPrincessDayMessage(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#E8C98C]/60 bg-white text-sm"
                  />
                </div>
                <RoyalButton variant="primary" onClick={saveConfig} disabled={busy}>
                  <Save className="w-4 h-4" />
                  Save Story Updates
                </RoyalButton>
              </div>
            )}

            {tab === 'photos' && (
              <div className="space-y-6">
                {/* Create Album */}
                <div className="p-4 rounded-2xl bg-white border border-[#E8C98C]/50 flex flex-wrap gap-2 items-center">
                  <input
                    value={albumTitle}
                    onChange={(e) => setAlbumTitle(e.target.value)}
                    placeholder="New album title..."
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E8C98C]/50 text-sm"
                  />
                  <RoyalButton
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      if (!albumTitle.trim()) return;
                      void addItem('albums', {
                        title: albumTitle,
                        subtitle: 'Curated by Tarun',
                        coverUrl: '/src/assets/images/memory_garden_picnic_1794980445125.jpg',
                      });
                      setAlbumTitle('');
                    }}
                  >
                    Add Album
                  </RoyalButton>
                </div>

                {/* Upload Photo */}
                <div className="p-5 rounded-2xl bg-white border border-[#E8C98C]/50 space-y-3">
                  <h4 className="font-romantic font-semibold text-base">Upload Photograph</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      placeholder="Photo title"
                      className="px-3 py-2 rounded-xl border border-[#E8C98C]/50 text-sm"
                    />
                    <select
                      value={photoAlbumId}
                      onChange={(e) => setPhotoAlbumId(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-[#E8C98C]/50 text-sm bg-white"
                    >
                      {db.albums.map((a) => (
                        <option key={a.id} value={a.id}>{a.title}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    placeholder="Romantic caption..."
                    className="w-full px-3 py-2 rounded-xl border border-[#E8C98C]/50 text-sm"
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F9DCE7] text-[#75476F] text-xs font-semibold cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      {busy ? 'Uploading...' : 'Choose Image File'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = await uploadFile(file);
                          setPhotoUrl(url);
                        }}
                      />
                    </label>
                    {photoUrl && <span className="text-xs text-emerald-700">Uploaded ready!</span>}
                    <RoyalButton
                      variant="primary"
                      size="sm"
                      disabled={!photoUrl || !photoTitle}
                      onClick={() => {
                        void addItem('photos', {
                          albumId: photoAlbumId,
                          title: photoTitle,
                          caption: photoCaption,
                          date: new Date().toLocaleDateString(),
                          url: photoUrl,
                          visible: true,
                          frameStyle: 'polaroid',
                        });
                        setPhotoTitle('');
                        setPhotoCaption('');
                        setPhotoUrl('');
                      }}
                    >
                      Add to Museum
                    </RoyalButton>
                  </div>
                </div>

                {/* Existing Photos */}
                <div className="space-y-2">
                  {db.photos.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E8C98C]/35 text-xs">
                      <span className="font-semibold text-[#3B2138]">{p.title}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => void updateItem('photos', p.id, { visible: !p.visible })}
                          className="p-1.5 rounded-lg bg-[#F9DCE7]/60 text-[#75476F] cursor-pointer"
                          title="Toggle visibility"
                        >
                          {p.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => void deleteItem('photos', p.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-700 cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'videos' && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-white border border-[#E8C98C]/50 space-y-3">
                  <h4 className="font-romantic font-semibold text-base">Grand Finale Final Video</h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F9DCE7] text-[#75476F] text-xs font-semibold cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      Upload Finale Video
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = await uploadFile(file);
                          setFinalVideoUrl(url);
                        }}
                      />
                    </label>
                    <input
                      value={finalVideoUrl}
                      onChange={(e) => setFinalVideoUrl(e.target.value)}
                      placeholder="Or paste video URL..."
                      className="flex-1 px-3 py-2 rounded-xl border border-[#E8C98C]/50 text-xs"
                    />
                    <RoyalButton variant="gold" size="sm" onClick={saveConfig}>
                      Save Finale Video
                    </RoyalButton>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E8C98C]/50 space-y-3">
                  <h4 className="font-romantic font-semibold text-base">Add Theatre Video</h4>
                  <input
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Video title"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8C98C]/50 text-sm"
                  />
                  <input
                    value={videoCaption}
                    onChange={(e) => setVideoCaption(e.target.value)}
                    placeholder="Caption"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8C98C]/50 text-sm"
                  />
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F9DCE7] text-[#75476F] text-xs font-semibold cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      Choose Video File
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = await uploadFile(file);
                          setVideoUrl(url);
                        }}
                      />
                    </label>
                    <RoyalButton
                      variant="primary"
                      size="sm"
                      disabled={!videoUrl || !videoTitle}
                      onClick={() => {
                        void addItem('videos', {
                          title: videoTitle,
                          caption: videoCaption,
                          date: new Date().toLocaleDateString(),
                          url: videoUrl,
                          thumbnailUrl: '/src/assets/images/grand_finale_sunset_1794980446163.jpg',
                          visible: true,
                          durationLabel: 'Video',
                        });
                        setVideoTitle('');
                        setVideoCaption('');
                        setVideoUrl('');
                      }}
                    >
                      Add Video
                    </RoyalButton>
                  </div>
                </div>
              </div>
            )}

            {tab === 'letters' && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-white border border-[#E8C98C]/50 space-y-3">
                  <h4 className="font-romantic font-semibold text-base">Write a New Love Letter</h4>
                  <input
                    value={letterTitle}
                    onChange={(e) => setLetterTitle(e.target.value)}
                    placeholder="Letter title"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8C98C]/50 text-sm"
                  />
                  <textarea
                    rows={4}
                    value={letterBody}
                    onChange={(e) => setLetterBody(e.target.value)}
                    placeholder="Write your heartfelt message to Akuu..."
                    className="w-full p-3 rounded-xl border border-[#E8C98C]/50 text-sm"
                  />
                  <RoyalButton
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (!letterTitle || !letterBody) return;
                      void addItem('letters', {
                        title: letterTitle,
                        date: new Date().toLocaleDateString(),
                        from: 'With endless love, Tarun',
                        body: letterBody,
                        sealColor: '#F18CAF',
                      });
                      setLetterTitle('');
                      setLetterBody('');
                    }}
                  >
                    Publish Letter
                  </RoyalButton>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E8C98C]/50 space-y-3">
                  <h4 className="font-romantic font-semibold text-base">Add to “Things That Make My Princess Special”</h4>
                  <div className="flex gap-2">
                    <input
                      value={complimentText}
                      onChange={(e) => setComplimentText(e.target.value)}
                      placeholder="Write a personal compliment..."
                      className="flex-1 px-3 py-2 rounded-xl border border-[#E8C98C]/50 text-sm"
                    />
                    <RoyalButton
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        if (!complimentText.trim()) return;
                        void addItem('compliments', { text: complimentText.trim() });
                        setComplimentText('');
                      }}
                    >
                      Add
                    </RoyalButton>
                  </div>
                </div>
              </div>
            )}

            {tab === 'audio' && (
              <div className="p-5 rounded-2xl bg-white border border-[#E8C98C]/50 space-y-3">
                <h4 className="font-romantic font-semibold text-base">Upload Audio Track</h4>
                <input
                  value={trackTitle}
                  onChange={(e) => setTrackTitle(e.target.value)}
                  placeholder="Track title"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8C98C]/50 text-sm"
                />
                <input
                  value={trackArtist}
                  onChange={(e) => setTrackArtist(e.target.value)}
                  placeholder="Dedication / Artist"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8C98C]/50 text-sm"
                />
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F9DCE7] text-[#75476F] text-xs font-semibold cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    Choose Audio File (.mp3 / .wav)
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await uploadFile(file);
                        setTrackUrl(url);
                      }}
                    />
                  </label>
                  <RoyalButton
                    variant="primary"
                    size="sm"
                    disabled={!trackUrl || !trackTitle}
                    onClick={() => {
                      void addItem('audioTracks', {
                        title: trackTitle,
                        artist: trackArtist || 'For Akuu',
                        category: 'personal',
                        duration: 180,
                        url: trackUrl,
                        lyrics: 'Uploaded personally by Tarun for Akuu.',
                      });
                      setTrackTitle('');
                      setTrackArtist('');
                      setTrackUrl('');
                    }}
                  >
                    Add Track
                  </RoyalButton>
                </div>
              </div>
            )}

            {tab === 'backup' && (
              <div className="p-6 rounded-2xl bg-white border border-[#E8C98C]/50 space-y-4">
                <h4 className="font-romantic text-lg font-semibold">Backup & Restore Entire Kingdom</h4>
                <div className="flex flex-wrap gap-3">
                  <RoyalButton variant="gold" size="sm" onClick={downloadBackup}>
                    <Download className="w-4 h-4" />
                    Download JSON Backup
                  </RoyalButton>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F9DCE7] text-[#75476F] text-xs font-semibold cursor-pointer">
                    <RotateCcw className="w-4 h-4" />
                    Restore From Backup JSON
                    <input
                      type="file"
                      accept="application/json"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void restoreBackup(f);
                      }}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
