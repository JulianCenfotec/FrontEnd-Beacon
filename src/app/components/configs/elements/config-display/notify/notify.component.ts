import { ProfileService } from './../../../../../services/profile.service';
import { Component, effect, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { NotifyService } from '../../../../../services/notify.service';
import {
  INotificationPreferences,
  IRoleType,
  NotificationOptionEnum,
  NotificationPreferences
} from '../../../../../interfaces';
import { ReportingService } from '../../../../../services/reporting.service';
import { CommonModule } from '@angular/common';
import { setFaviconBeacon } from '../../../../../utility/page-icon.utility';
import {Route} from "@angular/router";
import {AuthService} from "../../../../../services/auth.service";

@Component({
  selector: 'app-config-display-notify',
  templateUrl: './notify.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ConfigDisplayNotifyComponent implements OnInit {
  private windowTitle = 'Preferencias de Correo Electrónico | Configuraciones | Beacon';
  initialPreferences!: NotificationPreferences;
  savedPreferences!: NotificationPreferences;
  preferencesForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private notifyService: NotifyService,
    private profileService: ProfileService,
    private reportingService: ReportingService,
    private authService: AuthService,
  ) {
    effect(() => {
      this.notifyService
        .getPreferences()
        .subscribe({
          next: (preferences) => {
            this.initialPreferences = preferences;
            this.savedPreferences = { ...preferences };
            this.createForm(preferences);
          },
          error: (error) => {
            this.reportingService.error('Error al cargar las preferencias iniciales.');
          }
        });
    });
  }

  ngOnInit(): void {
    window.document.title = this.windowTitle;
    setFaviconBeacon();

    this.profileService.getUserInfoSignal();

  }

  createForm(preferences: NotificationPreferences): void {
    this.preferencesForm = this.fb.group({
      receiveAll: preferences.receiveAll,
      notifications: this.fb.array(
        preferences.notifications.map(notification => this.fb.group({
          id: [notification.id],
          name: [notification.name],
          description: [notification.description],
          enabled: [notification.enabled],
        }))
      ),
      reportFrequency: [preferences.reportFrequency, Validators.required],
    });

    this.preferencesForm.valueChanges
      .subscribe(this.checkFormChanges.bind(this));
  }

  get notifications(): FormArray {
    return this.preferencesForm.get('notifications') as FormArray;
  }

  checkFormChanges(): void {
    const currentPreferences = this.preferencesForm.value;
    const isEqual = JSON.stringify(currentPreferences) === JSON.stringify(this.savedPreferences);
    const buttons = document.querySelectorAll<HTMLButtonElement>('.btn-container .btn');
    buttons.forEach(button => button.disabled = isEqual);
  }
  isAdmin(): boolean {
    return this.authService.hasAnyRole([IRoleType.admin, IRoleType.superAdmin]);
  }

  onSaveChanges(): void {
    if (this.preferencesForm.valid) {
      this.savedPreferences = { ...this.preferencesForm.value };
      const user: INotificationPreferences =
      {
        "id": 0,
        "initialNotify": this.savedPreferences.notifications[0].enabled,
        "finalNotify": this.savedPreferences.notifications[1].enabled,
        "notificationOption": this.savedPreferences.reportFrequency,
      };

      this.notifyService.updatePreferences(user).subscribe({
        next: () => {
          this.checkFormChanges();
        },
        error: () => {
          this.reportingService.error('Error al actualizar las preferencias.');
        }
      });
    } else {
      this.preferencesForm.markAllAsTouched();
      this.reportingService.error('Hay errores en el formulario.');
    }
  }
  testNotify():void{
    this.loading = true;
    this.notifyService.testNotify().subscribe({
      next: () => {
        this.loading = false;
        this.reportingService.success('Test ejecutado correctamente.');
      },
      error: () => {
        this.reportingService.error('Error al ejecutar el test.');
      }
    });
  }

  onResetPreferences(): void {
    this.preferencesForm.reset(this.savedPreferences);
    this.checkFormChanges();
  }
}
