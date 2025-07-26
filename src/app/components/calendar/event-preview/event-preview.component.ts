import { NgFor } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { ICalendario, IPlan } from '../../../interfaces';
import { CalendarioService } from '../../../services/calendario.service';
import { ReportingService } from '../../../services/reporting.service';

@Component({
  standalone: true,
  selector: 'app-event-preview',
  imports: [ReactiveFormsModule, NgFor],
  styleUrl: './event-preview.component.scss',
  templateUrl: './event-preview.component.html',
})
export class EventPreviewComponent implements OnInit {
  private activeModal = inject(NgbActiveModal);
  private reporting = inject(ReportingService);
  private service = inject(CalendarioService);

  @Input({ required: true })
  protected onSuccess: Function = () => { };

  @Input({ required: true })
  protected calendarios: Array<ICalendario> = [];

  @Input({ required: true })
  protected selector: {
    startDate: Date;
    days: number;
    plan: IPlan;
  }
    = {
      plan: { id: 0 } as IPlan,
      startDate: new Date(),
      days: 1,
    };

  protected formDirective = new FormGroup({
    calendario: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl({ value: '', disabled: true }, Validators.required)
  });

  protected onSubmit() {
    const iso = new Date(this.StartDateControl.value);
    iso.setDate(iso.getDate() + 1);
    iso.setHours(0, 0, 0, 0);

    this.service
      .postCalendarioPlanSignal(
        this.CalendarioControl.value,
        this.selector.plan.id!,
        iso,
      )
      .subscribe({
        next: response => {
          this.reporting.success('Evento creado exitosamente');
          this.onSuccess();
          return this.activeModal.close();
        },
        error: error => {
          this.reporting.error('Ocurrió un error al crear el evento');
        },
      });
  }

  protected close() {
    this.activeModal.close();
  }

  public ngOnInit() {
    this.StartDateControl.valueChanges.subscribe(value => {
      const endDate = new Date(value);
      endDate.setDate(new Date(value).getDate() + this.selector.days);
      this.EndDateControl.setValue(endDate.toISOString().split('T')[0]);
    });

    this.StartDateControl.setValue(this.selector.startDate.toISOString().split('T')[0]);
  }

  get CalendarioControl(): FormControl {
    return this.formDirective.get('calendario') as FormControl;
  }

  get StartDateControl(): FormControl {
    return this.formDirective.get('startDate') as FormControl;
  }

  get EndDateControl(): FormControl {
    return this.formDirective.get('endDate') as FormControl;
  }
}
