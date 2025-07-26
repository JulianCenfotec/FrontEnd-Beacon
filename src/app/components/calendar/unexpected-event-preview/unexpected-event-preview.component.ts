import { NgFor } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ICalendario, IEtiqueta } from '../../../interfaces';
import { CalendarioService } from '../../../services/calendario.service';
import { ReportingService } from '../../../services/reporting.service';

@Component({
  templateUrl: './unexpected-event-preview.component.html',
  styleUrl: './unexpected-event-preview.component.scss',
  selector: 'app-unexpected-event-preview',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
})
export class UnexpectedEventPreviewComponent {
  private activeModal = inject(NgbActiveModal);
  private reporting = inject(ReportingService);
  private service = inject(CalendarioService);
  
  @Input({ required: true })
  protected onSuccess: Function = () => { };

  @Input({ required: true })
  protected calendarios: Array<ICalendario> = [];

  @Input({ required: true })
  protected selector = { startDate: new Date() };

  protected formDirective = new FormGroup({
    monto: new FormControl('', [Validators.required, Validators.min(1)]),
    tipo: new FormControl('ingreso', Validators.required),
    calendario: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    nombre: new FormControl('', Validators.required),
  });

  protected onSubmit() {
    const iso = new Date(this.StartDateControl.value);
    iso.setDate(iso.getDate() + 1);
    iso.setHours(0, 0, 0, 0);

    switch (this.TipoControl.value) {
      case 'ingreso':
        this.service
          .postCalendarioIngresoSignal(
            this.CalendarioControl.value,
            {
              etiqueta: { id: 1 } as IEtiqueta,
              nombre: this.NombreControl.value,
              monto: this.MontoControl.value,
            },
            iso,
          )
          .subscribe({
            next: () => {
              this.reporting.success('Ingreso creado correctamente');
              this.onSuccess();
              this.activeModal.close();
            },
            error: (error) => {
              this.reporting.error('Error al crear el ingreso');
            }
          });
        break;
      case 'gasto':
        this.service
          .postCalendarioGastoSignal(
            this.CalendarioControl.value,
            {
              etiqueta: { id: 1 } as IEtiqueta,
              nombre: this.NombreControl.value,
              monto: this.MontoControl.value,
              deuda: null
            },
            iso,
          )
          .subscribe({
            next: () => {
              this.reporting.success('Gasto creado correctamente');
              this.onSuccess();
              this.activeModal.close();
            },
            error: (error) => {
              this.reporting.error('Error al crear el gasto');
            }
          });
        break;
      default:
        this.reporting.error('Tipo de evento no soportado');
        break;
    }
  }

  protected close() {
    this.activeModal.close();
  }

  public ngOnInit() {
    this.StartDateControl
      .setValue(this.selector.startDate.toISOString().split('T')[0]);
  }

  get StartDateControl(): FormControl {
    return this.formDirective.get('startDate') as FormControl;
  }

  get CalendarioControl(): FormControl {
    return this.formDirective.get('calendario') as FormControl;
  }

  get TipoControl(): FormControl {
    return this.formDirective.get('tipo') as FormControl;
  }

  get MontoControl(): FormControl {
    return this.formDirective.get('monto') as FormControl;
  }

  get NombreControl(): FormControl {
    return this.formDirective.get('nombre') as FormControl;
  }
}
