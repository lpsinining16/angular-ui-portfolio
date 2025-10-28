import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  QueryList,
  ViewChildren,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { ApiService } from '../../core/services/api';
import { NavigationService } from '../../core/services/navigation';
import { SoundService } from '../../core/services/sound';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements AfterViewInit, OnDestroy {
  // --- DEPENDENCY INJECTION ---
  apiService = inject(ApiService);
  soundService = inject(SoundService);
  navigationService = inject(NavigationService);
  private platformId = inject(PLATFORM_ID);

  // --- STATE SIGNALS ---
  profile = this.apiService.profile;

  // bubble elements in the SCSS, preventing the creation of unstyled DOM elements.
  decorativeBubbles = Array.from({ length: 10 });

  // --- ANIMATION ON SCROLL ---
  // IMPROVEMENT (Performance): Using ViewChildren to get references to all elements
  // that should be animated when they scroll into view.
  @ViewChildren('animateIn') animatedElements!: QueryList<ElementRef>;
  private observer?: IntersectionObserver;

  // IMPROVEMENT (Performance & SSR): The ngAfterViewInit lifecycle hook is used to set up the
  // IntersectionObserver. This logic is wrapped in isPlatformBrowser to ensure it only
  // runs in the browser, making the component fully SSR-compatible.
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              this.observer?.unobserve(entry.target); // Animate only once
            }
          });
        },
        { threshold: 0.1 } // Trigger when 10% of the element is visible
      );

      this.animatedElements.forEach((el) => this.observer?.observe(el.nativeElement));
    }
  }

  // IMPROVEMENT (Maintainability): Disconnect the observer on component destruction
  // to prevent memory leaks.
  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  // --- UI EVENT HANDLERS ---
  onReadAboutMeClick(): void {
    this.soundService.playSound('click');
    this.navigationService.navigateToFragment('about');
  }

  onViewProjectsClick(): void {
    this.soundService.playSound('click');
    this.navigationService.navigateToFragment('projects');
  }

  playBubbleHoverSound(soundName: 'hoverBubbles' | 'hoverBubbles2'): void {
    this.soundService.playSound(soundName);
  }
}
