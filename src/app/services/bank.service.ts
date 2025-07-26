import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IBanks } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BankService extends BaseService<IBanks> {
  protected override source: string = 'bank';
  private bankListSignal = signal<IBanks[]>([]);
  get banks$() {
    return this.bankListSignal;
  }
  
  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.bankListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching banks', error);
      }
    });
  }

  saveBankSignal (bank: IBanks): Observable<any>{
    return this.add(bank).pipe(
      tap((response: any) => {
        this.bankListSignal.update( banks => [response, ...banks]);
      }),
      catchError(error => {
        console.error('Error saving bank', error);
        return throwError(error);
      })
    );
  }

  updateBankSignal (bank: IBanks): Observable<any>{
    return this.edit(bank.id, bank).pipe(
      tap((response: any) => {
        const updatedBanks = this.bankListSignal().map(u => u.id === bank.id ? response : u);
        this.bankListSignal.set(updatedBanks);
      }),
      catchError(error => {
        console.error('Error updating bank', error);
        return throwError(error);
      })
    );
  }

  deleteBankSignal (bank: IBanks): Observable<any>{
    return this.del(bank.id).pipe(
      tap((response: any) => {
        const deletedBanks = this.bankListSignal().filter(u => u.id !== bank.id);
        this.bankListSignal.set(deletedBanks);
      }),
      catchError(error => {
        console.error('Error deleting bank', error);
        return throwError(error);
      })
    );
  }
}
