import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { CalendarioService } from '../../../services/calendario.service';
import { ReportingService } from '../../../services/reporting.service';
import { ICalendario } from '../../../interfaces';

@Component({
  selector: 'app-postcalendar-preview',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './postcalendar-preview.component.html',
  styleUrl: './postcalendar-preview.component.scss'
})
export class PostcalendarPreviewComponent {
  private activeModal = inject(NgbActiveModal);
  private reporting = inject(ReportingService);
  private service = inject(CalendarioService);

  
  @Input({ required: true })
  protected onSuccess: Function = () => { };

  protected formDirective = new FormGroup({
    nombre: new FormControl('', Validators.required)
  });

  protected onSubmit() {
    if (this.formDirective.valid) {
      this.service
        .postCalendarioForUserSignal(this.formDirective.value as ICalendario)
        .subscribe({
          next: () => {
            this.reporting.success('Calendario creado correctamente');
            this.onSuccess();
            this.activeModal.close();
          },
          error: (error) => {
            this.reporting.error('Error al crear el calendario');
          }
        });
    }
  }

  protected close() {
    this.activeModal.close();
  }
}



