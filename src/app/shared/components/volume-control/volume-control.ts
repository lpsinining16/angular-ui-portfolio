import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  PLATFORM_ID,
  WritableSignal,
  computed,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SoundService } from '../../../core/services/sound';

@Component({
  selector: 'app-volume-control',
  imports: [CommonModule, FormsModule],
  templateUrl: './volume-control.html',
  styleUrl: './volume-control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeControl {
  soundService = inject(SoundService);
  private platformId = inject(PLATFORM_ID);

  isHoveringIconOrSlider = signal(false);
  isDraggingSlider = signal(false);
  isMobileDevice: WritableSignal<boolean> = signal(false);

  isSliderVisible = computed(() => {
    if (this.isMobileDevice()) {
      return !this.soundService.isMuted();
    }
    return (
      (!this.soundService.isMuted() && this.isHoveringIconOrSlider()) ||
      this.isDraggingSlider() ||
      (!this.soundService.isMuted() && this.soundService.volume() > 0)
    );
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkIsMobile();
      window.addEventListener('resize', () => this.checkIsMobile());
    }

    effect(() => {
      if (
        !this.isMobileDevice() &&
        !this.soundService.isMuted() &&
        this.soundService.volume() > 0 &&
        !this.isDraggingSlider()
      ) {
        this.isHoveringIconOrSlider.set(true);
      } else if (
        !this.isMobileDevice() &&
        this.soundService.isMuted() &&
        !this.isDraggingSlider()
      ) {
        this.isHoveringIconOrSlider.set(false);
      }
    });
  }

  private checkIsMobile(): void {
    this.isMobileDevice.set(window.innerWidth < 768);
  }

  onVolumeChange(newVolume: number): void {
    this.soundService.setVolume(newVolume);
  }

  toggleMuteAndVolume(): void {
    this.soundService.toggleMute();
  }

  // Called when mouse enters either the icon or the slider area
  showSlider(): void {
    if (!this.isMobileDevice() && !this.soundService.isMuted()) {
      this.isHoveringIconOrSlider.set(true);
    }
  }

  // Called when mouse leaves either the icon or the slider area
  hideSlider(): void {
    if (!this.isMobileDevice()) {
      // Only set hovering to false if not currently dragging the slider
      if (!this.isDraggingSlider()) {
        this.isHoveringIconOrSlider.set(false);
      }
    }
  }

  startDragging(): void {
    if (!this.isMobileDevice()) {
      this.isDraggingSlider.set(true);
    }
  }

  stopDragging(): void {
    if (!this.isMobileDevice()) {
      this.isDraggingSlider.set(false);
      // Immediately re-evaluate hover state after drag stops
      // If mouse is no longer over the component, it should hide
      // If the mouse is still over the icon, for example, it will remain true
      if (!this.isHoveringIconOrSlider() && !this.soundService.isMuted()) {
        // Trigger a re-evaluation of visibility based on current mouse position
        // If the mouse has left the overall component, isHoveringIconOrSlider will already be false,
        // and the computed signal will then hide the slider.
      }
    }
  }
}
