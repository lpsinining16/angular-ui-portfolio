import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface Bubble {
  customStyles: { [key: string]: any };
}

@Component({
  selector: 'app-bubbles',
  imports: [CommonModule],
  templateUrl: './bubbles.html',
  styleUrl: './bubbles.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Bubbles {
  @Input() bubbles: Bubble[] = [];

  getStyleString(styles: { [key: string]: any }): string {
    if (!styles) {
      return '';
    }
    return Object.entries(styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
  }
}
