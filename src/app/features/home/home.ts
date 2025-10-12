import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { apiService } from '../../core/services/api';
import { NavigationService } from '../../core/services/navigation';
import { NgOptimizedImage } from '@angular/common';
import { SoundService } from '../../core/services/sound';

export interface IconSkill {
  name: string;
  iconClass: string; // Changed from 'svg'
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  animationDelay: string;
}

@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  apiService = inject(apiService);
  soundService = inject(SoundService);
  navigationService = inject(NavigationService);

  profile = this.apiService.profile;
  decorativeBubbles = new Array(9).fill(1); // decorative bubbles
  
  // Updated skill data to use icon classes
  skillIcons: IconSkill[] = [
    // Front-End Skills (Lower-Right)
    { name: 'Angular', iconClass: 'bx bxl-angular', bottom: '15%', right: '10%', animationDelay: '2.2s' },
    { name: 'TypeScript', iconClass: 'bx bxl-typescript', bottom: '30%', right: '-5%', animationDelay: '2.8s' },
    { name: 'JavaScript', iconClass: 'bx bxl-javascript', bottom: '5%', right: '35%', animationDelay: '3.1s' },
    { name: 'PrimeNG', iconClass: 'bx bx-layer', bottom: '45%', right: '5%', animationDelay: '2.5s' },
    { name: 'Angular Material', iconClass: 'bx bxl-angular', bottom: '10%', right: '60%', animationDelay: '3.4s' },
    { name: 'Bootstrap', iconClass: 'bx bxl-bootstrap', bottom: '30%', right: '75%', animationDelay: '3.8s' },
    { name: 'HTML', iconClass: 'bx bxl-html5', bottom: '50%', right: '65%', animationDelay: '2.1s' },
    { name: 'CSS', iconClass: 'bx bxl-css3', bottom: '60%', right: '30%', animationDelay: '4.0s' },
    // Back-End Skills (Upper-Right)
    { name: 'RESTful APIs', iconClass: 'bx bx-network-chart', top: '15%', right: '10%', animationDelay: '2.3s' },
    { name: 'ASP.NET C#', iconClass: 'bx bx-code-curly', top: '30%', right: '-5%', animationDelay: '2.9s' },
    { name: 'Visual FoxPro', iconClass: 'bx bx-data', top: '5%', right: '35%', animationDelay: '3.2s' },
    { name: 'Node.js', iconClass: 'bx bxl-nodejs', top: '45%', right: '5%', animationDelay: '2.6s' },
    { name: 'Express.js', iconClass: 'bx bx-fast-forward', top: '10%', right: '60%', animationDelay: '3.5s' },
  ];

  onReadAboutMeClick(): void {
    this.soundService.playSound('click');
    this.navigationService.scrollToFragment('about');
  }

  onViewProjectsClick(): void {
    this.soundService.playSound('click');
    this.navigationService.scrollToFragment('projects');
  }

  playBubbleHoverSound(soundName: 'hoverBubbles' | 'hoverBubbles2'): void {
    this.soundService.playSound(soundName);
  }
}

