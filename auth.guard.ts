import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Role-based check — route data carries required role
  const requiredRole = route.data?.['role'];
  if (requiredRole && auth.getRole() !== requiredRole) {
    // Redirect to their correct dashboard
    if (auth.getRole() === 'organizer') router.navigate(['/organizer']);
    else router.navigate(['/user']);
    return false;
  }

  return true;
};
