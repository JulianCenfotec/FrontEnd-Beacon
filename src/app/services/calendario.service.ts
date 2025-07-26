import { inject, Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ICalendario, ICalendarioGasto, ICalendarioPlan, IGasto, IIngreso } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService extends BaseService<any> {
  protected override source: string = 'calendario';
  private auth = inject(AuthService);

  getCalendarioFromUserSignal(): Observable<Array<ICalendario>> {
    const user = this.auth.getUser();
    if (!user) {
      throw new Error('El usuario no está autenticado');
    }

    const id = user.id || 0;
    const route = this.source.concat('/user/', id.toString());
    return this.http.get<Array<ICalendario>>(route);
  }

  postCalendarioPlanSignal(calendarioId: number, planId: number, fechaInicio: Date): Observable<ICalendarioPlan> {
    const route = this.source.concat('/plan');
    return this.http
      .post<ICalendarioPlan>(route, {
        calendario: { id: calendarioId },
        plan: { id: planId },
        fechaInicio: fechaInicio.getTime(),
      });
  }
  
  patchCalendarioPlanSignal(relationshipId: number, calendarioId: number, planId: number, fechaInicio: Date): Observable<ICalendarioPlan> {
    const route = this.source.concat('/plan');
    return this.http
      .patch<ICalendarioPlan>(route, {
        id: relationshipId,
        calendario: { id: calendarioId },
        plan: { id: planId },
        fechaInicio: fechaInicio.getTime(),
      });
  }

  deleteCalendarioPlanSignal(relationshipId: number): Observable<ICalendarioPlan> {
    const route = this.source.concat('/plan/', relationshipId.toString());
    return this.http.delete<ICalendarioPlan>(route);
  }

  postCalendarioGastoSignal(calendarioId: number, gasto: IGasto, fechaInicio: Date): Observable<ICalendarioGasto> {
    const route = this.source.concat('/gasto');
    return this.http
      .post<ICalendarioGasto>(route, {
        fechaInicio: fechaInicio.getTime(),
        calendario: { id: calendarioId },
        gasto,
      });
  }

  patchCalendarioGastoSignal(relationshipId: number, calendarioId: number, gasto: IGasto, fechaInicio: Date): Observable<ICalendarioGasto> {
    const route = this.source.concat('/gasto');
    return this.http
      .patch<ICalendarioGasto>(route, {
        id: relationshipId,
        fechaInicio: fechaInicio.getTime(),
        calendario: { id: calendarioId },
        gasto,
      });
  }

  deleteCalendarioGastoSignal(relationshipId: number): Observable<ICalendarioGasto> {
    const route = this.source.concat('/gasto/', relationshipId.toString());
    return this.http.delete<ICalendarioGasto>(route);
  }

  postCalendarioIngresoSignal(calendarioId: number, ingreso: IIngreso, fechaInicio: Date): Observable<ICalendarioPlan> {
    const route = this.source.concat('/ingreso');
    return this.http
      .post<ICalendarioPlan>(route, {
        fechaInicio: fechaInicio.getTime(),
        calendario: { id: calendarioId },
        ingreso,
      });
  }

  patchCalendarioIngresoSignal(relationshipId: number, calendarioId: number, ingreso: IIngreso, fechaInicio: Date): Observable<ICalendarioPlan> {
    const route = this.source.concat('/ingreso');
    return this.http
      .patch<ICalendarioPlan>(route, {
        id: relationshipId,
        fechaInicio: fechaInicio.getTime(),
        calendario: { id: calendarioId },
        ingreso,
      });
  }

  deleteCalendarioIngresoSignal(relationshipId: number): Observable<ICalendarioPlan> {
    const route = this.source.concat('/ingreso/', relationshipId.toString());
    return this.http.delete<ICalendarioPlan>(route);
  }
  
  postCalendarioForUserSignal(calendario: ICalendario): Observable<ICalendario> {
    const user = this.auth.getUser();
    if (!user) {
      throw new Error('El usuario no está autenticado');
    }

    const id = user.id || 0;
    const route = this.source.concat('/user/', id.toString());
    return this.http.post<ICalendario>(route, calendario);
  }
}
