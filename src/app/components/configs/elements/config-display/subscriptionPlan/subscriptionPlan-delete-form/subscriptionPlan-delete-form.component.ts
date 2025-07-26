import { Component, Input, inject, ViewChild, ElementRef } from '@angular/core';
import { IFeedBackMessage, ISubscriptionPlan, IFeedbackStatus } from '../../../../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubscriptionPlanService } from '../../../../../../services/subscriptionPlan.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportingService } from '../../../../../../services/reporting.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-subPlan-delete-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './subscriptionPlan-delete-form.component.html',
  styleUrl: './subscriptionPlan-delete-form.component.scss'
})
export class SubscriptionPlanDeleteFormComponent {

  @Input() title!: string;
  @Input() subscriptionPlan: ISubscriptionPlan = {
    titulo: '',
    descripcion: '',
    precio: 0,
    plazo: 0,
  };
  @Input() action: string = 'delete';
  constructor(private activeModal: NgbActiveModal) { };
  private snackBar = inject(MatSnackBar);
  service = inject(SubscriptionPlanService);
  private reporting = inject(ReportingService);


  handleDelete(subscriptionPlan: ISubscriptionPlan) {
    this.service.deleteSubscriptionPlanSignal(subscriptionPlan).subscribe({
      next: () => {
        this.closeModal();
        this.reporting.success(`Plan eliminado con éxito.`);
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

