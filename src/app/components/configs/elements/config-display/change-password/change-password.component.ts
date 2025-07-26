import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../../services/auth.service';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReportingService } from '../../../../../services/reporting.service';
import { timer, of } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { setFaviconBeacon } from '../../../../../utility/page-icon.utility';

interface ChangePasswordRequest {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  private windowTitle = 'Modificar Contraseña | Configuraciones | Beacon';
  private reporting = inject(ReportingService);
  private router = inject(Router);
  changePasswordRequest: ChangePasswordRequest = {
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '' 
  };
  message: string | null = null;
  errorMessage: string | null = null;
  loading = false;

  constructor(private authService: AuthService) {
    const user = this.authService.getUser();
    if (user) {
      this.changePasswordRequest.email = user.email || ''; 
    }
  }
  
  ngOnInit() {
    window.document.title = this.windowTitle;
    setFaviconBeacon();
  }

  onNewPasswordInput() {
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
    if (confirmPasswordInput) {
      confirmPasswordInput.disabled = !this.changePasswordRequest.newPassword;
    }
  }

  showErrorTag(currentPassword: NgModel, newPassword: NgModel, confirmPassword: NgModel) {
    return (currentPassword.invalid && (currentPassword.dirty || currentPassword.touched)) ||
           (newPassword.invalid && (newPassword.dirty || newPassword.touched)) ||
           ((confirmPassword.dirty || confirmPassword.touched) && (confirmPassword.invalid || confirmPassword.value !== this.changePasswordRequest.newPassword));
  }

  onSubmit() {
    if (this.changePasswordRequest.newPassword !== this.changePasswordRequest.confirmPassword) {
      this.reporting.error('La nueva contraseña no coincide');
      return;
    }

    this.loading = true;

    const startTime = Date.now();
    this.authService.changePassword(this.changePasswordRequest).pipe(
      switchMap(() => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(2000 - elapsedTime, 0);
        return timer(remainingTime).pipe(
          tap(() => {
            this.loading = false;
            this.reporting.success('Contraseña cambiada exitosamente');
            this.authService.logout();
            this.router.navigateByUrl("/beacon/login");
          })
        );
      }),
      catchError((error) => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(2000 - elapsedTime, 0);
        return timer(remainingTime).pipe(
          tap(() => {
            this.loading = false;
            this.reporting.error(error.error?.error || 'Error desconocido');
          })
        );
      })
    ).subscribe();
  }
}
