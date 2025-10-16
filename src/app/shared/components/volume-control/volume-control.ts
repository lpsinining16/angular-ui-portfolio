import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
  HostBinding,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SoundService } from '../../../core/services/sound';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-volume-control',
  imports: [CommonModule, FormsModule],
  templateUrl: './volume-control.html',
  styleUrl: './volume-control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeControl {
  isShrunk = input(false);

  // --- SERVICE INJECTIONS ---
  readonly soundService = inject(SoundService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  // --- STATE SIGNALS ---
  private readonly isHovering = signal(false);
  private readonly isDragging = signal(false);

  /** Responsive check for mobile viewport */
  private readonly isMobile = toSignal(
    this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(map((result) => result.matches)),
    { initialValue: false }
  );

  // --- COMPUTED SIGNALS ---
  /** Determines if the volume slider should be visible, simplifying the logic */
  readonly isSliderVisible = computed(() => {
    if (this.isShrunk()) return false; 
    
    if (this.soundService.isMuted()) return false;
    if (this.isMobile()) return true; // Always show on mobile if not muted
    return this.isHovering() || this.isDragging();
  });

  // --- HOST BINDINGS ---
  @HostBinding('class.slider-visible') get sliderVisible() {
    return this.isSliderVisible();
  }

  // --- PUBLIC METHODS ---
  onVolumeChange(newVolume: number): void {
    this.soundService.setVolume(newVolume);
  }

  toggleMute(): void {
    this.soundService.toggleMute();
  }

  // --- EVENT HANDLERS for hover and drag state ---
  onMouseEnter(): void {
    this.isHovering.set(true);
  }
  onMouseLeave(): void {
    this.isHovering.set(false);
  }
  onDragStart(): void {
    this.isDragging.set(true);
  }
  onDragEnd(): void {
    this.isDragging.set(false);
  }
}
