import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { mergeMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const auth = inject(AuthService);
  // Si no es una petición a nuestro backend, la dejamos pasar
  if (!req.url.startsWith(environment.apiURL)) {
    return next(req);
  }

  return auth.isAuthenticated$.pipe(
    mergeMap((isAuthenticated) => {
      if (!isAuthenticated) {
        return next(req);
      }

      return auth.getAccessTokenSilently().pipe(
        mergeMap((token) => {
          if (!token) {
            return throwError(() => new Error('No se pudo obtener el token'));
          }

          const requestClone = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next(requestClone);
        })
      );
    })
  );
};
