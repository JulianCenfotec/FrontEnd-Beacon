import { Component, Input, OnInit, inject } from '@angular/core';
import { IBanks } from '../../../../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { BankService } from '../../../../../../services/bank.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportingService } from '../../../../../../services/reporting.service';

@Component({
  selector: 'app-bank-modify-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './bank-form.component.html',
})
export class BankFormComponent implements OnInit {
  @Input() title!: string;
  @Input() action: string = 'add';
  @Input() bank: IBanks = {
    nombre: "",
    tasaAhorro: undefined,
    tasaUnificacion: undefined,
    tasaCredito: undefined
  };
  public formRegistroDirective!: FormGroup;
  private initialValues: any;
  public hasChanges: boolean = false;
  service = inject(BankService);
  private reporting = inject(ReportingService);
  private snackBar = inject(MatSnackBar);

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.formRegistroDirective = new FormGroup({
      id: new FormControl(this.bank.id),
      nombre: new FormControl(this.bank.nombre, [Validators.required]),
      tasaAhorro: new FormControl(this.bank.tasaAhorro, [Validators.required, Validators.min(0.01), Validators.max(100), this.twoDecimalPlacesValidator]),
      tasaUnificacion: new FormControl(this.bank.tasaUnificacion, [Validators.required, Validators.min(0.01), Validators.max(100), this.twoDecimalPlacesValidator]),
      tasaCredito: new FormControl(this.bank.tasaCredito, [Validators.required, Validators.min(0.01), Validators.max(100), this.twoDecimalPlacesValidator])
    });

    this.initialValues = this.formRegistroDirective.value;

    this.formRegistroDirective.valueChanges.subscribe(() => {
      this.hasChanges = !this.areValuesEqual(this.initialValues, this.formRegistroDirective.value);
    });
  }

  handleAction(): void {
    if (this.formRegistroDirective.invalid) {
      Object.keys(this.formRegistroDirective.controls).forEach(controlName => {
        this.formRegistroDirective.controls[controlName].markAsTouched();
      });
      return;
    } else {
      this.service[this.action === 'add' ? 'saveBankSignal' : 'updateBankSignal'](this.formRegistroDirective.value).subscribe({
        next: () => {
          this.closeModal();
          this.reporting.success(`Banco ${this.action === 'add' ? 'agregado' : 'actualizado'} exitosamente`);
          this.service.getAllSignal();
        },
        error: (error: any) => {
          this.reporting.error('Error: ' + error.message);
        }
      });
    }
  }

  get nombre(): FormControl {
    return this.formRegistroDirective.get('nombre') as FormControl;
  }

  get tasaAhorro(): FormControl {
    return this.formRegistroDirective.get('tasaAhorro') as FormControl;
  }

  get tasaUnificacion(): FormControl {
    return this.formRegistroDirective.get('tasaUnificacion') as FormControl;
  }

  get tasaCredito(): FormControl {
    return this.formRegistroDirective.get('tasaCredito') as FormControl;
  }

  closeModal() {
    this.activeModal.close();
  }

  twoDecimalPlacesValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && !/^\d+(\.\d{1,2})?$/.test(value)) {
      return { 'twoDecimalPlaces': true };
    }
    return null;
  }

  private areValuesEqual(initialValues: any, currentValues: any): boolean {
    return JSON.stringify(initialValues) === JSON.stringify(currentValues);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.formRegistroDirective.get(field);
    return control ? control.touched && control.invalid : false;
  }

  hasGeneralErrors(): boolean {
    return ['nombre', 'tasaAhorro', 'tasaCredito', 'tasaUnificacion'].some(field => this.isFieldInvalid(field));
  }

  hasTasaErrors(): boolean {
    return ['tasaAhorro', 'tasaCredito', 'tasaUnificacion'].some(field => this.isFieldInvalid(field));
  }

  hasTasaRequiredError(): boolean {
    return ['tasaAhorro', 'tasaCredito', 'tasaUnificacion'].some(field => this.getFieldError(field, 'required'));
  }

  hasTasaMinError(): boolean {
    return ['tasaAhorro', 'tasaCredito', 'tasaUnificacion'].some(field => this.getFieldError(field, 'min'));
  }

  hasTasaMaxError(): boolean {
    return ['tasaAhorro', 'tasaCredito', 'tasaUnificacion'].some(field => this.getFieldError(field, 'max'));
  }

  hasTasaDecimalError(): boolean {
    return ['tasaAhorro', 'tasaCredito', 'tasaUnificacion'].some(field => this.getFieldError(field, 'twoDecimalPlaces'));
  }

  getFieldError(field: string, errorType: string): boolean {
    const control = this.formRegistroDirective.get(field);
    return control ? control.touched && control.hasError(errorType) : false;
  }
}
