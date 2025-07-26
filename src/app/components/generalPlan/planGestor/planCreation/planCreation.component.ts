import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Periodo, IRoleType, IEtiqueta, IGasto, IIngreso, IPlan } from '../../../../interfaces';
import { AuthService } from '../../../../services/auth.service';
import { ThousandSeparatorService } from '../../../../services/thousand-separator.service';
import { EtiquetaService } from '../../../../services/etiqueta.service';
import { PlanService } from '../../../../services/plan.service';
import { ReportingService } from '../../../../services/reporting.service';
import { setFaviconBeacon } from '../../../../utility/page-icon.utility';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-plan-creation',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './planCreation.component.html',
  styleUrls: ['./planCreation.component.scss']
})
export class PlanCreationComponent implements OnInit {
  private windowTitle = "Creador de Plantillas | Aplicación | Beacon";
  formPlanCreation: FormGroup;
  service = inject(PlanService);
  showIngresos = false;
  showGastos = false;
  private authService = inject(AuthService);
  private etiquetaService = inject(EtiquetaService);
  IRoleType = IRoleType;
  PeriodoList = Object.values(Periodo);
  private reporting = inject(ReportingService);
  etiquetas: IEtiqueta[] = [];
  private router = inject(Router);

  constructor(
    private fb: FormBuilder,
    private thousandSeparatorService: ThousandSeparatorService
  ) {
    this.formPlanCreation = this.fb.group({
      titulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      periodo: [this.PeriodoList[0], [Validators.required]],
      recurrente: [false],
      sistema: [false],
      ingresosArray: this.fb.array([], [Validators.required]),
      gastosArray: this.fb.array([], [Validators.required])
    });
  }

  get titulo() {
    return this.formPlanCreation.get('titulo');
  }

  get descripcion() {
    return this.formPlanCreation.get('descripcion');
  }

  get periodo() {
    return this.formPlanCreation.get('periodo');
  }

  get recurrente() {
    return this.formPlanCreation.get('recurrente');
  }

  get sistema() {
    return this.formPlanCreation.get('sistema');
  }
  
  get ingresosArray(): FormArray {
    return this.formPlanCreation.get('ingresosArray') as FormArray;
  }

  get gastosArray(): FormArray {
    return this.formPlanCreation.get('gastosArray') as FormArray;
  }

  addField(type: 'ingreso' | 'gasto'): void {
    const fieldGroup = this.fb.group({
      label: [type === 'ingreso' ? 'Nombre de ingreso' : 'Nombre de gasto'],
      nombre: ['', [Validators.required]],
      monto: ['', [Validators.required, Validators.min(1), this.montoValidator()]],
      etiqueta: ['', [Validators.required]],
    });
  

    if (type === 'ingreso') {
      this.showIngresos = true;
      this.ingresosArray.push(fieldGroup);
    } else {
      this.showGastos = true;
      this.gastosArray.push(fieldGroup);
    }
  }

  removeField(index: number, type: 'ingreso' | 'gasto'): void {
    let fieldArray: FormArray;
  
    if (type === 'ingreso') {
      fieldArray = this.ingresosArray;
    } else {
      fieldArray = this.gastosArray;
    }
  
    fieldArray.removeAt(index);
  
    if (fieldArray.length === 0) {
      if (type === 'ingreso') {
        this.showIngresos = false;
      } else {
        this.showGastos = false;
      }
    }
  }

  montoValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;

      if (value == null || value === '') {
        return null; 
      }

      const decimalPattern = /^\d+(\.\d{1,2})?$/;

      if (!decimalPattern.test(value)) {
        return { 'montoInvalid': true };
      }

      const leadingZeroPattern = /^0\d/;
      if (leadingZeroPattern.test(value) && value !== '0') {
        return { 'montoInvalid': true };
      }

      return null;
    };
  }

  ngOnInit() {
    this.loadEtiquetas();
    window.document.title = this.windowTitle;
    setFaviconBeacon();
  }

  isAdmin(): boolean {
    return this.authService.hasAnyRole([IRoleType.admin, IRoleType.superAdmin]);
  }

  loadEtiquetas(): void {
    this.etiquetaService.getAllSignal().subscribe({
      next: (data: IEtiqueta[]) => {
        this.etiquetas = data;
      },
      error: (err: any) => {
        console.error('Error loading etiquetas', err);
      }
    });
  }

  handleAction(): void {
    if (this.formPlanCreation.invalid) {
      Object.keys(this.formPlanCreation.controls).forEach(controlName => {
        this.formPlanCreation.controls[controlName].markAsTouched();
      });
      return;
    } else {      
      const ingresos: IIngreso[] = this.ingresosArray.value.map((ingreso: any) => ({
        etiqueta: ingreso.etiqueta as IEtiqueta,
        nombre: ingreso.nombre,
        monto: ingreso.monto
      }));
  
      const gastos: IGasto[] = this.gastosArray.value.map((gasto: any) => ({
        etiqueta: gasto.etiqueta as IEtiqueta,
        deuda: null,
        nombre: gasto.nombre,
        monto: gasto.monto
      }));
  
      const totalIngresos = ingresos.reduce((acc, ingreso) => acc + ingreso.monto, 0);
      const monto = gastos.reduce((acc, gasto) => acc + gasto.monto, 0);
      const saldo = totalIngresos - monto;

      if (monto < 0) {
        this.reporting.error('Error: Los gastos totales siempre deben ser mayor a 0.');
        return;
      }
    
      if (saldo < 0) {
        this.reporting.error('Error: Los ingresos totales deben ser mayores o iguales a los gastos totales.');
        return;
      }

      const plan: IPlan = {
        titulo: this.titulo?.value,
        descripcion: this.descripcion?.value,
        periodo: this.periodo?.value,
        recurrente: this.recurrente?.value,
        sistema: this.sistema?.value,
        ingresos: ingresos,
        gastos: gastos,
        usuario: {},
        anterior: null,
        saldo: saldo,
        monto: monto,
        compartida: false
      };
  
      this.service.savePlanSignal(plan).subscribe({
        next: () => {
          this.reporting.success(`Plan creado con éxito`);
          setTimeout(() => {
            this.router.navigateByUrl("/beacon/app/plan-viewer");
          }, 1000);
        },
        error: (error: any) => {
          this.reporting.error('Error: ' + error.message);
        }
      });
    }
  }
}
