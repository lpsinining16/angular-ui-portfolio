import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '../services/error';

export const globalErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred. Please try again later.';

      // The error you showed (ERR_CONNECTION_REFUSED) has status 0
      if (error.status === 0) {
        errorMessage =
          'Could not connect to the server. Please check your network connection or contact support.';
      } else if (error.status >= 400 && error.status < 500) {
        // You can handle specific client-side errors here if needed
        errorMessage = `Error: ${error.status}. There was a problem with the request.`;
      } else if (error.status >= 500) {
        errorMessage = 'A server-side error occurred. The team has been notified.';
      }

      // Show the global error modal with the crafted message
      errorService.showError(errorMessage);

      // Important: re-throw the error so that any local catch blocks can still handle it
      return throwError(() => error);
    })
  );
};
