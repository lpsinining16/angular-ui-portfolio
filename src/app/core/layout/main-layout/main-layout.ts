import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  PLATFORM_ID,
  HostListener,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { Home } from '../../../features/home/home';
import { About } from '../../../features/about/about';
import { Skills } from '../../../features/skills/skills';
import { Projects } from '../../../features/projects/projects';
import { Contact } from '../../../features/contact/contact';
import { NavigationService } from '../../services/navigation';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [Header, Footer, Home, About, Skills, Projects, Contact],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout implements AfterViewInit {
  private readonly navigationService = inject(NavigationService);
  private readonly platformId = inject(PLATFORM_ID);

  private sections: HTMLElement[] = [];
  private isTicking = false;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.sections = Array.from(document.querySelectorAll('main > *[id]'));
    }
  }

  // --- FIX IS ON THIS LINE ---
  // Removed the second argument `['$event']` as it's not needed.
  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.isTicking && isPlatformBrowser(this.platformId)) {
      window.requestAnimationFrame(() => {
        this.updateActiveSectionOnScroll();
        this.isTicking = false;
      });
      this.isTicking = true;
    }
  }

  private updateActiveSectionOnScroll(): void {
    const activationLine = 150;
    let currentActiveId = '';

    if (window.scrollY < 200) {
      currentActiveId = 'home';
      this.navigationService.setActiveFragmentOnScroll(currentActiveId);
      return;
    }

    const atPageBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atPageBottom) {
      currentActiveId = this.sections[this.sections.length - 1].id;
      this.navigationService.setActiveFragmentOnScroll(currentActiveId);
      return;
    }

    for (const section of this.sections) {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop < activationLine) {
        currentActiveId = section.id;
      }
    }

    if (currentActiveId) {
      this.navigationService.setActiveFragmentOnScroll(currentActiveId);
    }
  }
}
