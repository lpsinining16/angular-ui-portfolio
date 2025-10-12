import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { apiService } from '../../core/services/api';
import { Bubble, Bubbles } from '../../shared/components/bubbles/bubbles';

@Component({
  selector: 'app-contact',
  imports: [Bubbles],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Contact {
  private apiService = inject(apiService);
  profile = this.apiService.profile;

   bubblesConfig: Bubble[] = [
    { customStyles: { '--size': '60px', '--top': '20%', '--left': '5%', '--duration': '10s', '--delay': '0s', '--x-dist1': '15vw', '--y-dist1': '-20vh', '--x-dist2': '-10vw', '--y-dist2': '15vh', 'animation-name': 'chaotic-roam' } },
    { customStyles: { '--size': '120px', '--top': '50%', '--left': '15%', '--duration': '12s', '--delay': '1s', '--x-dist1': '-20vw', '--y-dist1': '25vh', '--x-dist2': '10vw', '--y-dist2': '-10vh', 'animation-name': 'chaotic-roam' } },
    { customStyles: { '--size': '80px', '--top': '80%', '--left': '25%', '--duration': '8s', '--delay': '0.5s', '--x-dist1': '10vw', '--y-dist1': '-30vh', '--x-dist2': '5vw', '--y-dist2': '20vh', 'animation-name': 'chaotic-roam' } },
    { customStyles: { '--size': '40px', '--top': '10%', '--left': '40%', '--duration': '15s', '--delay': '3s', '--x-dist1': '-15vw', '--y-dist1': '10vh', '--x-dist2': '20vw', '--y-dist2': '5vh', 'animation-name': 'chaotic-roam' } },
    { customStyles: { '--size': '150px', '--top': '40%', '--left': '55%', '--duration': '9s', '--delay': '0s', '--x-dist1': '25vw', '--y-dist1': '20vh', '--x-dist2': '-15vw', '--y-dist2': '-25vh', 'animation-name': 'chaotic-roam' } },
    { customStyles: { '--size': '70px', '--top': '70%', '--left': '75%', '--duration': '11s', '--delay': '2s', '--x-dist1': '-10vw', '--y-dist1': '-15vh', '--x-dist2': '-5vw', '--y-dist2': '20vh', 'animation-name': 'chaotic-roam' } },
    { customStyles: { '--size': '90px', '--top': '15%', '--left': '85%', '--duration': '14s', '--delay': '0.2s', '--x-dist1': '5vw', '--y-dist1': '30vh', '--x-dist2': '10vw', '--y-dist2': '-10vh', 'animation-name': 'chaotic-roam' } },
    { customStyles: { '--size': '50px', '--top': '90%', '--left': '90%', '--duration': '10s', '--delay': '1.5s', '--x-dist1': '-20vw', '--y-dist1': '-20vh', '--x-dist2': '5vw', '--y-dist2': '5vh', 'animation-name': 'chaotic-roam' } },
  ];
}
