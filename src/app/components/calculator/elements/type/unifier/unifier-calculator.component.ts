import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IBanks } from '../../../../../interfaces';
import { ListBanksComponent } from '../../banks/list-banks.component';
import { CommonModule } from '@angular/common';
import { ThousandSeparatorService } from '../../../../../services/thousand-separator.service';
import { setFaviconBeacon } from '../../../../../utility/page-icon.utility';

@Component({
  selector: 'app-unifier-calculator',
  standalone: true,
  imports: [
    CommonModule,
    ListBanksComponent,
    ReactiveFormsModule
  ],
  templateUrl: './unifier-calculator.component.html',
})
export class UnifierCalculatorComponent implements OnInit {
  private windowTitle = 'Calculadora de Unificación de Deudas | Aplicación | Beacon';

  selectedBank!: IBanks;
  bankName: string = "Seleccione una entidad financiera";
  bankInterestRate: number = 0;
  form: FormGroup;

  monthlyPayment: number = 0;
  totalInterestPaid: number = 0;
  totalDebtCost: number = 0;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private thousandSeparatorService: ThousandSeparatorService
  ) {
    this.form = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      months: ['', [Validators.required, Validators.min(1)]],
      bank: ['', Validators.required]
    });
  }

  ngOnInit() { 
    window.document.title = this.windowTitle;
    setFaviconBeacon();
  }

  openBankListModal() {
    const modalRef = this.modalService.open(ListBanksComponent, { size: 'lg' });
    modalRef.componentInstance.calculatorType = 'unificacion';
    modalRef.componentInstance.bankSelected.subscribe((data: { bank: IBanks | null, customInterest: number | null, calculatorType: string }) => {
      if (data.customInterest !== null) {
        this.updateBankDetails('Personalizado', data.customInterest);
      } else if (data.bank) {
        this.selectedBank = data.bank;
        this.updateBankDetails(data.bank.nombre, data.bank.tasaUnificacion);
      }
    });
  }  

  updateBankDetails(name?: string, rate?: number) {
    if (name !== undefined) {
      this.bankName = name;
      this.form.get('bank')?.setValue(name);
    }
    if (rate !== undefined) {
      this.bankInterestRate = rate;
    }
  }

  calculate() {
    if (this.form.valid) {
      const amount = parseFloat(this.form.get('amount')?.value.replace(/,/g, ''));
      const months = this.form.get('months')?.value;
      const interestRate = this.bankInterestRate;

      const monthlyInterestRate = interestRate / 100 / 12;
      this.monthlyPayment = amount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -months));

      this.totalInterestPaid = (this.monthlyPayment * months) - amount;

      this.totalDebtCost = this.monthlyPayment * months;
    } else {
      this.form.markAllAsTouched();
    }
  }

  get amount() {
    return this.form.get('amount');
  }

  get months() {
    return this.form.get('months');
  }

  get bank() {
    return this.form.get('bank');
  }

  onAmountInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const formattedValue = this.thousandSeparatorService.formatNumber(inputElement.value);
    this.amount?.setValue(formattedValue, { emitEvent: false });
  }
}
