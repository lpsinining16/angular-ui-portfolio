import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SoundService } from '../../../core/services/sound';

@Component({
  selector: 'app-volume-control',
  imports: [CommonModule, FormsModule],
  templateUrl: './volume-control.html',
  styleUrl: './volume-control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeControl {
  soundService = inject(SoundService);

  onVolumeChange(newVolume: number): void {
    this.soundService.setVolume(newVolume);
  }

  toggleMuteAndVolume(): void {
    this.soundService.toggleMute();
  }
}
