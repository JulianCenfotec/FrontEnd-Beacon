import { Component, Input, OnInit, inject } from '@angular/core';
import { PlanService, IPlan } from '../../../services/plan.service';
import { CalendarPlanComponent } from '../plan/calendar-plan.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-plan-list',
  standalone: true,
  templateUrl: './calendar-plan-list.component.html',
  imports: [CommonModule, CalendarPlanComponent]
})
export class CalendarPlanListComponent implements OnInit {
  @Input({ required: true })
  public openCreateEventPreview = (plan: IPlan & { duration: number }, start_date?: Date) => void 0;

  private planService = inject(PlanService);
  protected plans: Array<IPlan> = [];

  ngOnInit() {
    this.planService.getPlanByUserSignal().subscribe({
      next: (plans: Array<IPlan>) => this.plans = plans,
      error: (error: any) => console.error('Error al cargar las plantillas:', error),
    });
  }
}
