import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
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
  },
})
export class Career {
  private readonly api = inject(ApiService);
  private readonly sound = inject(SoundService);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // --- State ---
  profile = this.api.profile;
  workExperience = this.api.workExperience;
  isModalOpen = signal(false);
  selectedJobIndex = signal(0);

  // --- UI Elements ---
  @ViewChild('modalContainer') modalContainer?: ElementRef<HTMLElement>;
  @ViewChild('closeModalButton') closeModalButton?: ElementRef<HTMLElement>;

  // --- Event Handlers ---
  onEscapeKey(): void {
    if (this.isModalOpen()) {
      this.closeModal();
    }
  }

  // --- Modal Logic ---
  public openModal(): void {
    this.isModalOpen.set(true);
    if (this.isBrowser) {
      this.document.body.style.overflow = 'hidden';
      setTimeout(() => this.closeModalButton?.nativeElement.focus(), 0);
    }
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    if (this.isBrowser) {
      this.document.body.style.overflow = '';
    }
    this.selectedJobIndex.set(0);
  }

  downloadCV(): void {
    if (this.isBrowser) {
      window.open(this.profile().cvUrl, '_blank');
    }
  }

  // --- Card Stack & Job Navigation ---
  private lastWheelTime = 0;

  handleWheel(event: WheelEvent): void {
    event.preventDefault();
    const now = Date.now();
    if (now - this.lastWheelTime < 300) return; // Throttle
    this.lastWheelTime = now;

    if (event.deltaY < 0) {
      this.previousJob();
    } else {
      this.nextJob();
    }
  }

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

  getCardStyles(index: number): Record<string, string> {
    const total = this.workExperience().length;
    const selected = this.selectedJobIndex();
    const relIndex = (index - selected + total) % total;

    if (relIndex > 3) return { opacity: '0', pointerEvents: 'none', visibility: 'hidden' };

    const translateY = relIndex * 24;
    const scale = 1 - relIndex * 0.04;
    const opacity = relIndex === 0 ? 1 : Math.max(0.4, 1 - relIndex * 0.3);
    const zIndex = total - relIndex;

    return {
      transform: `translate3d(0, ${translateY}px, -${relIndex}px) scale(${scale})`,
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
}
