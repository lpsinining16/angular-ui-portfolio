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
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SoundService } from '../../../core/services/sound';

@Component({
  selector: 'app-volume-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './volume-control.html',
  styleUrls: ['./volume-control.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeControl {
  /** Input to know if the parent header is in its shrunk state. */
  isShrunk = input(false);

  // --- SERVICE INJECTIONS ---
  readonly soundService = inject(SoundService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  // --- STATE SIGNALS ---
  private readonly isHovering = signal(false);
  private readonly isDragging = signal(false);

  /** Responsive check for small viewports. */
  private readonly isMobile = toSignal(
    this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(map((result) => result.matches)),
    { initialValue: false }
  );

  // --- COMPUTED SIGNALS ---
  /** Determines if the volume slider should be visible. */
  readonly isSliderVisible = computed(() => {
    // Never show the slider if the header is shrunk
    if (this.isShrunk()) return false;

    // Always hide slider if globally muted
    if (this.soundService.isMuted()) return false;

    // On mobile, the slider is always visible when unmuted
    if (this.isMobile()) return true;

    // On desktop, show on hover or while dragging the slider
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
