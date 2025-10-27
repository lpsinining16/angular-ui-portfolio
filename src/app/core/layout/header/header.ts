import { isPlatformBrowser, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
  computed,
  PLATFORM_ID,
  afterNextRender,
} from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

import { ThemeService } from '../../services/theme';
import { SoundService } from '../../services/sound';
import { NavigationService } from '../../services/navigation';
import { VolumeControl } from '../../../shared/components/volume-control/volume-control';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, VolumeControl, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  // --- SERVICE INJECTIONS ---
  readonly themeService = inject(ThemeService);
  readonly navigationService = inject(NavigationService);
  private readonly soundService = inject(SoundService);
  private readonly apiService = inject(ApiService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  // --- STATE SIGNALS ---
  readonly profile = this.apiService.profile; 
  readonly navLinks = this.apiService.navLinks;
  readonly isMenuOpen = signal(false);
  private readonly scrollTop = signal(0);
  readonly scrollProgress = signal(0); // New signal for the progress bar

  // --- COMPUTED SIGNALS ---
  /** Determines if the header should be in its "shrunk" state. */
  readonly isShrunk = computed(() => {
    const activeFragment = this.navigationService.activeFragment();
    // Shrink if scrolled down or not on the home section
    return this.scrollTop() > 50 || (activeFragment !== null && activeFragment !== 'home');
  });

  constructor() {
    // Only execute browser-specific logic on the client
    if (isPlatformBrowser(this.platformId)) {
      // Use afterNextRender for safe DOM access post-initial render
      afterNextRender(() => {
        this.updateScrollProgress(); // Initial calculation
      });

      // Reset scroll progress on successful navigation
      this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe(() => {
          this.scrollProgress.set(0);
          // Recalculate in case the new page is already scrolled (e.g., browser refresh)
          this.updateScrollProgress();
        });
    }
  }

  // --- HOST BINDINGS ---
  @HostListener('window:scroll')
  onWindowScroll(): void {
    // This listener is only active in the browser due to @HostListener behavior
    this.scrollTop.set(window.scrollY);
    this.updateScrollProgress();
  }

  // --- PRIVATE METHODS ---
  /** Calculates and updates the scroll progress signal. */
  private updateScrollProgress(): void {
    // Guard against running this logic on the server
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const scrollableHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    // Avoid division by zero on non-scrollable pages
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    this.scrollProgress.set(progress);
  }

  // --- PUBLIC METHODS ---
  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.soundService.playSound('click');
  }

  toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
    this.soundService.playSound('click');
  }

  onNavLinkClick(fragment: string): void {
    this.navigationService.navigateToFragment(fragment);
    if (this.isMenuOpen()) {
      this.isMenuOpen.set(false);
    }
  }
}
