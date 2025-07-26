import { inject, Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ICalendarioGeneral, ICalendarioPlan } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class PlanGeneralService extends BaseService<any> {
  protected override source: string = 'calendario';
  private auth = inject(AuthService);

  getCalendarioFromUserSignal(): Observable<Array<ICalendarioGeneral>> {
    const user = this.auth.getUser();
    if (!user) {
      throw new Error('El usuario no está autenticado');
    }

    const id = user.id || 0;
    const route = this.source.concat('/user/', id.toString());
    return this.http.get<Array<ICalendarioGeneral>>(route);
  }

}
