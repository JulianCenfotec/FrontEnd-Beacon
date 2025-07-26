import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, inject, Input } from '@angular/core';
import { NgIf } from '@angular/common';

import { ICalendarioPlan, ICalendarioGasto, ICalendarioIngreso } from '../../../interfaces';
import { CalendarioService } from '../../../services/calendario.service';
import { ReportingService } from '../../../services/reporting.service';

enum EventType {
  Plan = "Plan",
  Gasto = "Gasto",
  Ingreso = "Ingreso",
  Otro = "Otro",
}

@Component({
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './delete-event-preview.component.html',
  styleUrl: './delete-event-preview.component.scss',
  selector: 'app-delete-event-preview',
  standalone: true,
})
export class DeleteEventPreviewComponent {
  private activeModal = inject(NgbActiveModal);
  private reporting = inject(ReportingService);
  private service = inject(CalendarioService);

  @Input({ required: true })
  protected onSuccess: Function = () => { };

  @Input({ required: true })
  protected selector: {
    nombre: string;
    startDate: Date;
    descripcion: string;

    type: EventType;
    plan: ICalendarioPlan;
    gasto: ICalendarioGasto;
    ingreso: ICalendarioIngreso;
  }
    = {
      startDate: new Date(),
      nombre: 'No especificado',
      descripcion: 'No hay descripción por el momento',

      type: EventType.Otro,
      plan: { id: 0 } as ICalendarioPlan,
      gasto: { id: 0 } as ICalendarioGasto,
      ingreso: { id: 0 } as ICalendarioIngreso,
    };

  protected deleteConfirmed = false;
  protected formDirective = new FormGroup({
    confirmDelete: new FormControl(false, Validators.requiredTrue),
    nombre: new FormControl(this.selector.nombre, Validators.required),
    descripcion: new FormControl(this.selector.descripcion, Validators.required),
    fecha: new FormControl(this.selector.startDate, Validators.required),  // Nuevo campo de fecha
  });

  private deleteIngreso() {
    if (!this.selector.ingreso.id) {
      this.reporting.error('No se puede eliminar el ingreso.');
      return console.error('No se puede eliminar el ingreso.');
    }

    this.service
      .deleteCalendarioIngresoSignal(this.selector.ingreso.id)
      .subscribe({
        next: () => {
          this.reporting.success('Ingreso eliminado con éxito.');
          this.onSuccess();
          return this.close();
        },
        error: () => this.reporting.error('No se pudo eliminar el ingreso.'),
      });
  }
  private deleteGasto() {
    if (!this.selector.gasto.id) {
      this.reporting.error('No se puede eliminar el gasto.');
      return console.error('No se puede eliminar el gasto.');
    }

    this.service
      .deleteCalendarioGastoSignal(this.selector.gasto.id)
      .subscribe({
        next: () => {
          this.reporting.success('Gasto eliminado con éxito.');
          this.onSuccess();
          return this.close();
        },
        error: () => this.reporting.error('No se pudo eliminar el gasto.'),
      });
  }
  private deletePlan() {
    if (!this.selector.plan.id) {
      this.reporting.error('No se puede eliminar el plan.');
      return console.error('No se puede eliminar el plan.');
    }

    this.service
      .deleteCalendarioPlanSignal(this.selector.plan.id)
      .subscribe({
        next: () => {
          this.reporting.success('Plan eliminado con éxito.');
          this.onSuccess();
          return this.close();
        },
        error: () => this.reporting.error('No se pudo eliminar el plan.'),
      });
  }

  protected onSubmit() {
    if (this.deleteConfirmed) {
      switch (this.selector.type) {
        case EventType.Ingreso:
          return this.deleteIngreso();
        case EventType.Gasto:
          return this.deleteGasto();
        case EventType.Plan:
          return this.deletePlan();
        default:
          this.reporting.error('No se puede eliminar el evento.');
          return console.error('No se puede eliminar el evento.');
      }
    }
  }

  protected close() {
    this.activeModal.close();
  }

  public ngOnInit() {
    if (!this.selector.ingreso)
      this.selector.ingreso = { id: 0 } as ICalendarioIngreso;

    if (!this.selector.gasto)
      this.selector.gasto = { id: 0 } as ICalendarioGasto;

    if (!this.selector.plan)
      this.selector.plan = { id: 0 } as ICalendarioPlan;

    if (!this.selector.type)
      this.selector.type = EventType.Otro;

    if (!this.selector.nombre)
      this.selector.nombre = 'No especificado';

    if (!this.selector.descripcion)
      this.selector.descripcion = 'No hay descripción por el momento';

    if (!this.selector.startDate)
      this.selector.startDate = new Date();

    this.ConfirmDeleteControl.setValue(false);
    this.NombreControl.setValue(this.selector.nombre);
    this.FechaControl.setValue(this.selector.startDate.toISOString().split('T')[0]);
    this.DescripcionControl.setValue(this.selector.descripcion);
    this.ConfirmDeleteControl.valueChanges.subscribe(value => this.deleteConfirmed = Boolean(value));

    this.FechaControl.disable();
    this.NombreControl.disable();
    this.DescripcionControl.disable();
  }

  get ConfirmDeleteControl(): FormControl {
    return this.formDirective.get('confirmDelete') as FormControl;
  }

  get NombreControl(): FormControl {
    return this.formDirective.get('nombre') as FormControl;
  }

  get DescripcionControl(): FormControl {
    return this.formDirective.get('descripcion') as FormControl;
  }

  get FechaControl(): FormControl {
    return this.formDirective.get('fecha') as FormControl;
  }
}