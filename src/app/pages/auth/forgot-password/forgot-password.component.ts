import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { setFaviconBeacon } from '../../../utility/page-icon.utility';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private windowTitle = 'Olvidé mi contraseña | Beacon';

  formRecuperarContrasenaDirective: FormGroup;
  public errorMessage: string = '';
  public successMessage: string = '';
  public loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.formRecuperarContrasenaDirective = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    window.document.title = this.windowTitle;
    setFaviconBeacon();
  }

  get email() {
    return this.formRecuperarContrasenaDirective.get('email');
  }

  onSubmit() {
    if (this.formRecuperarContrasenaDirective.valid) {
      this.loading = true; 
      const email = this.formRecuperarContrasenaDirective.value.email;
      this.authService.requestPasswordReset(email).subscribe({
        next: (response) => {
          this.successMessage = 'Se ha enviado un correo electrónico para restablecer tu contraseña';
          this.errorMessage = '';
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 400 && error.error.error.includes('No user found')) {
            this.errorMessage = 'Correo electrónico no registrado';
          } else {
            this.errorMessage = 'Error al enviar el correo electrónico. Por favor, intenta de nuevo.';
          }
          this.successMessage = '';
          this.loading = false; 
        }
      });
    } else {
      this.errorMessage = 'Por favor, corrige los errores en el formulario.';
      this.successMessage = ''; 
    }
  }
}
