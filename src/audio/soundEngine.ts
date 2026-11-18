import type { AudioTrack } from '../types/kingdom';

export type SfxName =
  | 'sparkle'
  | 'wand'
  | 'pop'
  | 'heart'
  | 'purr'
  | 'hop'
  | 'envelope'
  | 'paper'
  | 'chime'
  | 'glass'
  | 'chest'
  | 'wings'
  | 'fountain'
  | 'bubble'
  | 'achievement'
  | 'bloom'
  | 'giggle'
  | 'footstep'
  | 'door'
  | 'firework';

class PrincessSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private freqBuffer: Uint8Array | null = null;

  private audioEl: HTMLAudioElement | null = null;
  private mediaSource: MediaElementAudioSourceNode | null = null;

  private isPlaying = false;
  private currentTrack: AudioTrack | null = null;
  private synthTimer: number | null = null;
  private stepIndex = 0;
  private progressSec = 0;
  private volume = 0.45;
  private muted = false;
  private sfxEnabled = true;

  private ambientNodes: Map<string, { gain: GainNode; stop: () => void }> = new Map();
  private listeners: Set<() => void> = new Set();

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.freqBuffer = new Uint8Array(this.analyser.frequencyBinCount);

      this.musicGain.connect(this.analyser);
      this.analyser.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.applyVolumes();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private applyVolumes() {
    if (!this.ctx || !this.musicGain || !this.sfxGain || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.musicGain.gain.setTargetAtTime(this.muted ? 0 : this.volume, now, 0.04);
    this.sfxGain.gain.setTargetAtTime(this.sfxEnabled && !this.muted ? Math.min(1, this.volume + 0.2) : 0, now, 0.04);
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    this.listeners.forEach((fn) => fn());
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioEl) this.audioEl.volume = this.muted ? 0 : this.volume;
    this.applyVolumes();
    this.emit();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.audioEl) this.audioEl.volume = muted ? 0 : this.volume;
    this.applyVolumes();
    this.emit();
  }

  setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
    this.applyVolumes();
    this.emit();
  }

  getState() {
    return {
      isPlaying: this.isPlaying,
      currentTrack: this.currentTrack,
      progressSec: this.progressSec,
      volume: this.volume,
      muted: this.muted,
      sfxEnabled: this.sfxEnabled,
      activeAmbients: Array.from(this.ambientNodes.keys()),
    };
  }

  getVisualiserBars(count = 16): number[] {
    if (!this.analyser || !this.freqBuffer || !this.isPlaying) {
      return Array.from({ length: count }, (_, i) => (this.isPlaying ? 0.25 + (i % 3) * 0.1 : 0.08));
    }
    this.analyser.getByteFrequencyData(this.freqBuffer as unknown as Uint8Array<ArrayBuffer>);
    const out: number[] = [];
    for (let i = 0; i < count; i++) {
      const idx = Math.floor((i / count) * this.freqBuffer.length);
      out.push(Math.max(0.08, this.freqBuffer[idx] / 255));
    }
    return out;
  }

  playTrack(track: AudioTrack) {
    const ctx = this.ensureContext();
    this.stopMusicOnly();
    this.currentTrack = track;
    this.progressSec = 0;
    this.stepIndex = 0;
    this.isPlaying = true;

    if (track.url && ctx) {
      if (!this.audioEl) {
        this.audioEl = new Audio();
        this.audioEl.crossOrigin = 'anonymous';
        this.mediaSource = ctx.createMediaElementSource(this.audioEl);
        this.mediaSource.connect(this.musicGain!);
      }
      this.audioEl.src = track.url;
      this.audioEl.volume = this.muted ? 0 : this.volume;
      void this.audioEl.play().catch(() => {});
      this.synthTimer = window.setInterval(() => {
        if (this.audioEl) {
          this.progressSec = Math.floor(this.audioEl.currentTime);
          this.emit();
        }
      }, 500);
    } else {
      this.startSynthLoop(track.synthPreset || 'starlight-waltz', track.duration || 180);
    }
    this.emit();
  }

  togglePlay(fallbackTrack?: AudioTrack) {
    if (!this.currentTrack && fallbackTrack) {
      this.playTrack(fallbackTrack);
      return;
    }
    if (this.isPlaying) {
      this.pause();
    } else if (this.currentTrack) {
      this.ensureContext();
      this.isPlaying = true;
      if (this.currentTrack.url && this.audioEl) {
        void this.audioEl.play().catch(() => {});
      } else {
        this.startSynthLoop(this.currentTrack.synthPreset || 'starlight-waltz', this.currentTrack.duration || 180);
      }
      this.emit();
    }
  }

  pause() {
    this.isPlaying = false;
    if (this.audioEl) this.audioEl.pause();
    if (this.synthTimer) {
      clearInterval(this.synthTimer);
      this.synthTimer = null;
    }
    this.emit();
  }

  private stopMusicOnly() {
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
    }
    if (this.synthTimer) {
      clearInterval(this.synthTimer);
      this.synthTimer = null;
    }
  }

  private startSynthLoop(preset: NonNullable<AudioTrack['synthPreset']>, duration: number) {
    const scales: Record<NonNullable<AudioTrack['synthPreset']>, { notes: number[]; tempoMs: number; wave: OscillatorType }> = {
      'starlight-waltz': {
        notes: [523.25, 659.25, 783.99, 1046.5, 987.77, 783.99, 587.33, 698.46, 880.0, 783.99, 659.25, 523.25],
        tempoMs: 520,
        wave: 'sine',
      },
      'rosewater-reverie': {
        notes: [440.0, 554.37, 659.25, 880.0, 783.99, 659.25, 493.88, 587.33, 739.99, 659.25, 554.37, 440.0],
        tempoMs: 600,
        wave: 'triangle',
      },
      'cloud-lullaby': {
        notes: [392.0, 493.88, 587.33, 783.99, 659.25, 587.33, 440.0, 523.25, 659.25, 587.33],
        tempoMs: 760,
        wave: 'sine',
      },
      'kawaii-tea': {
        notes: [659.25, 783.99, 880.0, 1046.5, 880.0, 783.99, 698.46, 880.0, 1046.5, 1174.66, 1046.5, 783.99],
        tempoMs: 380,
        wave: 'sine',
      },
      'midnight-rain': {
        notes: [329.63, 392.0, 493.88, 587.33, 493.88, 392.0, 349.23, 440.0, 523.25, 440.0],
        tempoMs: 850,
        wave: 'sine',
      },
    };
    const cfg = scales[preset];
    this.synthTimer = window.setInterval(() => {
      if (!this.isPlaying) return;
      const ctx = this.ensureContext();
      if (!ctx || !this.musicGain) return;
      const freq = cfg.notes[this.stepIndex % cfg.notes.length];
      this.playMusicTone(freq, cfg.wave, cfg.tempoMs / 1000 * 1.4, 0.14);
      if (this.stepIndex % 3 === 0) {
        this.playMusicTone(freq * 0.5, 'sine', cfg.tempoMs / 1000 * 2.4, 0.08);
      }
      this.stepIndex++;
      this.progressSec = (this.progressSec + cfg.tempoMs / 1000) % duration;
      this.emit();
    }, cfg.tempoMs);
  }

  private playMusicTone(freq: number, wave: OscillatorType, dur: number, gainPeak: number) {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(gainPeak, now + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(g);
    g.connect(this.musicGain);
    osc.start(now);
    osc.stop(now + dur + 0.05);
  }

  playPianoNote(freq: number, dur = 0.7) {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const g = ctx.createGain();
    osc1.type = 'triangle';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 2, now);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.28, now + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc1.connect(g);
    osc2.connect(g);
    g.connect(this.sfxGain);
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + dur + 0.05);
    osc2.stop(now + dur + 0.05);
  }

  toggleAmbient(kind: 'rain' | 'forest' | 'fountain', enabled: boolean, level = 0.22) {
    const ctx = this.ensureContext();
    if (!ctx || !this.musicGain) return;

    const existing = this.ambientNodes.get(kind);
    if (!enabled) {
      if (existing) {
        existing.stop();
        this.ambientNodes.delete(kind);
        this.emit();
      }
      return;
    }

    if (existing) {
      existing.gain.gain.setTargetAtTime(level, ctx.currentTime, 0.1);
      return;
    }

    // Create procedural pink/filtered noise buffer
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.950 * b2 + white * 0.048;
      data[i] = (b0 + b1 + b2) * 0.5;
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = kind === 'fountain' ? 'bandpass' : 'lowpass';
    filter.frequency.value = kind === 'rain' ? 1200 : kind === 'forest' ? 650 : 1800;

    const gain = ctx.createGain();
    gain.gain.value = level;

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);
    src.start();

    this.ambientNodes.set(kind, {
      gain,
      stop: () => {
        try {
          src.stop();
          src.disconnect();
        } catch {
          // ignore
        }
      },
    });
    this.emit();
  }

  playSfx(name: SfxName) {
    if (!this.sfxEnabled || this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;

    const chime = (freqs: number[], gap = 0.06, dur = 0.35, wave: OscillatorType = 'sine', peak = 0.18) => {
      freqs.forEach((f, idx) => {
        const t = now + idx * gap;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = wave;
        osc.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(peak, t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(g);
        g.connect(this.sfxGain!);
        osc.start(t);
        osc.stop(t + dur + 0.03);
      });
    };

    switch (name) {
      case 'sparkle':
      case 'glass':
        chime([1046.5, 1318.5, 1567.98, 2093.0], 0.045, 0.28, 'sine', 0.14);
        break;
      case 'wand':
        chime([783.99, 987.77, 1174.66, 1567.98, 1975.53], 0.04, 0.36, 'triangle', 0.15);
        break;
      case 'pop':
      case 'bubble': {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(name === 'bubble' ? 420 : 520, now);
        osc.frequency.exponentialRampToValueAtTime(name === 'bubble' ? 980 : 780, now + 0.09);
        g.gain.setValueAtTime(0.18, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.14);
        break;
      }
      case 'heart':
        chime([659.25, 880.0, 1174.66], 0.05, 0.25, 'sine', 0.18);
        break;
      case 'purr': {
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, now);
        lfo.frequency.setValueAtTime(24, now);
        lfoGain.gain.setValueAtTime(18, now);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.16, now + 0.1);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
        osc.connect(g);
        g.connect(this.sfxGain);
        lfo.start(now);
        osc.start(now);
        lfo.stop(now + 0.72);
        osc.stop(now + 0.72);
        break;
      }
      case 'hop':
        chime([392, 659.25], 0.05, 0.15, 'triangle', 0.16);
        break;
      case 'envelope':
      case 'paper':
        chime([440, 554.37, 659.25], 0.07, 0.3, 'triangle', 0.12);
        break;
      case 'chime':
        chime([1174.66, 1567.98], 0.09, 0.7, 'sine', 0.16);
        break;
      case 'chest':
      case 'achievement':
        chime([523.25, 659.25, 783.99, 1046.5, 1318.51], 0.075, 0.45, 'triangle', 0.2);
        break;
      case 'wings':
        chime([880, 1046.5, 1318.51, 1046.5], 0.035, 0.18, 'sine', 0.1);
        break;
      case 'fountain':
        chime([587.33, 739.99, 880, 1174.66], 0.07, 0.35, 'sine', 0.11);
        break;
      case 'bloom':
        chime([523.25, 659.25, 783.99, 987.77, 1318.51], 0.06, 0.45, 'sine', 0.15);
        break;
      case 'giggle':
        chime([783.99, 987.77, 880, 1046.5], 0.06, 0.16, 'sine', 0.14);
        break;
      case 'footstep':
        chime([210], 0, 0.08, 'triangle', 0.12);
        break;
      case 'door':
        chime([261.63, 329.63, 392.0, 523.25], 0.1, 0.45, 'triangle', 0.15);
        break;
      case 'firework':
        chime([330, 523.25, 783.99, 1174.66, 1567.98], 0.03, 0.45, 'sawtooth', 0.09);
        break;
    }
  }
}

export const soundEngine = new PrincessSoundEngine();
