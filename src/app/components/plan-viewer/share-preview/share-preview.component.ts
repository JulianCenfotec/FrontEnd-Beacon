import { Component, inject, Input } from '@angular/core';
import { IPlan, PlanService } from '../../../services/plan.service';
import { ReportingService } from '../../../services/reporting.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-share-preview',
  standalone: true,
  imports: [],
  templateUrl: './share-preview.component.html',
  styleUrl: './share-preview.component.scss'
})
export class SharePreviewComponent {
  @Input()
  protected plan!: IPlan;

  @Input()
  protected onSuccess!: () => void;
  
  private activeModal = inject(NgbActiveModal);
  private reporting = inject(ReportingService);
  private service = inject(PlanService);
  protected shared: boolean = false;

  protected share() {
    this.service
      .patchPlanSharedSignal(this.plan)
      .subscribe({
        next: (response: IPlan) => {
          this.onSuccess();
          this.reporting.success('Plan compartido con éxito.');
          this.plan = response;
          this.shared = true;
          this.close();
        },
        error: (error: any) => {
          this.reporting.error('Ha ocurrido un error al compartir el plan.');
          this.shared = false;
        },
      });
  }
  
  protected close() {
    this.activeModal.close();
  }

  ngOnInit() {
    this.shared = false;
  }
}
