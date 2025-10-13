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
import { VolumeControl } from '../../../shared/components/volume-control/volume-control';
import { ApiService } from '../../services/api';
import { RouterLink } from '@angular/router';

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

  // --- STATE SIGNALS ---
  readonly navLinks = this.apiService.navLinks;
  readonly isMenuOpen = signal(false);
  private readonly scrollTop = signal(0);

  // --- COMPUTED SIGNALS ---
  /** Determines if the header should be in its "shrunk" state */
  readonly isShrunk = computed(() => {
    const activeFragment = this.navigationService.activeFragment();
    return this.scrollTop() > 50 || (activeFragment !== null && activeFragment !== 'home');
  });

  // --- HOST BINDINGS ---
  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrollTop.set(window.scrollY);
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
