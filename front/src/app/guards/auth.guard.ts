import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.currentUser();
  if (user !== null) {
    return of(true);
  }

  return auth.fetchCurrentUser().pipe(
    map(response => {
      return response !== null ? true : router.createUrlTree(['/sign-in']);
    }),
    catchError(() => of(router.createUrlTree(['/sign-in'])))
  );
};