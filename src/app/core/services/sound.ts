import { Injectable, signal, PLATFORM_ID, Inject, WritableSignal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type SoundType =
  | 'appear'
  | 'click'
  | 'clickClose'
  | 'clickError'
  | 'clickHover'
  | 'clickInvalid'
  | 'clickSounds'
  | 'hoverBubbles'
  | 'hoverBubbles2'
  | 'clickThemeSwitcher';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private isBrowser: boolean;
  private audioCache = new Map<SoundType, HTMLAudioElement>();

  isMuted = signal<boolean>(true); // NEW: Default to true (muted) initially
  volume: WritableSignal<number> = signal<number>(1);
  private userHasInteracted = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadInitialState();
      this.preloadSounds();
      this.listenForFirstInteraction();
    }
  }

  private loadInitialState(): void {
    const storedMuteState = localStorage.getItem('isMuted');
    const storedVolume = localStorage.getItem('volume');

    // NEW: On initial load, we always START muted.
    // The actual preference from localStorage will be applied AFTER first interaction.
    this.isMuted.set(true); // Force muted state initially for UI and functionality

    // Load stored volume or default to 1 (full volume)
    if (storedVolume !== null) {
      this.volume.set(parseFloat(storedVolume));
    } else {
      this.volume.set(1); // Default to full volume
      localStorage.setItem('volume', '1'); // Store default if not present
    }

    // Ensure mute state aligns with volume 0 on load if volume was previously saved as 0.
    // This is a subtle point, if a user saved volume 0, the UI should reflect muted.
    // This might be redundant now with the forced `isMuted.set(true)` above, but keep for robustness.
    if (this.volume() === 0 && !this.isMuted()) {
      // This condition will likely be false now due to forced mute
      this.isMuted.set(true);
      localStorage.setItem('isMuted', 'true');
    }
  }

  private preloadSounds(): void {
    const sounds: Record<SoundType, string> = {
      appear: '/sounds/appear.wav',
      click: '/sounds/click.wav',
      clickClose: '/sounds/click-close.wav',
      clickError: '/sounds/click-error.wav',
      clickHover: '/sounds/click-hover.wav',
      clickInvalid: '/sounds/click-invalid.wav',
      clickSounds: '/sounds/click-sounds.wav',
      hoverBubbles: '/sounds/hover-bubbles.wav',
      hoverBubbles2: '/sounds/hover-bubbles2.wav',
      clickThemeSwitcher: '/sounds/click-theme-switcher.wav',
    };

    for (const key in sounds) {
      const type = key as SoundType;
      const audio = new Audio(sounds[type]);
      audio.load();
      audio.volume = this.volume(); // Apply initial volume to preloaded sounds
      this.audioCache.set(type, audio);
    }
  }

  private listenForFirstInteraction(): void {
    const events: (keyof DocumentEventMap)[] = ['click', 'keydown', 'touchstart'];
    const listener = () => {
      this.userHasInteracted = true;
      console.log('User interacted, audio unlocked!');

      // NEW: After the first interaction, apply the user's *actual* stored preference.
      const storedMuteState = localStorage.getItem('isMuted');
      if (storedMuteState === 'false') {
        // User previously preferred unmuted
        this.isMuted.set(false);
        this.playSound('clickSounds'); // Provide audio feedback for unmuting
      } else if (storedMuteState === 'true') {
        // User previously preferred muted
        this.isMuted.set(true); // Keep it muted
      } else {
        // No stored preference, default to unmuted after first interaction
        this.isMuted.set(false);
        localStorage.setItem('isMuted', 'false'); // Save this as the new preference
        this.playSound('clickSounds'); // Provide audio feedback for unmuting
      }

      events.forEach((e) => document.removeEventListener(e, listener));
    };
    events.forEach((e) => document.addEventListener(e, listener, { once: true }));
  }

  playSound(soundType: SoundType): void {
    // Check for isBrowser and if currently muted
    if (!this.isBrowser || this.isMuted()) {
      return;
    }

    // Prevent play if no user interaction yet (browser autoplay policy)
    if (!this.userHasInteracted) {
      console.warn(`Sound "${soundType}" skipped: No direct user interaction yet.`);
      return;
    }

    const audio = this.audioCache.get(soundType);
    if (audio) {
      const audioInstance = audio.cloneNode() as HTMLAudioElement;
      audioInstance.currentTime = 0;
      audioInstance.volume = this.volume();
      audioInstance.play().catch((error) => {
        console.error(`Error playing sound: ${soundType}`, error);
      });
    }
  }

  toggleMute(): void {
    if (!this.isBrowser) return;

    this.isMuted.update((muted) => {
      const newMutedState = !muted;
      localStorage.setItem('isMuted', String(newMutedState));

      if (newMutedState) {
        // If muting
        if (this.volume() > 0) {
          localStorage.setItem('previousVolumeBeforeMute', String(this.volume()));
        }
        this.setVolume(0); // Set volume to 0 when muted via toggle
      } else {
        // If unmuting
        const storedPreviousVolume = localStorage.getItem('previousVolumeBeforeMute');
        const restoredVolume = storedPreviousVolume ? parseFloat(storedPreviousVolume) : 1;
        this.setVolume(restoredVolume);
        if (this.userHasInteracted) {
          // Only play feedback if audio is unlocked
          this.playSound('clickSounds');
        }
      }

      return newMutedState;
    });
  }

  setVolume(newVolume: number): void {
    if (!this.isBrowser) return;
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    this.volume.set(clampedVolume);
    localStorage.setItem('volume', String(clampedVolume));

    // Logic to sync mute state with volume slider
    if (clampedVolume > 0 && this.isMuted()) {
      const storedMuteState = localStorage.getItem('isMuted');
      // Unmute if user slides up from 0 and it was muted by default or explicitly muted
      if (storedMuteState === null || storedMuteState === 'true') {
        this.isMuted.set(false);
        localStorage.setItem('isMuted', 'false');
      }
    } else if (clampedVolume === 0 && !this.isMuted()) {
      // Mute if user slides to 0 and it was not already muted
      this.isMuted.set(true);
      localStorage.setItem('isMuted', 'true');
    }
  }
}
