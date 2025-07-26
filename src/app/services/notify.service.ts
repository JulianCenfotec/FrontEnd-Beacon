import { inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { INotificationPreferences, IUser, NotificationOptionEnum, NotificationPreferences } from '../interfaces';
import { catchError, tap } from 'rxjs/operators';
import { ReportingService } from './reporting.service';
import { BaseService } from "./base-service";
import { ProfileService } from "./profile.service";
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotifyService extends BaseService<IUser> {
  protected override source: string = 'notify';
  protected authService = inject(AuthService);
  public profileService = inject(ProfileService);
  public reportingService = inject(ReportingService);
  private userListSignal = signal<IUser[]>([]);
  private initialPreferences: NotificationPreferences = {
    receiveAll: false,
    notifications: [
      { id: 'initial', name: 'Notificación de inicio de plan', description: 'Recibirás notificaciones antes de que inicie un nuevo plan en tu calendario.', enabled: false },
      { id: 'final', name: 'Notificación de final de plan', description: 'Recibirás notificaciones antes de que acabe el plan en curso.', enabled: false },
    ],
    reportFrequency: NotificationOptionEnum.ZERO
  };

  private preferencesSignal = signal<NotificationPreferences>(this.initialPreferences);


  get preferences$() {
    return this.preferencesSignal;
  }

  getPreferences(): Observable<NotificationPreferences> {
    const user = this.profileService.user$();
    this.initialPreferences.notifications.forEach(notification => {
      if (notification.id === 'initial') {
        notification.enabled = user?.initialNotify || false;
      } else {
        notification.enabled = user?.finalNotify || false;
      }
    });
    this.initialPreferences.reportFrequency = user?.notificationOption || NotificationOptionEnum.ZERO;
    return of(this.preferencesSignal()).pipe(
      catchError(error => {
        this.reportingService.error('Error al obtener las preferencias de notificación.');
        return of(this.initialPreferences);
      })
    );
  }

  updatePreferences(preferences: INotificationPreferences): Observable<any> {
    const user = this.authService.getUser();
    if (!user) {
      throw new Error('El usuario no está autenticado');
    }
    
    preferences.id = user.id!;
    return this.edit(preferences.id, preferences).pipe(
      tap((response: any) => {
        const updatedUsers = this.userListSignal().map(u => u.id === preferences.id ? response : u);
        this.userListSignal.set(updatedUsers);
        this.getPreferences();
        this.reportingService.success('Preferencias actualizadas correctamente.');
      }),
      catchError(error => {
        this.reportingService.error('Error al actualizar las preferencias de notificación.');
        return of(null);
      })
    );
  }
  testNotify():Observable<any>{
    return this.add(1).pipe(
        tap(() => {
        }),
        catchError(error => {
          return of(null);
        })
    );
  }

  resetPreferences(): void {
    this.preferencesSignal.set(this.initialPreferences);
  }
}
