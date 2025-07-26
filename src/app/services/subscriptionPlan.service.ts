import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ISubscriptionPlan, IUser, IUserSubscription } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionPlanService extends BaseService<ISubscriptionPlan> {
  protected override source: string = 'subscriptionPlan';
  protected authService = inject(AuthService);

  private subscriptionPlanListSignal = signal<ISubscriptionPlan[]>([]);
  get subscriptionPlan$() {
    return this.subscriptionPlanListSignal;
  }

  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.subscriptionPlanListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching subscription', error);
      }
    });
  }

  saveSubscriptionPlanSignal(subscriptionPlan: ISubscriptionPlan): Observable<any> {
    return this.add(subscriptionPlan).pipe(
      tap((response: any) => {
        this.subscriptionPlanListSignal.update(subscriptionPlans => [response, ...subscriptionPlans]);
      }),
      catchError(error => {
        console.error('Error saving plan', error);
        return throwError(error);
      })
    );
  }

  updateSubscriptionPlanSignal(subscriptionPlan: ISubscriptionPlan): Observable<any> {
    return this.edit(subscriptionPlan.id, subscriptionPlan).pipe(
      tap((response: any) => {
        const updatedSubscriptionPlan = this.subscriptionPlanListSignal().map(u => u.id === subscriptionPlan.id ? response : u);
        this.subscriptionPlanListSignal.set(updatedSubscriptionPlan);
      }),
      catchError(error => {
        console.error('Error saving plan', error);
        return throwError(error);
      })
    );
  }

  deleteSubscriptionPlanSignal(subscriptionPlan: ISubscriptionPlan): Observable<any> {
    return this.del(subscriptionPlan.id).pipe(
      tap((response: any) => {
        const deleteSubscriptionPlan = this.subscriptionPlanListSignal().filter(u => u.id !== subscriptionPlan.id);
        this.subscriptionPlanListSignal.set(deleteSubscriptionPlan);
      }),
      catchError(error => {
        console.error('Error saving plan', error);
        return throwError(error);
      })
    );
  }

  subscribeToPlanSignal(subscriptionPlan: ISubscriptionPlan): Observable<any> {
    const user = this.authService.getUser();
    if (!user) {
      throw new Error('El usuario no está autenticado');
    }

    const route = this.source.concat('/user/', user.id?.toString() || '0', '/subscription/', subscriptionPlan.id?.toString() || '0');
    return this.http
      .post(route, {});
  }

  approvePaypalSubscriptionSignal(subscription: IUserSubscription): Observable<any> {
    delete subscription.user.authorities;
    const route = this.source.concat('/paypal/', subscription.id?.toString() || '0', '/approved');
    return this.http
      .patch(route, subscription);
  }

  cancelPaypalSubscriptionSignal(subscription: IUserSubscription): Observable<any> {
    delete subscription.user.authorities;
    const route = this.source.concat('/paypal/', subscription.id?.toString() || '0', '/canceled');
    return this.http
      .patch(route, subscription);
  }

  errorPaypalSubscriptionSignal(subscription: IUserSubscription): Observable<any> {
    delete subscription.user.authorities;
    const route = this.source.concat('/paypal/', subscription.id?.toString() || '0', '/error');
    return this.http
      .patch(route, subscription);
  }

  getUserSubscriptionSignal(): Observable<Array<IUserSubscription>> {
    const user = this.authService.getUser();
    if (!user) {
      throw new Error('El usuario no está autenticado');
    }

    const route = this.source.concat('/user/', user.id?.toString() || '0');
    return this.http
      .get<Array<IUserSubscription>>(route);
  }
}
