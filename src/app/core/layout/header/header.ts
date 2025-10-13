import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
  computed,
} from '@angular/core';
import { ThemeService } from '../../services/theme';
import { SoundService } from '../../services/sound';
import { NavigationService } from '../../services/navigation';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { VolumeControl } from '../../../shared/components/volume-control/volume-control';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, VolumeControl],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  themeService = inject(ThemeService);
  soundService = inject(SoundService);
  navigationService = inject(NavigationService);
  router = inject(Router);

  scrollTop = signal(0);
  activeFragment = signal<string | null>('home'); // Default to home

  isShrunk = computed(
    () =>
      this.scrollTop() > 50 || (this.activeFragment() !== null && this.activeFragment() !== 'home')
  );

  isMenuOpen = signal(false);

  constructor() {
    // Listen to router events to know which section is active
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const fragment = this.router.parseUrl(event.urlAfterRedirects).fragment;
        this.activeFragment.set(fragment || 'home');
      });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrollTop.set(window.scrollY);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.soundService.playSound('clickThemeSwitcher');
  }

  toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
    this.soundService.playSound('click');
  }

  onNavLinkClick(fragment: string): void {
    this.navigationService.navigateToFragment(fragment);
    if (this.isMenuOpen()) {
      this.toggleMenu();
    }
  }
}
