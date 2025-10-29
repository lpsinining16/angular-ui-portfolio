import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loading } from './shared/components/loading/loading';
import { LoadingService } from './core/services/loading';
import { ErrorService } from './core/services/error';
import { ErrorModal } from './shared/components/error-modal/error-modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Loading, ErrorModal],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  protected readonly title = signal('lps-ui-portfolio');
  public loadingService = inject(LoadingService);
  public errorService = inject(ErrorService);

  ngOnInit(): void {
    // this.loadingService.show();

    // // Set a timer to automatically hide it after 3 seconds
    // setTimeout(() => {
    //   this.loadingService.hide();
    // }, 90000);
  }
}
