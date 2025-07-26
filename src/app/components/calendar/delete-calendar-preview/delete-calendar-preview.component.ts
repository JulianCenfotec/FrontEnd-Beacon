import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { CalendarioService } from '../../../services/calendario.service';
import { ReportingService } from '../../../services/reporting.service';
import { ICalendario } from '../../../interfaces';

//@collapse
@Component({
  selector: 'app-delete-calendar-preview',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './delete-calendar-preview.component.html',
  styleUrl: './delete-calendar-preview.component.scss'
})
export class DeleteCalendarPreviewComponent implements OnInit {
  private activeModal = inject(NgbActiveModal);
  private reporting = inject(ReportingService);
  private service = inject(CalendarioService);

  @Input({ required: true })
  protected onSuccess: Function = () => { };

  @Input({ required: true })
  protected calendario: ICalendario = {
    calendarioIngresosImprevistos: [],
    calendarioGastosImprevistos: [],
    calendarioPlans: [],
    usuario: {},
    nombre: '',
    id: 0,
  };

  protected formDirective = new FormGroup({
    nombre: new FormControl('', Validators.required)
  });

  protected onSubmit() {
    this.service
      .del(this.calendario.id)
      .subscribe({
        next: () => {
          this.reporting.success('Calendario eliminado correctamente');
          this.onSuccess();
          this.activeModal.close();
        },
        error: (error) => {
          this.reporting.error('Error al eliminar el calendario');
        }
      });
  }

  protected close() {
    this.activeModal.close();
  }

  public ngOnInit() {
    this.NombreControl.setValue(this.calendario.nombre);
    this.NombreControl.disable();
  }

  get NombreControl() : FormControl {
    return this.formDirective.controls.nombre as FormControl;
  }
}


