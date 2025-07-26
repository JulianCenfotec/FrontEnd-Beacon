import { Component, Input, OnInit, inject } from '@angular/core';
import { ISubscriptionPlan } from '../../../../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { SubscriptionPlanService } from '../../../../../../services/subscriptionPlan.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportingService } from '../../../../../../services/reporting.service';

@Component({
  selector: 'app-subPlan-modify-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './subscriptionPlan-form.component.html',
})
export class SubscriptionPlanFormComponent implements OnInit {
  @Input() title!: string;
  @Input() action: string = 'add';
  @Input() subscriptionPlan: ISubscriptionPlan = {
    titulo: '',
    descripcion: '',
    precio: 0,
    plazo: 0,
  };
  public formRegistroDirective!: FormGroup;
  private initialValues: any;
  public hasChanges: boolean = false;
  service = inject(SubscriptionPlanService);
  private reporting = inject(ReportingService);
  private snackBar = inject(MatSnackBar);

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.formRegistroDirective = new FormGroup({
      id: new FormControl(this.subscriptionPlan.id),
      titulo: new FormControl(this.subscriptionPlan.titulo, [Validators.required]),
      descripcion: new FormControl(this.subscriptionPlan.descripcion, [Validators.required]),
      precio: new FormControl(this.subscriptionPlan.precio, [Validators.required, Validators.min(0.01)]),
      plazo: new FormControl(this.subscriptionPlan.plazo, [Validators.required, Validators.pattern('^[1-9][0-9]*$')]),
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
      this.service[this.action === 'add' ? 'saveSubscriptionPlanSignal' : 'updateSubscriptionPlanSignal'](this.formRegistroDirective.value).subscribe({
        next: () => {
          this.closeModal();
          this.reporting.success(`Plan ${this.action === 'add' ? 'añadido' : 'actualizado'} con éxito.`);
          this.service.getAllSignal();
        },
        error: (error: any) => {
          this.reporting.error('Error: ' + error.message);
        }
      });
    }
  }

  get titulo(): FormControl {
    return this.formRegistroDirective.get('titulo') as FormControl;
  }

  get descripcion(): FormControl {
    return this.formRegistroDirective.get('descripcion') as FormControl;
  }

  get precio(): FormControl {
    return this.formRegistroDirective.get('precio') as FormControl;
  }

  get plazo(): FormControl {
    return this.formRegistroDirective.get('plazo') as FormControl;
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  private areValuesEqual(initialValues: any, currentValues: any): boolean {
    return JSON.stringify(initialValues) === JSON.stringify(currentValues);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.formRegistroDirective.get(field);
    return control ? control.touched && control.invalid : false;
  }

  hasGeneralErrors(): boolean {
    return ['titulo', 'descripcion', 'precio', 'plazo'].some(field => this.isFieldInvalid(field));
  }

  hasTasaErrors(): boolean {
    return ['precio', 'plazo'].some(field => this.isFieldInvalid(field));
  }

  hasTasaRequiredError(): boolean {
    return ['precio', 'plazo'].some(field => this.getFieldError(field, 'required'));
  }

  hasTasaMinError(): boolean {
    return ['precio'].some(field => this.getFieldError(field, 'min'));
  }

  hasTasaMaxError(): boolean {
    return ['plazo'].some(field => this.getFieldError(field, 'pattern'));
  }

  getFieldError(field: string, errorType: string): boolean {
    const control = this.formRegistroDirective.get(field);
    return control ? control.touched && control.hasError(errorType) : false;
  }
}
