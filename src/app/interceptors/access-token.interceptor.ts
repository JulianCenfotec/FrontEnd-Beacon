import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

export const accessTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  let headers = {};

  if (!authService.check())
    return next(req);

  if (authService.isExpiredSession()) {
    authService.logout();
    router.navigate(['/beacon/login']);
    return new Subject();
  }

  if (!req.url.includes('auth')) {
    headers = {
        setHeaders: {
          Authorization: `Bearer ${authService.getAccessToken()?.replace(/"/g, '')}`,
        },
    }
};

  const clonedRequest = req.clone(headers);

  return next(clonedRequest);
};
