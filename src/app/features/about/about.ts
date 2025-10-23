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
  ViewChildren,
} from '@angular/core';
import { ApiService, WorkExperience } from '../../core/services/api';
import { SoundService } from '../../core/services/sound';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onWindowScroll()',
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
  scrollProgress = signal(0);

  // --- Computed Derived State ---
  aboutParagraphs = computed(() => this.profile().about.split('\n\n'));

  currentJobYears = computed(() => {
    const devJobs = this.workExperience().filter((job) => job.isDevRole);
    if (devJobs.length === 0) return 0;
    // Assuming the last item in the filtered list is the oldest
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

  // --- UI Elements ---
  animatedDots = new Array(20); // Fixed size for template loop
  @ViewChildren('statRef') statElements!: QueryList<ElementRef<HTMLElement>>;
  private observer?: IntersectionObserver;

  constructor() {
    // safely initialize browser-only features after first render
    afterNextRender(() => {
      this.initIntersectionObserver();
      // Initial scroll progress calculation
      this.onWindowScroll();
    });
  }

  // --- Event Handlers (Host) ---
  onWindowScroll(): void {
    if (!this.isBrowser) return;
    const winScroll = this.document.body.scrollTop || this.document.documentElement.scrollTop;
    const height =
      this.document.documentElement.scrollHeight - this.document.documentElement.clientHeight;
    if (height > 0) {
      this.scrollProgress.set((winScroll / height) * 100);
    }
  }

  onEscapeKey(): void {
    if (this.isModalOpen()) {
      this.closeModal();
    }
  }

  // --- Modal & Navigation ---
  openModal(): void {
    this.isModalOpen.set(true);
    if (this.isBrowser) this.document.body.style.overflow = 'hidden';
    this.sound.playSound('clickHover');
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    if (this.isBrowser) this.document.body.style.overflow = '';
    this.selectedJobIndex.set(0); // Reset stack on close
  }

  selectJob(index: number): void {
    if (this.selectedJobIndex() !== index) {
      this.sound.playSound('clickHover');
      this.selectedJobIndex.set(index);
    }
  }

  downloadCV(): void {
    if (this.isBrowser) {
      window.open(this.profile().cvUrl, '_blank');
    }
  }

  // --- Card Stack Logic ---
  private lastWheelTime = 0;

  handleWheel(event: WheelEvent): void {
    event.preventDefault();
    const now = Date.now();
    if (now - this.lastWheelTime < 300) return; // Throttled to 300ms
    this.lastWheelTime = now;

    const current = this.selectedJobIndex();
    const total = this.workExperience().length;

    // Circular Navigation
    if (event.deltaY < 0) {
      // Scroll Up: go previous or wrap to last
      this.selectJob(current > 0 ? current - 1 : total - 1);
    } else {
      // Scroll Down: go next or wrap to first
      this.selectJob(current < total - 1 ? current + 1 : 0);
    }
  }

  getCardStyles(index: number): Record<string, string> {
    const total = this.workExperience().length;
    const selected = this.selectedJobIndex();
    // Calculate relative position in the circular stack (0 is active)
    const relIndex = (index - selected + total) % total;

    // Performance optimization: hide cards deep in stack
    if (relIndex > 3) return { opacity: '0', pointerEvents: 'none', visibility: 'hidden' };

    const translateY = relIndex * 24; // 24px vertical stack spacing
    const scale = 1 - relIndex * 0.04; // Slight scale down for depth
    const opacity = relIndex === 0 ? 1 : Math.max(0.4, 1 - relIndex * 0.3); // Fade out background cards
    const zIndex = total - relIndex;

    return {
      transform: `translate3d(0, ${translateY}px, -${relIndex}px) scale(${scale})`,
      opacity: opacity.toString(),
      zIndex: zIndex.toString(),
    };
  }

  // --- Stats Animation ---
  private initIntersectionObserver(): void {
    if (!('IntersectionObserver' in window)) return;

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
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function for smoother finish (easeOutQuart)
      const easedProgress = 1 - Math.pow(1 - progress, 4);

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
