import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ReportingService } from '../../../services/reporting.service';
import { IUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { setFaviconBeacon } from '../../../utility/page-icon.utility';

@Component({
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgIf],
  selector: 'register',
  templateUrl: './register.component.html',
  standalone: true
})
export class RegisterComponent implements OnInit {
  protected formRegistroDirective!: FormGroup;
  private reporting = inject(ReportingService);
  private service = inject(AuthService);
  private router = inject(Router);
  private windowTitle = 'Registrarse | Beacon';

  protected onSubmit(): void {
    if (this.formRegistroDirective.valid) {
      const user: IUser = this.formRegistroDirective.value;
      this.service.register(user).subscribe({
        next: () => {
          this.reporting.success("Usuario registrado correctamente.");
          setTimeout(() => this.router.navigateByUrl("/beacon/login"), 2000);
        },
        error: err => this.reporting.error("Error en el registro: " + err.message)
      });
    } else {
      this.formRegistroDirective.markAllAsTouched();
    }
  }

  get email(): FormControl {
    return this.formRegistroDirective.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.formRegistroDirective.get('password') as FormControl;
  }

  get name(): FormControl {
    return this.formRegistroDirective.get('name') as FormControl;
  }

  get lastname(): FormControl {
    return this.formRegistroDirective.get('lastname') as FormControl;
  }

  get displayname(): FormControl {
    return this.formRegistroDirective.get('displayname') as FormControl;
  }

  public ngOnInit(): void {
    window.document.title = this.windowTitle;
    setFaviconBeacon();

    this.formRegistroDirective = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      displayname: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

}
