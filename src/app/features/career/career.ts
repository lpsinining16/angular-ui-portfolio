import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { ApiService } from '../../core/services/api';
import { SoundService } from '../../core/services/sound';

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './career.html',
  styleUrl: './career.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscapeKey()',
    '(document:keydown.arrowleft)': 'onArrowKey("left")',
    '(document:keydown.arrowright)': 'onArrowKey("right")',
  },
})
export class Career {
  private readonly api = inject(ApiService);
  private readonly sound = inject(SoundService);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private isMobile = false; // For responsive card styles

  // --- State ---
  profile = this.api.profile;
  workExperience = this.api.workExperience;
  isModalOpen = signal(false);
  selectedJobIndex = signal(0);

  // --- Touch & Wheel State ---
  private touchStartY = 0;
  private touchMoveY = 0;
  private lastWheelTime = 0;

  // --- UI Elements ---
  @ViewChild('modalContainer') modalContainer?: ElementRef<HTMLElement>;
  @ViewChild('closeModalButton') closeModalButton?: ElementRef<HTMLElement>;

  constructor() {
    // Set initial state on component load
    this.updateMobileState();
  }

  // --- 3. ADD HostListener for window resize ---
  @HostListener('window:resize')
  onResize() {
    // Update state whenever window resizes
    this.updateMobileState();
  }

  // --- Event Handlers ---
  onEscapeKey(): void {
    if (this.isModalOpen()) {
      this.closeModal();
    }
  }

  /** Handle Arrow Key navigation */
  onArrowKey(direction: 'left' | 'right'): void {
    if (!this.isModalOpen()) return; // Only navigate if modal is open

    if (direction === 'left') {
      this.previousJob();
    } else {
      this.nextJob();
    }
  }

  /** Record the start of a touch event */
  handleTouchStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0].clientY;
  }

  /** Handle swipe navigation for mobile */
  handleTouchMove(event: TouchEvent): void {
    if (!this.touchStartY) return;
    this.touchMoveY = event.touches[0].clientY;
    const deltaY = this.touchMoveY - this.touchStartY;

    // Threshold to prevent accidental swipes
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        // Swiping down
        this.previousJob();
      } else {
        // Swiping up
        this.nextJob();
      }
      this.touchStartY = 0; // Reset after swipe
    }
  }

  /** Handle scroll wheel navigation */
  handleWheel(event: WheelEvent): void {
    event.preventDefault();
    const now = Date.now();
    // Throttle wheel events
    if (now - this.lastWheelTime < 300) return;
    this.lastWheelTime = now;

    if (event.deltaY < 0) {
      // Scrolling up
      this.previousJob();
    } else {
      // Scrolling down
      this.nextJob();
    }
  }

  // --- Modal Logic ---
  public openModal(): void {
    this.isModalOpen.set(true);
    if (this.isBrowser) {
      this.document.body.style.overflow = 'hidden';
      // 5. UPDATE openModal to use the new method
      this.updateMobileState(); // Ensure state is correct on open
      setTimeout(() => this.closeModalButton?.nativeElement.focus(), 0);
    }
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    if (this.isBrowser) {
      this.document.body.style.overflow = '';
    }
    this.selectedJobIndex.set(0);
    // We no longer need to reset isMobile here,
    // the constructor and resize listener will keep it in sync.
  }

  downloadCV(): void {
    if (this.isBrowser) {
      window.open(this.profile().cvUrl, '_blank');
    }
  }

  // --- Card Stack & Job Navigation ---
  selectJob(index: number): void {
    if (this.selectedJobIndex() !== index) {
      this.sound.playSound('clickHover');
      this.selectedJobIndex.set(index);
    }
  }

  nextJob(): void {
    const current = this.selectedJobIndex();
    const total = this.workExperience().length;
    this.selectJob(current < total - 1 ? current + 1 : 0);
  }

  previousJob(): void {
    const current = this.selectedJobIndex();
    const total = this.workExperience().length;
    this.selectJob(current > 0 ? current - 1 : total - 1);
  }

  /**
   * Generates the 3D stack styles for each card.
   * Uses translateX on mobile and translateY on desktop.
   */
  getCardStyles(index: number): Record<string, string> {
    const total = this.workExperience().length;
    const selected = this.selectedJobIndex();
    const relIndex = (index - selected + total) % total;

    // Hide cards that are too deep in the stack
    if (relIndex > 3) return { opacity: '0', pointerEvents: 'none', visibility: 'hidden' };

    const scale = 1 - relIndex * 0.04;
    const opacity = relIndex === 0 ? 1 : Math.max(0.4, 1 - relIndex * 0.3);
    const zIndex = total - relIndex;

    let transform = '';

    // Apply different translation direction based on viewport
    // This will now dynamically update if the user resizes the window
    if (this.isMobile) {
      const translateX = relIndex * 24; // Use translateX for mobile
      transform = `translate3d(${translateX}px, 0, -${relIndex}px) scale(${scale})`;
    } else {
      const translateY = relIndex * 24; // Use translateY for desktop
      transform = `translate3d(0, ${translateY}px, -${relIndex}px) scale(${scale})`;
    }

    return {
      transform,
      opacity: opacity.toString(),
      zIndex: zIndex.toString(),
    };
  }

  formatJobDuration(duration: string): string {
    if (!duration) return '';
    const parts = duration.split(' - ');
    const formatDate = (dateStr: string) => {
      if (!dateStr || dateStr.toLowerCase() === 'present') return 'Present';
      const date = new Date(dateStr + 'T00:00:00');
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };
    return `${formatDate(parts[0])} - ${formatDate(parts[1])}`;
  }

  // --- Accessibility: Modal Focus Trapping ---
  handleModalKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !this.modalContainer) return;

    const focusableElements = this.modalContainer.nativeElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (this.document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else {
      if (this.document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  }

  // --- ADD the new private method ---
  private updateMobileState(): void {
    if (this.isBrowser) {
      this.isMobile = window.innerWidth < 768;
    }
  }
}
