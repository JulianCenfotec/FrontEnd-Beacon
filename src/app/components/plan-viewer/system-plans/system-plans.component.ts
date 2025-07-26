import { Component, inject, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SummaryPreviewComponent } from '../summary-preview/summary-preview.component';
import { ReportingService } from '../../../services/reporting.service';
import { PlanService, IPlan } from '../../../services/plan.service';
import { AuthService } from '../../../services/auth.service';
import { IRoleType } from '../../../interfaces';
import { NgFor, NgIf } from '@angular/common';
import { ImportPreviewComponent } from '../import-preview/import-preview.component';
import { setFaviconBeacon } from '../../../utility/page-icon.utility';

@Component({
  selector: 'app-system-plans',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './system-plans.component.html',
  styleUrl: './system-plans.component.scss'
})
export class SystemPlansComponent implements OnInit {
  private windowTitle = "Plantillas de Sistema | Aplicación | Beacon";
  private reporting = inject(ReportingService);
  private authService = inject(AuthService);
  private modalService = inject(NgbModal);
  private service = inject(PlanService);
  protected plans: Array<IPlan> = [];

  protected openPlanImport(plan: IPlan) {
    const modalRef = this.modalService.open(ImportPreviewComponent, { size: 'lg' });
    modalRef.componentInstance.plan = plan;
  }
  
  protected openPlanPreview(plan: IPlan) {
    const modalRef = this.modalService.open(SummaryPreviewComponent, { size: 'lg' });
    modalRef.componentInstance.plan = plan;
  }

  private getPlansSystem() {
    this.service.getPlanIfSystemSignal()
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
    this.getPlansSystem();
    window.document.title = this.windowTitle;
    setFaviconBeacon();
  }
}
