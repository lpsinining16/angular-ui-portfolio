import { Injectable, signal, PLATFORM_ID, Inject } from '@angular/core';
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

  isMuted = signal<boolean>(false); // Initialize to false, will be overridden by loadInitialState
  private userHasInteracted = false; // Flag to track user interaction

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

    // If no stored state, or if stored state is 'false', we initially set to true (muted)
    // because we haven't had user interaction yet.
    // This state will be updated upon first interaction.
    if (storedMuteState === null) {
      this.isMuted.set(true); // Default to muted until interaction
    } else {
      // If there's a stored state, respect it.
      this.isMuted.set(storedMuteState === 'true');
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
      this.audioCache.set(type, audio);
    }
  }

  private listenForFirstInteraction(): void {
    const events: (keyof DocumentEventMap)[] = ['click', 'keydown', 'touchstart'];
    const listener = () => {
      this.userHasInteracted = true;
      console.log('User interacted, audio unlocked!');

      // Only unmute if the user hasn't explicitly muted it before
      // and it's currently showing as muted (which it would be by default)
      if (this.isMuted()) {
        const storedMuteState = localStorage.getItem('isMuted');
        // If there was no stored mute state (meaning we defaulted to muted),
        // or if the stored state was 'false' (meaning user previously preferred unmuted),
        // then unmute it now.
        if (storedMuteState === null || storedMuteState === 'false') {
          this.isMuted.set(false);
          localStorage.setItem('isMuted', 'false'); // Persist the unmuted state
          this.playSound('clickSounds'); // Optional: Play a sound to confirm unmuting
        }
      }

      events.forEach(e => document.removeEventListener(e, listener));
    };
    events.forEach(e => document.addEventListener(e, listener, { once: true }));
  }

  playSound(soundType: SoundType): void {
    if (!this.isBrowser || this.isMuted()) {
      return;
    }

    // This check is now less about "NotAllowedError" and more about intent,
    // as we default to muted until interaction. If isMuted() is false,
    // it implies userHasInteracted is true or a prior preference was saved.
    // However, it's still a good safeguard.
    if (!this.userHasInteracted && !this.isMuted()) {
       console.warn(`Sound "${soundType}" skipped: No direct user interaction yet, and sound isn't explicitly unmuted.`);
       return;
    }


    const audio = this.audioCache.get(soundType);
    if (audio) {
      const audioInstance = audio.cloneNode() as HTMLAudioElement;
      audioInstance.currentTime = 0;
      audioInstance.play().catch((error) => {
        // This catch block is for unexpected errors, as NotAllowedError should
        // ideally be prevented by the `isMuted` and `userHasInteracted` logic.
        console.error(`Error playing sound: ${soundType}`, error);
      });
    }
  }

  toggleMute(): void {
    if (!this.isBrowser) return;

    this.isMuted.update((muted) => {
      const newMutedState = !muted;
      localStorage.setItem('isMuted', String(newMutedState));

      // Play sound only when unmuting
      if (!newMutedState) {
        // Since toggleMute is a direct user action, we can assume interaction has occurred
        // for the purpose of playing the 'clickSounds' feedback.
        this.playSound('clickSounds');
      }

      return newMutedState;
    });
  }
}