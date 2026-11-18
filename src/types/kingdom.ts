export type DestinationId =
  | 'royal-palace'
  | 'dressing-room'
  | 'magical-garden'
  | 'memory-museum'
  | 'video-theatre'
  | 'love-library'
  | 'princess-arcade'
  | 'kitty-kingdom'
  | 'music-room'
  | 'royal-bakery'
  | 'magical-cafe'
  | 'star-observatory'
  | 'fairy-forest'
  | 'treasure-vault'
  | 'dollhouse'
  | 'royal-spa'
  | 'fashion-studio'
  | 'art-studio'
  | 'love-garden'
  | 'royal-mailbox'
  | 'dream-cloud'
  | 'princess-diary'
  | 'achievement-hall'
  | 'grand-finale';

export type KingdomWing = 'royal' | 'gardens' | 'memories' | 'play';

export interface DestinationMeta {
  id: DestinationId;
  number: number;
  title: string;
  subtitle: string;
  wing: KingdomWing;
  mapX: number; // percentage on kingdom map
  mapY: number;
  accent: string;
  secretRequiredKeys?: number;
}

export interface SiteConfig {
  openingUniverseText: string;
  openingInvitationText: string;
  openingLetterBody: string;
  castleWelcomeTitle: string;
  castleWelcomeSubtitle: string;
  announcementText: string;
  princessDayMessage: string;
  finalVideoUrl: string;
  finalVideoTitle: string;
  themePreset: 'blush-royal' | 'lavender-moon' | 'rose-gold';
}

export interface Album {
  id: string;
  title: string;
  subtitle: string;
  coverUrl: string;
}

export interface PhotoMemory {
  id: string;
  albumId: string;
  title: string;
  caption: string;
  date: string;
  url: string;
  visible: boolean;
  isHiddenBox?: boolean;
  frameStyle: 'polaroid' | 'gold-arch' | 'pearl-scrapbook';
}

export interface VideoMemory {
  id: string;
  title: string;
  caption: string;
  date: string;
  url: string;
  thumbnailUrl: string;
  visible: boolean;
  durationLabel: string;
}

export interface LoveLetter {
  id: string;
  title: string;
  date: string;
  from: string;
  body: string;
  isSecret?: boolean;
  unlockKeysRequired?: number;
  sealColor: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
  sticker: string;
  author: 'Tarun' | 'Akuu';
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  category: 'fairytale' | 'romantic' | 'piano' | 'orchestral' | 'ambient' | 'personal';
  duration: number;
  url?: string; // optional uploaded mp3/wav URL; if omitted uses Web Audio synth preset
  synthPreset?: 'starlight-waltz' | 'rosewater-reverie' | 'cloud-lullaby' | 'kawaii-tea' | 'midnight-rain';
  lyrics: string;
}

export interface TreasureBox {
  id: string;
  name: string;
  themeColor: string;
  keysRequired: number;
  rewardType: 'letter' | 'photo' | 'dress' | 'pet-accessory' | 'secret-room' | 'keepsake';
  rewardTitle: string;
  rewardDescription: string;
  rewardItemId?: string;
  rewardImageUrl?: string;
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  rewardStars: number;
  rewardCoins: number;
}

export interface AvatarState {
  dress: string;
  tiara: string;
  necklace: string;
  hairstyle: string;
  shoes: string;
  blushTone: string;
  lipTint: string;
  pose: 'wave' | 'spin' | 'curtsy' | 'jump';
  nameplateTitle: string;
}

export interface PetState {
  activePet: 'mochi-kitten' | 'snowdrop-bunny' | 'pip-teddy';
  happiness: number;
  hunger: number;
  energy: number;
  accessory: 'none' | 'pink-bow' | 'mini-crown' | 'pearl-collar';
  isSleeping: boolean;
}

export interface DollhouseState {
  activeRoom: 'bedroom' | 'tea-parlour' | 'vanity-suite' | 'conservatory';
  wallpapers: Record<string, string>;
  curtainsOpen: Record<string, boolean>;
  placedItems: Array<{ id: string; room: string; itemId: string; x: number; y: number }>;
}

export interface GardenPlot {
  id: number;
  seedType: 'rose' | 'tulip' | 'sakura' | 'starflower' | 'lavender';
  stage: number; // 0 = empty, 1 = sprout, 2 = bud, 3 = full bloom
  wateredCount: number;
}

export interface PrincessProgress {
  points: number;
  stars: number;
  keys: number;
  coins: number;
  unlockedDresses: string[];
  unlockedPets: string[];
  unlockedDecorations: string[];
  unlockedBoxes: string[];
  unlockedAchievements: string[];
  visitedDestinations: DestinationId[];
  hiddenStarsFound: string[];
  gameHighScores: Record<string, number>;
  wishes: Array<{ id: string; text: string; date: string }>;
  avatar: AvatarState;
  pet: PetState;
  dollhouse: DollhouseState;
  gardenPlots: GardenPlot[];
  collectedPetals: number;
  preferences: {
    musicVolume: number;
    sfxEnabled: boolean;
    reducedMotion: boolean;
    cursorTrail: boolean;
  };
}

export interface KingdomDatabase {
  siteConfig: SiteConfig;
  albums: Album[];
  photos: PhotoMemory[];
  videos: VideoMemory[];
  letters: LoveLetter[];
  diaryEntries: DiaryEntry[];
  compliments: string[];
  audioTracks: AudioTrack[];
  treasureBoxes: TreasureBox[];
  achievements: AchievementDef[];
  progress: PrincessProgress;
}
