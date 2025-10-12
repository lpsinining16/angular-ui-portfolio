// src/app/core/services/navigation.ts
import { Injectable, inject, signal } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';
import { SoundService } from './sound';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly soundService = inject(SoundService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly viewportScroller = inject(ViewportScroller);

  activeFragment = signal<string | null>(null);
  public isNavigatingAndScrolling = signal(false);

  private readonly defaultScrollOffset = 80;
  private isManualNavigationInProgress = false;
  private navigationDebounceTimeout: any;

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.handleRouteChange());

    // Ensure offset for non-home scrolling
    this.viewportScroller.setOffset([0, this.defaultScrollOffset]);
    this.viewportScroller.setHistoryScrollRestoration('manual');
  }

  /** 🔊 Play navigation click sound */
  playNavigationSound(): void {
    this.soundService.playSound('click');
  }

  /** 🚀 Handle route changes and scroll if needed */
  private handleRouteChange(): void {
    let currentRoute = this.activatedRoute;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    currentRoute.fragment.subscribe((fragment) => {
      const targetFragment = fragment || 'home';

      if (this.activeFragment() !== targetFragment) {
        this.activeFragment.set(targetFragment);

        // Smooth scroll only on first load or direct URL access (not manual clicks)
        if (!this.isManualNavigationInProgress) {
          this.isNavigatingAndScrolling.set(true);

          setTimeout(() => {
            if (targetFragment === 'home' && window.scrollY <= 0) {
              // Already at top → no scroll needed
              this.isNavigatingAndScrolling.set(false);
            } else {
              this.scrollToFragment(targetFragment, { behavior: 'smooth' });
            }
          }, 50);
        }
      }
    });
  }

  /** 🧭 Navigate to a fragment with smooth scroll */
  navigateToFragment(fragment: string): void {
    this.playNavigationSound();

    this.isManualNavigationInProgress = true;
    this.isNavigatingAndScrolling.set(true);
    clearTimeout(this.navigationDebounceTimeout);

    // Reset after delay
    this.navigationDebounceTimeout = setTimeout(() => {
      this.isManualNavigationInProgress = false;
      this.isNavigatingAndScrolling.set(false);
    }, 800);

    this.router.navigate(['/'], { fragment, replaceUrl: true }).then(() => {
      this.activeFragment.set(fragment);
      this.scrollToFragment(fragment, { behavior: 'smooth' });
    });
  }

  /** 🎯 Scroll to element by ID, respecting header offset */
  scrollToFragment(fragmentId: string, options?: ScrollIntoViewOptions): void {
    const element = document.getElementById(fragmentId);
    if (!element) {
      console.warn(`Element with ID '${fragmentId}' not found for scrolling.`);
      this.isNavigatingAndScrolling.set(false);
      return;
    }

    const headerOffset = fragmentId === 'home' ? 0 : this.defaultScrollOffset;
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: options?.behavior || 'smooth',
    });

    if (!this.isManualNavigationInProgress) {
      setTimeout(() => this.isNavigatingAndScrolling.set(false), 800);
    }
  }

  /** 🔄 Update fragment in URL without scrolling (for IntersectionObserver) */
  setActiveFragmentOnScroll(fragment: string): void {
    if (!this.isManualNavigationInProgress && !this.isNavigatingAndScrolling()) {
      if (this.activeFragment() !== fragment) {
        this.activeFragment.set(fragment);
        this.router.navigate([], {
          fragment,
          relativeTo: this.activatedRoute,
          replaceUrl: true,
          queryParamsHandling: 'preserve',
        });
      }
    }
  }
}
