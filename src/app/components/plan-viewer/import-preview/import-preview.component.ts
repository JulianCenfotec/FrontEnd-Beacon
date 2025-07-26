import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { IPlan, PlanService } from '../../../services/plan.service';
import { NgFor, NgIf } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportingService } from '../../../services/reporting.service';
import { Router } from '@angular/router';

enum Periodo {
  SEMANAL = 'SEMANAL',
  QUINCENAL = 'QUINCENAL',
  MENSUAL = 'MENSUAL',
}

@Component({
  selector: 'app-import-preview',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './import-preview.component.html',
  styleUrls: ['./import-preview.component.scss']
})
export class ImportPreviewComponent implements OnInit {
  @Input()
  protected plan!: IPlan;
  protected planForm!: FormGroup;
  protected periodos = Object.values(Periodo);

  private activeModal = inject(NgbActiveModal);
  private reporting = inject(ReportingService);
  private service = inject(PlanService);
  private routing = inject(Router);
  private fb = inject(FormBuilder);

  private createGastos(gastos: typeof this.plan.gastos): FormGroup[] {
    return gastos.map(gasto => this.fb.group({
      id: [gasto.id],
      etiqueta: [gasto.etiqueta, Validators.required],
      deuda: [gasto.deuda],
      nombre: [gasto.nombre, Validators.required],
      monto: [gasto.monto, [Validators.required, Validators.min(1)]]
    }));
  }

  private createIngresos(ingresos: typeof this.plan.ingresos): FormGroup[] {
    return ingresos.map(ingreso => this.fb.group({
      id: [ingreso.id],
      etiqueta: [ingreso.etiqueta, Validators.required],
      nombre: [ingreso.nombre, Validators.required],
      monto: [ingreso.monto, [Validators.required, Validators.min(1)]]
    }));
  }

  protected onSubmit() {
    if (this.planForm.valid && !this.checkFormErrors) {
      const formSaldo = this.planForm.get('saldo');
      if (!formSaldo) return this.reporting.error('Ocurrió un error al importar el plan.');

      const formMonto = this.planForm.get('monto');
      if (!formMonto) return this.reporting.error('Ocurrió un error al importar el plan.');

      if (isNaN(formSaldo.value) || isNaN(formMonto.value)) {
        return this.reporting.error('Ocurrió un error al importar el plan. Por favor, revise los montos ingresados.');
      }

      this.plan = this.planForm.value;
      this.plan.id = undefined;
      this.plan.usuario = {};
      this.plan.anterior = null;
      this.plan.sistema = false;
      this.plan.compartida = false;
      this.plan.monto = Number(formMonto.value);
      this.plan.saldo = Number(formSaldo.value);
      
      for (const ingreso of this.plan.ingresos) {
        ingreso.id = undefined;
      }
      for (const gasto of this.plan.gastos) {
        gasto.id = undefined;
      }

      this.service
        .postPlanSignal(this.plan)
        .subscribe({
          next: (plan: IPlan) => {
            this.reporting.success('Plan importado exitosamente a su cuenta.');
            this.routing.navigate(['/beacon/app/plan-viewer/user']);
            this.activeModal.close();
          },
          error: error => {
            this.reporting.error('Ocurrió un error al importar el plan.');
            console.error(error);
          }
        });
    }
    else {
      this.reporting.error('El formulario contiene errores, por favor corrija los campos marcados.');
    }
  }

  protected close() {
    this.activeModal.close();
  }

  public ngOnInit(): void {
    const plan = this.plan;
    this.planForm = this.fb.group({
      id: [plan.id],
      titulo: [plan.titulo, Validators.required],
      descripcion: [plan.descripcion],
      periodo: [plan.periodo],
      saldo: [{ value: plan.saldo, disabled: true }, Validators.required],
      monto: [{ value: plan.monto, disabled: true }, Validators.required],
      recurrente: [plan.recurrente],
      sistema: [plan.sistema],
      compartida: [plan.compartida],
      gastos: this.fb.array(this.createGastos(plan.gastos)),
      ingresos: this.fb.array(this.createIngresos(plan.ingresos)),
    });
    this.updateMonto();
  }

  get gastos(): FormArray {
    return this.planForm.get('gastos') as FormArray;
  }

  get ingresos(): FormArray {
    return this.planForm.get('ingresos') as FormArray;
  }

  updateMonto() {
    const formMonto = this.planForm.get('monto');
    if (!formMonto) return;

    const formSaldos = this.planForm.get('saldo');
    if (!formSaldos) return;

    formSaldos.setErrors(null);
    formMonto.setErrors(null);

    let saldo = 0;
    let monto = 0;

    for (const ingreso of this.ingresos.controls) {
      const income = ingreso.get('monto');
      if (income) {
        const valor = Number(income.value);
        if (isNaN(valor)) {
          income.setErrors({ invalid: true });
          formSaldos.setValue(0);
          formMonto.setValue(0);
          return;
        }
        else {
          const arreglo = parseFloat(valor.toFixed(2));
          income.setValue(arreglo);
          saldo += arreglo;
        }
      }
    }

    for (const gasto of this.gastos.controls) {
      const expense = gasto.get('monto');
      if (expense) {
        const valor = Number(expense.value);
        if (isNaN(valor)) {
          expense.setErrors({ invalid: true });
          formSaldos.setValue(0);
          formMonto.setValue(0);
          return;
        }
        else {
          const arreglo = parseFloat(valor.toFixed(2));
          expense.setValue(arreglo);
          monto += arreglo;
        };
      }
    }

    formMonto.setValue(parseFloat(monto.toFixed(2)));
    saldo -= parseFloat(monto.toFixed(2));
    formSaldos.setValue(parseFloat(saldo.toFixed(2)));

    if (monto < 0) {
      formMonto.setErrors({ invalid: true });
      formSaldos.setValue(0);
    }

    if (saldo < 0) {
      formSaldos.setErrors({ invalid: true });
      formSaldos.setValue(0);
    }
  }

  get checkFormErrors(): boolean {
    return this.checkControlErrors(this.planForm);
  }

  private checkControlErrors(control: AbstractControl): boolean {
    if (control.errors) {
      return true;
    }

    if (control instanceof FormGroup) {
      for (const key in control.controls) {
        if (control.controls.hasOwnProperty(key)) {
          if (this.checkControlErrors(control.controls[key])) {
            return true;
          }
        }
      }
    }

    if (control instanceof FormArray) {
      for (const subControl of control.controls) {
        if (this.checkControlErrors(subControl)) {
          return true;
        }
      }
    }

    return false;
  }
}
