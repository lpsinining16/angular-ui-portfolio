import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { Home } from '../../../features/home/home';
import { About } from '../../../features/about/about';
import { Skills } from '../../../features/skills/skills';
import { Projects } from '../../../features/projects/projects';
import { Career } from '../../../features/career/career';
import { Contact } from '../../../features/contact/contact';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  imports: [Header, Footer, Home, About, Skills, Projects, Career, Contact],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private fragmentSubscription: Subscription | undefined;

  ngAfterViewInit(): void {
    this.fragmentSubscription = this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        // Timeout ensures the element is rendered before we try to scroll
        setTimeout(() => this.scrollToFragment(fragment), 0);
      }
    });
  }

  private scrollToFragment(fragment: string): void {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ngOnDestroy(): void {
    this.fragmentSubscription?.unsubscribe();
  }
}
