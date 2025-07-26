import { Injectable,inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IEtiqueta } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EtiquetaService extends BaseService<IEtiqueta> {
  protected override source: string = 'etiqueta';
  private etiquetaListSignal = signal<IEtiqueta[]>([]);
  private snackBar = inject(MatSnackBar);
  get etiquetas$() {
    return this.etiquetaListSignal;
  }
  
  public getAllSignal() : Observable<IEtiqueta[]> {
    return this.findAll().pipe(
      tap((response: any) => {
        response.reverse();
        this.etiquetaListSignal.set(response);
      }),
      catchError((error: any) => {
        console.error('Error fetching tags', error);
        return throwError(error);
      })
    );
  }
}
