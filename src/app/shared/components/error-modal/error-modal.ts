import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ErrorService } from '../../../core/services/error';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-modal.html',
  styleUrl: './error-modal.scss',
})
export class ErrorModal {
   public errorService = inject(ErrorService);
}
