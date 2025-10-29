import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiService } from '../services/api';
import { LoadingService } from '../services/loading';

export const initialDataResolver: ResolveFn<any> = (route, state) => {
  const apiService = inject(ApiService);
  const loadingService = inject(LoadingService);

  // Show the loading screen
  loadingService.show();

  // Call the new method that fetches everything
  return apiService.fetchAllInitialData().pipe(
    finalize(() => {
      // This will always run when the observable completes or errors
      loadingService.hide();
    })
  );
};
