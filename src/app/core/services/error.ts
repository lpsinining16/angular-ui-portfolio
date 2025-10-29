import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  public readonly errorMessage = signal<string | null>(null);

  // Method to show the modal with a specific message
  showError(message: string): void {
    this.errorMessage.set(message);
  }

  // Method to hide the modal
  hideError(): void {
    this.errorMessage.set(null);
  }
}
