import { Component, Input, inject, ViewChild, ElementRef } from '@angular/core';
import { IFeedBackMessage, IBanks, IFeedbackStatus} from '../../../../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BankService } from '../../../../../../services/bank.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportingService } from '../../../../../../services/reporting.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bank-delete-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './bank-delete-form.component.html',
  styleUrl: './bank-delete-form.component.scss'
})
export class BankFormComponentDeleteFormComponent {
  
  @Input() title!: string;
  @Input() bank: IBanks = {
    nombre: "",
    tasaAhorro: undefined,
    tasaUnificacion: undefined,
    tasaCredito: undefined
  };
  @Input() action: string = 'delete';
  constructor(private activeModal: NgbActiveModal) { };
  private snackBar = inject(MatSnackBar);
  service = inject(BankService);
  private reporting = inject(ReportingService);
  

  handleDelete(bank: IBanks) {
    this.service.deleteBankSignal(bank).subscribe({
      next: () => {
        this.closeModal();
        this.reporting.success(`El banco ha sido eliminado con éxito.`);
      },
      error: (error: any) => {
        this.reporting.error("Error: " + error.message);
      }
    });
  }

  closeModal() {
    this.activeModal.close();
  }
}

