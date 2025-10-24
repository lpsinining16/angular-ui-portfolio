import { Injectable, signal, PLATFORM_ID, Inject, WritableSignal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type SoundType =
  | 'click'
  | 'clickClose'
  | 'clickError'
  | 'clickHover'
  | 'clickInvalid'
  | 'clickSounds'
  | 'hoverBubbles'
  | 'hoverBubbles2'
  | 'clickSpecial'
  | 'clickThemeSwitcher';

@Injectable({ providedIn: 'root' })
export class SoundService {
  private readonly isBrowser: boolean;
  private audioCache = new Map<SoundType, HTMLAudioElement>();

  readonly isMuted = signal<boolean>(true);
  readonly volume: WritableSignal<number> = signal<number>(1);

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
    const storedVolume = localStorage.getItem('volume');
    if (storedVolume !== null) {
      this.volume.set(parseFloat(storedVolume));
    } else {
      this.volume.set(1);
    }
  }

  private preloadSounds(): void {
    // FIX: Restored the full list of sounds to be preloaded.
    const sounds: Record<SoundType, string> = {
      click: '/sounds/click.wav',
      clickClose: '/sounds/click-close.wav',
      clickError: '/sounds/click-error.wav',
      clickHover: '/sounds/click-hover.wav',
      clickInvalid: '/sounds/click-invalid.wav',
      clickSounds: '/sounds/click-sounds.wav',
      hoverBubbles: '/sounds/hover-bubbles.wav',
      hoverBubbles2: '/sounds/hover-bubbles2.wav',
      clickSpecial: '/sounds/click-special.mp3',
      clickThemeSwitcher: '/sounds/click-theme-switcher.wav',
    };

    for (const key in sounds) {
      const type = key as SoundType;
      const audio = new Audio(sounds[type]);
      audio.load();
      audio.volume = this.volume();
      this.audioCache.set(type, audio);
    }
  }

  private listenForFirstInteraction(): void {
    const events: (keyof DocumentEventMap)[] = ['click', 'keydown', 'touchstart'];
    const listener = () => {
      this.userHasInteracted = true;
      const storedMuteState = localStorage.getItem('isMuted');
      if (storedMuteState === 'false' || storedMuteState === null) {
        this.isMuted.set(false);
        localStorage.setItem('isMuted', 'false');
        this.playSound('clickSounds');
      }
      events.forEach((e) => document.removeEventListener(e, listener));
    };
    events.forEach((e) => document.addEventListener(e, listener, { once: true }));
  }

  playSound(soundType: SoundType): void {
    if (!this.isBrowser || this.isMuted() || !this.userHasInteracted) {
      return;
    }
    const audio = this.audioCache.get(soundType);
    if (audio) {
      const audioInstance = audio.cloneNode() as HTMLAudioElement;
      audioInstance.currentTime = 0;
      audioInstance.volume = this.volume();
      audioInstance
        .play()
        .catch((error) => console.error(`Error playing sound: ${soundType}`, error));
    }
  }

  toggleMute(): void {
    if (!this.isBrowser) return;
    this.isMuted.update((currentlyMuted) => {
      const newMutedState = !currentlyMuted;
      localStorage.setItem('isMuted', String(newMutedState));
      if (!newMutedState) {
        this.playSound('clickSounds');
      }
      return newMutedState;
    });
  }

  setVolume(newVolume: number): void {
    if (!this.isBrowser) return;
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    this.volume.set(clampedVolume);
    localStorage.setItem('volume', String(clampedVolume));
    this.audioCache.forEach((audio) => {
      audio.volume = clampedVolume;
    });
    if (clampedVolume > 0 && this.isMuted()) {
      this.isMuted.set(false);
      localStorage.setItem('isMuted', 'false');
    } else if (clampedVolume === 0 && !this.isMuted()) {
      this.isMuted.set(true);
      localStorage.setItem('isMuted', 'true');
    }
  }
}
