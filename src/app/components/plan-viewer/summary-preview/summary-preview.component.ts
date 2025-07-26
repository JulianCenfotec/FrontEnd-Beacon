import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPlan } from '../../../services/plan.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-summary-preview',
  standalone: true,
  imports: [NgFor],
  templateUrl: './summary-preview.component.html',
  styleUrl: './summary-preview.component.scss'
})
export class SummaryPreviewComponent {
  @Input()
  protected plan!: IPlan;
  
  private activeModal = inject(NgbActiveModal);
  
  protected close() {
    this.activeModal.close();
  }
}
