import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ReportingService } from '../../../services/reporting.service';
import { setFaviconBeacon } from '../../../utility/page-icon.utility';

@Component({
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule, NgIf],
  templateUrl: './login.component.html',
  selector: 'app-login',
  standalone: true,
})
export class LoginComponent implements OnInit {
  protected formInicioSesionDirective!: FormGroup;
  private reporting = inject(ReportingService);
  private service = inject(AuthService);
  private router = inject(Router);
  private windowTitle = 'Iniciar Sesión | Beacon';

  protected onSubmit(): void {
    if (this.formInicioSesionDirective.valid) {
      this.service
        .login(this.formInicioSesionDirective.value)
        .subscribe({
          next: () => this.router.navigateByUrl("/beacon/app/panel"),
          error: () => this.reporting.error("Ha ocurrido un error. Verifica tus credenciales."),
        });
    }
    else this.formInicioSesionDirective.markAllAsTouched();
  }

  get email(): FormControl {
    return this.formInicioSesionDirective.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.formInicioSesionDirective.get('password') as FormControl;
  }

  public ngOnInit(): void {
    window.document.title = this.windowTitle;
    setFaviconBeacon();

    this.formInicioSesionDirective = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      me: new FormControl(false, []),
    });
  }

  togglePasswordVisibility(): void {
    const passwordField = document.querySelector('input[formControlName="password"]') as HTMLInputElement;
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
    } else {
      passwordField.type = 'password';
    }
  }
}
