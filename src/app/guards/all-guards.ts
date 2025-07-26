import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IRoleType } from '../interfaces';

export const anyGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    return authService.check() || true;
}

export const noneGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (!authService.check())
        return true;

    router.navigateByUrl('/beacon/configuration');
    return false;
};

export const userGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (authService.check())
        return true;

    router.navigateByUrl('/beacon/login');
    return false;
};

export const userOnlyGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (authService.hasAnyRole([IRoleType.user])) {
        return true;
    }

    router.navigateByUrl('/beacon/error-page');
    return false;
}

export const adminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (authService.hasAnyRole([IRoleType.superAdmin])) {
        return true;
    }

    router.navigateByUrl('/beacon/error-page');
    return false;
}