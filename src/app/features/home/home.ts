import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { apiService } from '../../core/services/api';
import { NavigationService } from '../../core/services/navigation';
import { NgOptimizedImage } from '@angular/common';
import { SoundService } from '../../core/services/sound';

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
  skillIcons = this.apiService.skillIcons;
  decorativeBubbles = new Array(9).fill(1); // decorative bubbles

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

