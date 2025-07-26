import { Component, inject, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SummaryPreviewComponent } from '../../plan-viewer/summary-preview/summary-preview.component';
import { IPlan } from '../../../interfaces';

@Component({
  selector: 'app-calendar-plan',
  styleUrls: ['./calendar-plan.component.scss'],
  templateUrl: './calendar-plan.component.html',
  standalone: true,
})
export class CalendarPlanComponent {
  @Input({ required: true })
  public plan!: IPlan;

  @Input({ required: true })
  public openCreateEventPreview = (plan: IPlan & { duration: number }, start_date?: Date) => void 0;

  private modalService = inject(NgbModal);

  private getDuration(periodo: string): number {
    switch (periodo) {
      case 'SEMANAL':
        return 7;
      case 'QUINCENAL':
        return 14;
      case 'MENSUAL':
        return 30;
      default:
        return 1;
    }
  }

  protected getEventData(plan: IPlan): string {
    return JSON.stringify({
      ...plan,
      duration: this.getDuration(plan.periodo),
    });
  }

  protected openPlanPreview() {
    const modalRef = this.modalService.open(SummaryPreviewComponent, { size: 'lg' });
    modalRef.componentInstance.plan = this.plan;
  }

  protected handlePlanAddSubmenu() {
    const duration = this.getDuration(this.plan.periodo);
    const planx = { ...this.plan, duration };
    this.openCreateEventPreview(planx);
  }
}
