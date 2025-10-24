import { Injectable, inject, signal, PLATFORM_ID, NgZone } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ViewportScroller, isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';
import { SoundService } from './sound';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  // --- INJECTIONS ---
  private readonly soundService = inject(SoundService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone); // For running browser APIs outside Angular's zone

  // --- SIGNALS ---
  readonly activeFragment = signal<string | null>(null);

  constructor() {
    // This subscription now ONLY handles EXTERNAL navigation events like back/forward or initial load.
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        const fragment = this.activatedRoute.snapshot.fragment || 'home';
        this.activeFragment.set(fragment);
        this.scrollToFragment(fragment, false); // Instant scroll for browser actions
      });

    if (isPlatformBrowser(this.platformId)) {
      this.viewportScroller.setOffset([0, 80]); // Header offset
      this.viewportScroller.setHistoryScrollRestoration('manual');
    }
  }

  public navigateToFragment(fragment: string): void {
    this.soundService.playSound('click');
    // We navigate with the router, which will be handled by the constructor's subscription.
    this.router.navigate(['/'], { fragment });
  }

  public setActiveFragmentOnScroll(fragment: string): void {
    // Only proceed if the fragment has actually changed, to avoid unnecessary history updates.
    if (this.activeFragment() !== fragment) {
      // 1. Update the UI state immediately.
      this.activeFragment.set(fragment);

      // 2. Use the browser's native history API to SILENTLY update the URL.
      if (isPlatformBrowser(this.platformId)) {
        // Run this outside of Angular's zone to prevent any potential change detection cycles.
        this.ngZone.runOutsideAngular(() => {
          const newUrl = `${window.location.pathname}#${fragment}`;
          history.replaceState(null, '', newUrl);
        });
      }
    }
  }

  /**
   * A private utility for scrolling to a section.
   */
  private scrollToFragment(fragmentId: string, smooth: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const behavior = smooth ? 'smooth' : 'auto';

    if (fragmentId === 'home') {
      window.scrollTo({ top: 0, behavior });
    } else {
      this.viewportScroller.scrollToAnchor(fragmentId);
    }
  }
}
