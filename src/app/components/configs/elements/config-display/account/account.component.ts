import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../../services/auth.service';
import { IUser } from '../../../../../interfaces';
import { LayoutService } from '../../../../../services/layout.service';
import { MyAccountComponent } from '../../../../my-account/my-account.component';
import { ReportingService } from '../../../../../services/reporting.service';
import { ProfileService } from '../../../../../services/profile.service';
import { UserService } from '../../../../../services/user.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { timer } from 'rxjs';
import { setFaviconBeacon } from '../../../../../utility/page-icon.utility';

@Component({
  selector: 'app-config-display-account',
  standalone: true,
  imports: [CommonModule, RouterLink, MyAccountComponent, ReactiveFormsModule, FormsModule, NgIf],
  templateUrl: './account.component.html',
})
export class ConfigDisplayAccountComponent implements OnInit {
  private windowTitle = 'Ajustes de la cuenta | Configuraciones | Beacon';

  protected formAccountSettingsDirective!: FormGroup;
  private reporting = inject(ReportingService);
  public profileService = inject(ProfileService);
  public authService = inject(AuthService);
  public userService = inject(UserService);
  private router = inject(Router);
  public emailChanged: boolean | undefined;
  private user: IUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
  public formHasChanges = false;
  private initialValues: any = {};
  loading = false;

  protected async onSubmit(): Promise<void> {
    if (this.formAccountSettingsDirective.valid) {
      this.loading = true;

      if (this.formAccountSettingsDirective.value.email === "") {
        this.formAccountSettingsDirective.value.email = this.profileService.user$().email;
      }
      if (this.formAccountSettingsDirective.value.email !== this.profileService.user$().email) {
        this.emailChanged = true;
      }
      if (this.formAccountSettingsDirective.value.name === "") {
        this.formAccountSettingsDirective.value.name = this.profileService.user$().name;
      }
      if (this.formAccountSettingsDirective.value.lastname === "") {
        this.formAccountSettingsDirective.value.lastname = this.profileService.user$().lastname;
      }
      if (this.formAccountSettingsDirective.value.displayname === "") {
        this.formAccountSettingsDirective.value.displayname = this.profileService.user$().displayname;
      }

      try {
        await this.userService.updateUserSignal(this.formAccountSettingsDirective.value).toPromise();
        
        await this.hideLoadingScreen();

        this.reporting.success("Se han actualizado los datos.");

        const updatedUser: IUser = {
          ...this.user,
          ...this.formAccountSettingsDirective.value
        };
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));

        if (this.emailChanged) {
          this.authService.logout();
          timer(2000).subscribe(() => this.router.navigateByUrl("/beacon/login"));
        } else {
          timer(2000).subscribe(() => this.router.navigateByUrl("/beacon/configuration/account"));
        }

        this.formAccountSettingsDirective.markAsUntouched();
        this.setInitialValues();
      } catch (error) {
        this.reporting.error("Ha ocurrido un error. No se pudo actualizar.");
      } finally {
        this.loading = false;
      }
    } else {
      this.formAccountSettingsDirective.markAllAsTouched();
    }
  }

  private async hideLoadingScreen(): Promise<void> {
    const MIN_LOADING_TIME_MS = 2000;
    const delay = new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME_MS));
    await delay;
  }

  get email(): FormControl {
    return this.formAccountSettingsDirective.get('email') as FormControl;
  }

  get name(): FormControl {
    return this.formAccountSettingsDirective.get('name') as FormControl;
  }

  get lastname(): FormControl {
    return this.formAccountSettingsDirective.get('lastname') as FormControl;
  }

  get displayname(): FormControl {
    return this.formAccountSettingsDirective.get('displayname') as FormControl;
  }

  private setInitialValues(): void {
    this.initialValues = {
      name: this.name.value,
      lastname: this.lastname.value,
      displayname: this.displayname.value,
      email: this.email.value
    };
    this.formHasChanges = false;
  }

  private checkFormChanges(): void {
    const currentValues = {
      name: this.name.value,
      lastname: this.lastname.value,
      displayname: this.displayname.value,
      email: this.email.value
    };
    this.formHasChanges = !this.deepEqual(currentValues, this.initialValues);
  }

  private deepEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  constructor() {
    this.profileService.getUserInfoSignal();
  }

  public ngOnInit(): void {
    window.document.title = this.windowTitle;
    setFaviconBeacon();
    this.formAccountSettingsDirective = new FormGroup({
      name: new FormControl(this.user.name, Validators.required),
      lastname: new FormControl(this.user.lastname, Validators.required),
      displayname: new FormControl(this.user.displayname, [
        Validators.required,
        Validators.maxLength(50)
      ]),
      email: new FormControl(this.user.email, [Validators.required, Validators.email]),
      id: new FormControl(this.user.id),
    });

    this.setInitialValues();

    this.formAccountSettingsDirective.valueChanges.subscribe(() => {
      this.checkFormChanges();
    });
  }
}
