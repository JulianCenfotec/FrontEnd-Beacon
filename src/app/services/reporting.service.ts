import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

interface IEvent {
  type: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportingService {
  private subject = new Subject<IEvent>();

  get events(): Observable<IEvent> {
    return this.subject.asObservable();
  }

  warn(message: string): void {
    this.subject.next({ type: 'warn', message });
  }

  info(message: string): void {
    this.subject.next({ type: 'info', message });
  }

  error(message: string): void {
    this.subject.next({ type: 'error', message });
  }

  success(message: string): void {
    this.subject.next({ type: 'success', message });
  }
}
