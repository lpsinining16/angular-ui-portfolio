import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../core/services/api';
import { SoundService } from '../../core/services/sound';
import { Career } from '../career/career';

const BASE_ANIMATION_DURATION = 1500; // ms
const DYNAMIC_DURATION_FACTOR = 100; // ms to add per whole number

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, Career],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  private readonly api = inject(ApiService);
  private readonly sound = inject(SoundService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  @ViewChild('careerModal') careerModal!: Career;
  @ViewChildren('statRef') statElements!: QueryList<ElementRef<HTMLElement>>;

  private observer?: IntersectionObserver;
  profile = this.api.profile;

  constructor() {
    afterNextRender(() => {
      if (this.isBrowser) {
        this.initIntersectionObserver();
      }
    });
  }

  aboutParagraphs = computed(() => {
    const { about, about2, about3 } = this.profile();
    return [about, about2, about3].filter(Boolean);
  });

  currentJobYears = computed(() => {
    const devJobs = this.api.workExperience().filter((job) => job.isDevRole);
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

  openCareerModal(): void {
    this.sound.playSound('clickHover');
    this.careerModal.openModal();
  }

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

    const duration = BASE_ANIMATION_DURATION + Math.floor(target) * DYNAMIC_DURATION_FACTOR;
    let startTime: number | null = null;

    const step = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4); // Ease-out quad
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
