import { CommonModule, DOCUMENT, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  PLATFORM_ID,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ApiService } from '../../core/services/api';
import { SoundService } from '../../core/services/sound';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscapeKey()',
  },
})
export class About {
  private readonly api = inject(ApiService);
  private readonly sound = inject(SoundService);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // --- Signals for State ---
  profile = this.api.profile;
  workExperience = this.api.workExperience;
  isModalOpen = signal(false);
  selectedJobIndex = signal(0);

  // --- UI Elements ---
  @ViewChildren('statRef') statElements!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('modalContainer') modalContainer?: ElementRef<HTMLElement>;
  @ViewChild('closeModalButton') closeModalButton?: ElementRef<HTMLElement>;
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      if (this.isBrowser) {
        this.initIntersectionObserver();
      }
    });
  }

  // --- Computed Derived State ---
  aboutParagraphs = computed(() => {
    const { about, about2, about3 } = this.profile();
    return [about, about2, about3].filter(Boolean);
  });

  currentJobYears = computed(() => {
    const devJobs = this.workExperience().filter((job) => job.isDevRole);
    if (devJobs.length === 0) return 0;
    const firstDevJob = devJobs[devJobs.length - 1];
    const startDate = new Date(firstDevJob.duration.split(' - ')[0]);
    if (isNaN(startDate.getTime())) return 0;
    const diffTime = Math.abs(new Date().getTime() - startDate.getTime());
    return diffTime / (1000 * 60 * 60 * 24 * 365.25);
  });

  professionalProjectsCount = computed(() =>
    this.api
      .projects()
      .filter((p) => p.type === 'professional')
      .reduce((acc, curr) => acc + curr.systems.length, 0)
  );

  personalProjectsCount = computed(() =>
    this.api
      .projects()
      .filter((p) => p.type === 'personal')
      .reduce((acc, curr) => acc + curr.systems.length, 0)
  );

  // --- Event Handlers ---
  onEscapeKey(): void {
    if (this.isModalOpen()) {
      this.closeModal();
    }
  }

  // --- Modal Logic ---
  // For larger applications, consider extracting modal logic and template
  // into a dedicated, reusable standalone component. This would improve
  // modularity and separation of concerns.

  openModal(): void {
    this.isModalOpen.set(true);
    this.sound.playSound('clickHover');
    if (this.isBrowser) {
      this.document.body.style.overflow = 'hidden';
      // Set focus to the close button after the modal is rendered
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
    // Position cards in a circle, so wrapping around feels natural
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
      // If shift + tab is pressed on the first element, move focus to the last
      if (this.document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else {
      // If tab is pressed on the last element, move focus to the first
      if (this.document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  }

  // --- Stats Animation Logic ---
  private initIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            this.animateStat(el);
            this.observer?.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    this.statElements.forEach((el) => this.observer?.observe(el.nativeElement));
  }

  private animateStat(el: HTMLElement): void {
    const targetStr = el.dataset['target'];
    if (!targetStr) return;

    const target = parseFloat(targetStr);
    const isFloat = targetStr.includes('.');
    const duration = 2000;
    let startTime: number | null = null;

    const step = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      const currentVal = easedProgress * target;
      el.innerText = isFloat ? currentVal.toFixed(1) : Math.floor(currentVal).toString();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.innerText = isFloat ? target.toFixed(1) : target.toString();
      }
    };
    requestAnimationFrame(step);
  }
}
