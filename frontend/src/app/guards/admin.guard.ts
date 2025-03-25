import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user$.pipe(
    map((user) => {
      // Verifica el rol de admin en los metadata del usuario
      const isAdmin =
        user?.['https://crudo.com/claims/roles']?.includes('Admin');
      if (!isAdmin) {
        router.navigate(['/']);
        return false;
      }
      return true;
    })
  );
};
