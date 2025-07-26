import { Component, inject, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SummaryPreviewComponent } from '../summary-preview/summary-preview.component';
import { ReportingService } from '../../../services/reporting.service';
import { PlanService, IPlan } from '../../../services/plan.service';
import { AuthService } from '../../../services/auth.service';
import { IRoleType } from '../../../interfaces';
import { NgFor, NgIf } from '@angular/common';
import { SharePreviewComponent } from '../share-preview/share-preview.component';
import { setFaviconBeacon } from '../../../utility/page-icon.utility';

@Component({
  selector: 'app-user-plans',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './user-plans.component.html',
  styleUrl: './user-plans.component.scss'
})
export class UserPlansComponent implements OnInit {
  private windowTitle = "Mis Plantillas | Aplicación | Beacon";
  private reporting = inject(ReportingService);
  private authService = inject(AuthService);
  private modalService = inject(NgbModal);
  private service = inject(PlanService);
  protected plans: Array<IPlan> = [];

  protected openPlanPreview(plan: IPlan) {
    const modalRef = this.modalService.open(SummaryPreviewComponent, { size: 'lg' });
    modalRef.componentInstance.plan = plan;
  }

  protected openPlanShare(plan: IPlan) {
    const modalRef = this.modalService.open(SharePreviewComponent, { size: 'lg' });
    modalRef.componentInstance.onSuccess = this.getPlansUser.bind(this);
    modalRef.componentInstance.plan = plan;
  }

  private getPlansUser() {
    this.service.getPlanByUserSignal()
      .subscribe({
        next: (response: Array<IPlan>) => this.plans = response,
        error: (error: any) => this.reporting.error('Ha ocurrido un error al obtener los planes.'),
      });
  }

  get isAdministrator() {
    return this.authService
      .hasRole(IRoleType.superAdmin);
  }

  public ngOnInit() {
    this.getPlansUser();
    window.document.title = this.windowTitle;
    setFaviconBeacon();
  }
}
