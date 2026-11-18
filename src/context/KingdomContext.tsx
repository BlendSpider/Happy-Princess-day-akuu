import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { DestinationId, KingdomDatabase, PrincessProgress } from '../types/kingdom';
import { buildDefaultDatabase } from '../data/defaultKingdom';
import { soundEngine } from '../audio/soundEngine';

const LOCAL_DB_KEY = 'akuu_kingdom_db_v1';

function readLocalDb(): KingdomDatabase {
  try {
    const raw = localStorage.getItem(LOCAL_DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as KingdomDatabase;
      if (parsed && parsed.siteConfig && parsed.progress) {
        return parsed;
      }
    }
  } catch {
    // ignore storage errors
  }
  const fresh = buildDefaultDatabase();
  writeLocalDb(fresh);
  return fresh;
}

function writeLocalDb(data: KingdomDatabase): void {
  try {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

interface KingdomContextValue {
  db: KingdomDatabase | null;
  loading: boolean;
  hasBackend: boolean;
  activeDestination: DestinationId | 'hub';
  navigateTo: (dest: DestinationId | 'hub') => void;
  updateProgress: (patch: Partial<PrincessProgress>) => Promise<void>;
  commitLocalDb: (updater: (prev: KingdomDatabase) => KingdomDatabase) => void;
  grantReward: (opts: {
    points?: number;
    stars?: number;
    keys?: number;
    coins?: number;
    achievementId?: string;
    highScoreGame?: string;
    highScoreValue?: number;
  }) => Promise<void>;
  refreshKingdom: () => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  replayOpening: () => void;
  showAdminModal: boolean;
  setShowAdminModal: (v: boolean) => void;
}

const KingdomContext = createContext<KingdomContextValue | null>(null);

export const KingdomProvider: React.FC<{
  children: React.ReactNode;
  onReplayOpening: () => void;
}> = ({ children, onReplayOpening }) => {
  const [db, setDb] = useState<KingdomDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasBackend, setHasBackend] = useState(false);
  const [activeDestination, setActiveDestination] = useState<DestinationId | 'hub'>('hub');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3400);
  }, []);

  const commitLocalDb = useCallback((updater: (prev: KingdomDatabase) => KingdomDatabase) => {
    setDb((prev) => {
      const base = prev || readLocalDb();
      const next = updater(base);
      writeLocalDb(next);
      return next;
    });
  }, []);

  const refreshKingdom = useCallback(async () => {
    try {
      const res = await fetch('/api/kingdom');
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const data = (await res.json()) as KingdomDatabase;
        setDb(data);
        setHasBackend(true);
        writeLocalDb(data);
        soundEngine.setVolume(data.progress.preferences.musicVolume);
        soundEngine.setSfxEnabled(data.progress.preferences.sfxEnabled);
        return;
      }
    } catch {
      // Static hosting (e.g. Vercel) without Express API -> use local storage fallback
    }

    const fallback = readLocalDb();
    setDb(fallback);
    setHasBackend(false);
    soundEngine.setVolume(fallback.progress.preferences.musicVolume);
    soundEngine.setSfxEnabled(fallback.progress.preferences.sfxEnabled);
  }, []);

  useEffect(() => {
    void (async () => {
      await refreshKingdom();
      setLoading(false);
    })();
  }, [refreshKingdom]);

  const updateProgress = useCallback(
    async (patch: Partial<PrincessProgress>) => {
      setDb((prev) => {
        if (!prev) return prev;
        const next: KingdomDatabase = {
          ...prev,
          progress: {
            ...prev.progress,
            ...patch,
            avatar: patch.avatar ? { ...prev.progress.avatar, ...patch.avatar } : prev.progress.avatar,
            pet: patch.pet ? { ...prev.progress.pet, ...patch.pet } : prev.progress.pet,
            dollhouse: patch.dollhouse ? { ...prev.progress.dollhouse, ...patch.dollhouse } : prev.progress.dollhouse,
            preferences: patch.preferences
              ? { ...prev.progress.preferences, ...patch.preferences }
              : prev.progress.preferences,
          },
        };
        writeLocalDb(next);
        return next;
      });

      if (!hasBackend) return;
      try {
        const res = await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        });
        const ct = res.headers.get('content-type') || '';
        if (res.ok && ct.includes('application/json')) {
          const { progress } = (await res.json()) as { progress: PrincessProgress };
          setDb((prev) => {
            if (!prev) return prev;
            const next = { ...prev, progress };
            writeLocalDb(next);
            return next;
          });
        }
      } catch {
        // Keep optimistic local update if network drops
      }
    },
    [hasBackend],
  );

  const grantReward = useCallback(
    async (opts: {
      points?: number;
      stars?: number;
      keys?: number;
      coins?: number;
      achievementId?: string;
      highScoreGame?: string;
      highScoreValue?: number;
    }) => {
      if (!db) return;
      const p = db.progress;
      let extraStars = 0;
      let extraCoins = 0;
      const unlockedAchievements = [...p.unlockedAchievements];
      let unlockedName = '';

      if (opts.achievementId && !unlockedAchievements.includes(opts.achievementId)) {
        unlockedAchievements.push(opts.achievementId);
        const def = db.achievements.find((a) => a.id === opts.achievementId);
        if (def) {
          extraStars += def.rewardStars;
          extraCoins += def.rewardCoins;
          unlockedName = def.title;
        }
      }

      const gameHighScores = { ...p.gameHighScores };
      if (opts.highScoreGame && typeof opts.highScoreValue === 'number') {
        gameHighScores[opts.highScoreGame] = Math.max(gameHighScores[opts.highScoreGame] || 0, opts.highScoreValue);
      }

      await updateProgress({
        points: p.points + (opts.points || 0),
        stars: p.stars + (opts.stars || 0) + extraStars,
        keys: p.keys + (opts.keys || 0),
        coins: p.coins + (opts.coins || 0) + extraCoins,
        unlockedAchievements,
        gameHighScores,
      });

      if (unlockedName) {
        soundEngine.playSfx('achievement');
        showToast(`Royal Badge Unlocked: ${unlockedName}`);
      }
    },
    [db, updateProgress, showToast],
  );

  const navigateTo = useCallback(
    (dest: DestinationId | 'hub') => {
      soundEngine.playSfx(dest === 'hub' ? 'footstep' : 'sparkle');
      setActiveDestination(dest);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (dest !== 'hub' && db) {
        const visited = db.progress.visitedDestinations.includes(dest)
          ? db.progress.visitedDestinations
          : [...db.progress.visitedDestinations, dest];
        const nextAchievements = [...db.progress.unlockedAchievements];
        if (visited.length >= 12 && !nextAchievements.includes('world-traveler')) {
          void grantReward({ achievementId: 'world-traveler' });
        }
        if (visited.length !== db.progress.visitedDestinations.length) {
          void updateProgress({ visitedDestinations: visited });
        }
      }
    },
    [db, grantReward, updateProgress],
  );

  return (
    <KingdomContext.Provider
      value={{
        db,
        loading,
        hasBackend,
        activeDestination,
        navigateTo,
        updateProgress,
        commitLocalDb,
        grantReward,
        refreshKingdom,
        toastMessage,
        showToast,
        replayOpening: onReplayOpening,
        showAdminModal,
        setShowAdminModal,
      }}
    >
      {children}
    </KingdomContext.Provider>
  );
};

export function useKingdom(): KingdomContextValue {
  const ctx = useContext(KingdomContext);
  if (!ctx) throw new Error('useKingdom must be used inside KingdomProvider');
  return ctx;
}
