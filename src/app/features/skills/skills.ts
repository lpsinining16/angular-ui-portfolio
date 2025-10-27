import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SoundService } from '../../core/services/sound';
import { ApiService } from '../../core/services/api';
import { Bubble, Bubbles } from '../../shared/components/bubbles/bubbles';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, Bubbles],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skills {
  apiService = inject(ApiService);
  soundService = inject(SoundService);

  skills = this.apiService.skills;

  playHoverSound(): void {
    this.soundService.playSound('clickHover');
  }

   bubblesConfig: Bubble[] = [
    { customStyles: { '--size': '40px', '--left': '10%', '--duration': '15s', '--delay': '0s', '--animation-name': 'rise', 'bottom': '-100px' } },
    { customStyles: { '--size': '80px', '--left': '20%', '--duration': '18s', '--delay': '2s', '--animation-name': 'rise', 'bottom': '-100px' } },
    { customStyles: { '--size': '15px', '--left': '35%', '--duration': '25s', '--delay': '5s', '--animation-name': 'rise', 'bottom': '-100px' } },
    { customStyles: { '--size': '100px', '--left': '50%', '--duration': '12s', '--delay': '1s', '--animation-name': 'rise', 'bottom': '-100px' } },
    { customStyles: { '--size': '30px', '--left': '60%', '--duration': '22s', '--delay': '7s', '--animation-name': 'rise', 'bottom': '-100px' } },
    { customStyles: { '--size': '25px', '--left': '75%', '--duration': '16s', '--delay': '3s', '--animation-name': 'rise', 'bottom': '-100px' } },
    { customStyles: { '--size': '35px', '--left': '85%', '--duration': '20s', '--delay': '6s', '--animation-name': 'rise', 'bottom': '-100px' } },
    { customStyles: { '--size': '50px', '--left': '90%', '--duration': '30s', '--delay': '8s', '--animation-name': 'rise', 'bottom': '-100px' } },
    { customStyles: { '--size': '45px', '--left': '5%', '--duration': '14s', '--delay': '4s', '--animation-name': 'rise', 'bottom': '-100px' } },
    { customStyles: { '--size': '80px', '--left': '95%', '--duration': '19s', '--delay': '1s', '--animation-name': 'rise', 'bottom': '-100px' } },
  ];
}
