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

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private isBrowser: boolean;
  private audioCache = new Map<SoundType, HTMLAudioElement>();

  isMuted = signal<boolean>(true); // Start muted to comply with browser autoplay policies
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

    // Always start muted for UI (browser autoplay policy workaround).
    // The actual user preference (or default unmuted) will be applied after first interaction.
    this.isMuted.set(true);

    // Load stored volume or default to 1
    if (storedVolume !== null) {
      this.volume.set(parseFloat(storedVolume));
    } else {
      this.volume.set(1); // Default to full volume
      localStorage.setItem('volume', '1');
    }
  }

  private preloadSounds(): void {
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
      // Apply the *current* volume setting (which is 1 initially if no stored volume)
      audio.volume = this.volume();
      this.audioCache.set(type, audio);
    }
  }

  private listenForFirstInteraction(): void {
    const events: (keyof DocumentEventMap)[] = ['click', 'keydown', 'touchstart'];
    const listener = () => {
      this.userHasInteracted = true;
      console.log('User interacted, audio unlocked!');

      // Check user's stored preference
      const storedMuteState = localStorage.getItem('isMuted');

      if (storedMuteState === null || storedMuteState === 'false') {
        // If no preference stored OR preference was explicitly 'false' (unmuted),
        // then unmute and play a sound.
        this.isMuted.set(false);
        localStorage.setItem('isMuted', 'false'); // Persist this new default
        this.playSound('clickSounds'); // Provide audio feedback for unmuting
      } else {
        // If storedMuteState is 'true', keep it muted.
        this.isMuted.set(true);
      }

      // Apply the current volume (from localStorage or default) to all audio elements
      this.audioCache.forEach((audio) => {
        audio.volume = this.volume();
        // If unmuted, try to play a silent sound to ensure context is fully unlocked for future plays
        if (!this.isMuted()) {
          audio.muted = false; // Ensure audio element is not muted
          audio
            .play()
            .catch((e) =>
              console.log(
                'Silent play for audio context failed (expected for non-user-initiated):',
                e
              )
            );
        }
      });

      events.forEach((e) => document.removeEventListener(e, listener));
    };
    events.forEach((e) => document.addEventListener(e, listener, { once: true }));
  }

  playSound(soundType: SoundType): void {
    if (!this.isBrowser || this.isMuted()) {
      return;
    }

    if (!this.userHasInteracted) {
      console.warn(`Sound "${soundType}" skipped: No direct user interaction yet.`);
      return;
    }

    const audio = this.audioCache.get(soundType);
    if (audio) {
      const audioInstance = audio.cloneNode() as HTMLAudioElement;
      audioInstance.currentTime = 0;
      audioInstance.volume = this.volume();
      // Ensure audio element itself isn't muted
      audioInstance.muted = false;
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
        // If muting: store current volume, then set volume to 0 (which will implicitly mute in setVolume)
        if (this.volume() > 0) {
          localStorage.setItem('previousVolumeBeforeMute', String(this.volume()));
        }
        this.setVolume(0); // This will update the volume signal and also set isMuted to true
      } else {
        // If unmuting: restore previous volume or default to 1
        const storedPreviousVolume = localStorage.getItem('previousVolumeBeforeMute');
        const restoredVolume = storedPreviousVolume ? parseFloat(storedPreviousVolume) : 1;
        this.setVolume(restoredVolume); // This will update the volume signal and also set isMuted to false
        if (this.userHasInteracted) {
          this.playSound('clickSounds');
        }
      }
      return newMutedState; // Return the new mute state
    });
  }

  setVolume(newVolume: number): void {
    if (!this.isBrowser) return;
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    this.volume.set(clampedVolume);
    localStorage.setItem('volume', String(clampedVolume));

    // Update all cached audio elements with the new volume
    this.audioCache.forEach((audio) => {
      audio.volume = clampedVolume;
    });

    // Logic to sync mute state with volume slider
    if (clampedVolume > 0 && this.isMuted()) {
      // If volume is set above 0 and was muted, unmute it.
      this.isMuted.set(false);
      localStorage.setItem('isMuted', 'false');
    } else if (clampedVolume === 0 && !this.isMuted()) {
      // If volume is set to 0 and was not muted, mute it.
      this.isMuted.set(true);
      localStorage.setItem('isMuted', 'true');
    }
  }
}
