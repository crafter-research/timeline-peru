/**
 * Sound Manager for Timeline Interactions
 * Handles audio feedback with user preferences
 */

export type SoundType = 'click' | 'whoosh' | 'success' | 'error' | 'celebration';

interface SoundConfig {
  volume: number;
  playbackRate: number;
}

class SoundManager {
  private enabled: boolean = false;
  private sounds: Map<SoundType, SoundConfig> = new Map();
  private audioContext: AudioContext | null = null;

  constructor() {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      this.enabled = localStorage.getItem('timeline-audio-enabled') === 'true';
    }

    // Define sound configurations
    this.sounds.set('click', { volume: 0.3, playbackRate: 1.0 });
    this.sounds.set('whoosh', { volume: 0.2, playbackRate: 1.2 });
    this.sounds.set('success', { volume: 0.4, playbackRate: 1.0 });
    this.sounds.set('error', { volume: 0.3, playbackRate: 0.9 });
    this.sounds.set('celebration', { volume: 0.5, playbackRate: 1.0 });
  }

  /**
   * Enable or disable sound effects
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('timeline-audio-enabled', enabled.toString());
    }
  }

  /**
   * Check if sounds are enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Initialize Web Audio API context
   */
  private initAudioContext(): void {
    if (!this.audioContext && typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Play a click sound using Web Audio API
   */
  playClick(): void {
    if (!this.enabled) return;
    this.initAudioContext();
    if (!this.audioContext) return;

    const config = this.sounds.get('click')!;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Short click sound
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(config.volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }

  /**
   * Play a whoosh sound (for transitions)
   */
  playWhoosh(): void {
    if (!this.enabled) return;
    this.initAudioContext();
    if (!this.audioContext) return;

    const config = this.sounds.get('whoosh')!;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Swoosh effect
    oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.2);
    oscillator.type = 'sine';

    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    gainNode.gain.setValueAtTime(config.volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  /**
   * Play a success sound
   */
  playSuccess(): void {
    if (!this.enabled) return;
    this.initAudioContext();
    if (!this.audioContext) return;

    const config = this.sounds.get('success')!;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Rising tone
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.15);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(config.volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }

  /**
   * Play an error sound
   */
  playError(): void {
    if (!this.enabled) return;
    this.initAudioContext();
    if (!this.audioContext) return;

    const config = this.sounds.get('error')!;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Falling tone
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.15);
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(config.volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }

  /**
   * Play a celebration sound (multiple tones)
   */
  playCelebration(): void {
    if (!this.enabled) return;
    this.initAudioContext();
    if (!this.audioContext) return;

    const config = this.sounds.get('celebration')!;
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C (major chord)

    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(config.volume * 0.7, this.audioContext!.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.3);

        oscillator.start(this.audioContext!.currentTime);
        oscillator.stop(this.audioContext!.currentTime + 0.3);
      }, index * 80);
    });
  }

  /**
   * Play a generic sound by type
   */
  play(type: SoundType): void {
    switch (type) {
      case 'click':
        this.playClick();
        break;
      case 'whoosh':
        this.playWhoosh();
        break;
      case 'success':
        this.playSuccess();
        break;
      case 'error':
        this.playError();
        break;
      case 'celebration':
        this.playCelebration();
        break;
    }
  }
}

// Singleton instance
export const soundManager = new SoundManager();
