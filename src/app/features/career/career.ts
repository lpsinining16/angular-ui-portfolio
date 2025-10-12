import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-career',
  imports: [],
  templateUrl: './career.html',
  styleUrl: './career.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Career {
  downloadCV() {
    // In a real app, you would point this to the path of your CV file in the assets folder.
    // window.open('/assets/Larry_Sinining_CV.pdf', '_blank');
    alert('CV download functionality to be implemented.');
  }
}
