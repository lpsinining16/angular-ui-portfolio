import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ApiService } from '../../core/services/api';

@Component({
  selector: 'app-about',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  apiService = inject(ApiService);
  workExperience = this.apiService.workExperience;
  profile = this.apiService.profile;

  isModalOpen = signal(false);
  selectedJobIndex = signal(0);

  aboutParagraphs = computed(() => {
    return this.profile().about.split('\n\n'); // Split by double newline
  });

  // --- Statistics Calculation ---

  /**
   * Calculates years of experience from a specific start date.
   * Finds the 'Intellicare' job and uses its start date.
   */
  currentJobYears = computed(() => {
    const jobs = this.workExperience();
    // Find the Intellicare job to get the "Nov 2016" start date
    const intellicareJob = jobs.find((job) => job.company.includes('Intellicare'));

    if (!intellicareJob) {
      // Fallback or default
      const presentJob = jobs.find((job) => job.duration.includes('Present'));
      if (!presentJob) return 0;
      const startDate = new Date(presentJob.duration.split(' - ')[0]);
      const now = new Date();
      return (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    }

    // Parse "Nov 2016"
    const [startMonthStr, startYearStr] = intellicareJob.duration.split(' - ')[0].split(' ');
    const monthIndex = new Date(Date.parse(startMonthStr + ' 1, 2000')).getMonth();
    const startDate = new Date(parseInt(startYearStr), monthIndex, 1);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    return diffTime / (1000 * 60 * 60 * 24 * 365.25);
  });

  /**
   * Counts all "systems" within "professional" projects.
   */
  professionalProjectsCount = computed(() => {
    return this.apiService
      .projects()
      .filter((p) => p.type === 'professional')
      .reduce((acc, curr) => acc + curr.systems.length, 0);
  });

  /**
   * Counts all "systems" within "personal" projects.
   */
  personalProjectsCount = computed(() => {
    return this.apiService
      .projects()
      .filter((p) => p.type === 'personal')
      .reduce((acc, curr) => acc + curr.systems.length, 0);
  });

  // --- Statistics Animation ---
  @ViewChildren('statYears, statProfProjects, statPersProjects')
  statElements!: QueryList<ElementRef>;

  private observer?: IntersectionObserver;

  constructor() {
    // Effect to observe elements when they are available
    effect(() => {
      if (this.statElements && this.statElements.length) {
        this.initIntersectionObserver();
      }
    });
  }

  private initIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Trigger when 50% visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const statRef = el.dataset['statRef'];
          let targetValue: number;

          // Determine target value based on the element
          if (statRef === 'statYears') {
            targetValue = this.currentJobYears();
          } else if (statRef === 'statProfProjects') {
            targetValue = this.professionalProjectsCount();
          } else if (statRef === 'statPersProjects') {
            targetValue = this.personalProjectsCount();
          } else {
            return;
          }

          this.animateStat(el.querySelector('span')!, targetValue);
          this.observer?.unobserve(el); // Animate only once
        }
      });
    }, options);

    this.statElements.forEach((el) => {
      this.observer?.observe(el.nativeElement);
    });
  }

  private animateStat(el: HTMLElement, target: number) {
    const duration = 1500; // 1.5 seconds
    const start = 0;
    const isFloat = !Number.isInteger(target);
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentVal = start + progress * (target - start);

      if (isFloat) {
        el.innerText = currentVal.toFixed(1);
      } else {
        el.innerText = Math.floor(currentVal).toString();
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (isFloat) {
          el.innerText = target.toFixed(1);
        } else {
          el.innerText = target.toString();
        }
      }
    };

    requestAnimationFrame(step);
  }

  // --- Animated Dots ---
  // Simple array to loop over for creating dots
  animatedDots = new Array(20);

  // --- Modal Methods ---
  openModal() {
    this.isModalOpen.set(true);
    // Lock body scroll
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen.set(false);
    // Unlock body scroll
    document.body.style.overflow = '';
    // Reset to default job on close
    this.selectedJobIndex.set(0);
  }

  selectJob(index: number) {
    this.selectedJobIndex.set(index);
  }

  downloadCV() {
    window.open(this.apiService.profile().cvUrl, '_blank');
  }

  // --- UPDATED HELPER for Circular Card Logic ---
  /**
   * Calculates the relative index for circular stacking.
   * Maps "dismissed" cards (negative index) to the back of the stack.
   */
  private getCircularRelativeIndex(index: number): number {
    const totalCards = this.workExperience().length;
    if (totalCards === 0) return 0; // Avoid errors if array is empty

    const selected = this.selectedJobIndex();

    // Calculate relative index: (index - selected + totalCards) % totalCards
    // This gives a result from 0 (active) to totalCards - 1 (last card in stack)
    return (index - selected + totalCards) % totalCards;
  }

  // --- UPDATED Card Stack Transform Logic ---
  getCardTransform(index: number): string {
    // Uses the new circular logic
    const relativeIndex = this.getCircularRelativeIndex(index);

    // Active card (relativeIndex = 0)
    if (relativeIndex === 0) {
      return 'translateY(0) scale(1)';
    }

    // Cards stacked behind (or wrapped around)
    const scale = 1 - relativeIndex * 0.05; // Diminish scale for cards further back
    const translateY = relativeIndex * 20; // Stack them downwards
    return `translateY(${translateY}px) scale(${scale})`;
  }

  // --- UPDATED Card Opacity Logic ---
  getCardOpacity(index: number): string {
    // All cards in the circular stack are visible, unless we add a limit
    const relativeIndex = this.getCircularRelativeIndex(index);

    // Optionally hide cards that are too deep in the stack
    if (relativeIndex > 3) {
      // Hides cards after the 3rd one in the stack
      return '0';
    }
    return '1'; // All other cards are visible
  }

  getCardZIndex(index: number): string {
    const totalCards = this.workExperience().length;
    const relativeIndex = this.getCircularRelativeIndex(index);
    return (totalCards - relativeIndex).toString();
  }

  // --- NEW: Scroll-driven card navigation ---
  private lastWheelTime = 0;
  private readonly wheelThrottleTime = 350; // ms

  /**
   * Handles the mouse wheel event on the card stack for navigation.
   * This provides the Apple Wallet-style scroll-through effect.
   * Includes throttling to prevent overly rapid scrolling.
   */
  handleWheel(event: WheelEvent): void {
    event.preventDefault(); // Prevent the modal content from scrolling

    const now = Date.now();
    if (now - this.lastWheelTime < this.wheelThrottleTime) {
      return;
    }
    this.lastWheelTime = now;

    const currentIndex = this.selectedJobIndex();
    const maxIndex = this.workExperience().length - 1;

    if (event.deltaY < 0) {
      // Wheel up: Go to previous job, or wrap to end
      const nextIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
      this.selectJob(nextIndex);
    } else {
      // Wheel down: Go to next job, or wrap to start
      const nextIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
      this.selectJob(nextIndex);
    }
  }
}
