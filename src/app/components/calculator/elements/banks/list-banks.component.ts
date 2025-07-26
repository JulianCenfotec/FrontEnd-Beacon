import { Component, OnInit, Output, EventEmitter, inject, Input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankService } from '../../../../services/bank.service';
import { IBanks } from '../../../../interfaces';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ReportingService } from '../../../../services/reporting.service';

@Component({
  selector: 'app-list-banks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list-banks.component.html',
  styleUrls: ['./list-banks.component.scss']
})
export class ListBanksComponent implements OnInit {
  @Input() calculatorType!: string;
  public banks: IBanks[] = [];
  private reporting = inject(ReportingService);
  public filteredBanks: IBanks[] = [];
  public selectedBank: IBanks | null = null;
  @Output() bankSelected = new EventEmitter<{ bank: IBanks | null, customInterest: number | null, calculatorType: string }>();
  private service = inject(BankService);
  private activeModal = inject(NgbActiveModal);
  public interestForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.service.getAllSignal();
    effect(() => {
      this.banks = this.service.banks$();
      this.filteredBanks = this.banks;
    });

    this.interestForm = this.fb.group({
      customInterest: new FormControl('', [
        Validators.required,
        Validators.min(0.01),
        Validators.max(100),
        Validators.pattern(/^\d+([.,]\d{1,2})?$/),
      ])
    });
  }

  ngOnInit(): void {}

  searchBank(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredBanks = this.banks.filter(bank =>
      bank.nombre?.toLowerCase().includes(searchTerm)
    );
  }

  setCustomInterest(event: any) {
    let value = event.target.value;

    value = value.replace(',', '.');

    const control = this.interestForm.get('customInterest');
    control?.setValue(value);

    control?.markAsTouched();
    control?.markAsDirty();

    control?.updateValueAndValidity();
  }

  selectBank(bank: IBanks) {
    this.selectedBank = bank;
    this.bankSelected.emit({ bank: this.selectedBank, customInterest: null, calculatorType: this.calculatorType });
    setTimeout(() => this.reporting.success("La tasa de interés se ha selecionado correctamente."), 0);
    this.activeModal.close();
  }

  confirmSelection() {
    if (this.interestForm.valid) {
      const customInterest = parseFloat(this.interestForm.get('customInterest')?.value);
      this.bankSelected.emit({ bank: null, customInterest: customInterest, calculatorType: this.calculatorType });
      setTimeout(() => this.reporting.success("La tasa de interés se ha selecionado correctamente."), 0);
      this.activeModal.close();
    } else {
      this.interestForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  get customInterestControl(): FormControl {
    return this.interestForm.get('customInterest') as FormControl;
  }
}
