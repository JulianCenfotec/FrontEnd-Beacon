import { Component, inject } from '@angular/core';
import { ReportingService } from '../../../services/reporting.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IRoleType } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';
import { PlanService, IPlan } from '../../../services/plan.service';
import { ImportPreviewComponent } from '../import-preview/import-preview.component';
import { SummaryPreviewComponent } from '../summary-preview/summary-preview.component';
import { NgFor, NgIf } from '@angular/common';
import { setFaviconBeacon } from '../../../utility/page-icon.utility';

@Component({
  selector: 'app-shared-plans',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './shared-plans.component.html',
  styleUrl: './shared-plans.component.scss'
})
export class SharedPlansComponent {
  private windowTitle = "Plantillas de la Comunidad | Aplicación | Beacon";
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
    this.service.getPlanIfSharedSignal()
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
