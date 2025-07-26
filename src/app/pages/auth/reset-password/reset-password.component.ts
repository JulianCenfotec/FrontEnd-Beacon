import { Component, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { ReportingService } from '../../../services/reporting.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { setFaviconBeacon } from '../../../utility/page-icon.utility';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  private windowTitle = 'Restablecer contraseña | Beacon';
  formNuevaContrasenaDirective: FormGroup;
  private reporting = inject(ReportingService);
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formNuevaContrasenaDirective = this.fb.group({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
    window.document.title = this.windowTitle;
    setFaviconBeacon();
  }

  get newPassword() {
    return this.formNuevaContrasenaDirective.get('newPassword');
  }

  onSubmit() {
    if (this.formNuevaContrasenaDirective.valid) {
      const newPassword = this.formNuevaContrasenaDirective.value.newPassword;
      this.authService.resetPassword(this.token, newPassword).subscribe({
        next: () => {
          this.reporting.success('Tu contraseña ha sido restablecida');
          this.router.navigate(['/beacon/login']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 0) {
            this.reporting.error('No se pudo conectar con el servidor. Por favor, intenta de nuevo más tarde.');
          } else if (error.error instanceof ErrorEvent) {
            this.reporting.error(`Ocurrió un error: ${error.error.message}`);
          } else {
            this.reporting.error(`El servidor devolvió el siguiente error: ${error.message}`);
          }
        }
      });
    } else {
      this.reporting.error('Por favor, corrige los errores en el formulario.');
    }
  }
}