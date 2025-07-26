import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { SidebarService } from '../../../services/side.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IRoleType } from '../../../interfaces';
import { SubscriptionPlanService } from '../../../services/subscriptionPlan.service';
import { ReportingService } from '../../../services/reporting.service';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgIf,
  ],
})
export class MainSidebarComponent implements OnInit {
  private suscriptionService = inject(SubscriptionPlanService);
  private navigationService = inject(NavigationService);
  private sidebarService = inject(SidebarService);
  private reporting = inject(ReportingService);
  private authService = inject(AuthService);
  private router = inject(Router);
  protected hasActiveSubscription = false;
  protected isCollapsed = true;

  private applyCollapseClasses() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('collapsed', this.isCollapsed);
    }
  }

  goTo(): void {
    this.navigationService.goToTop();
  }

  logout(): void {
    if (this.authService.check()) {
      this.authService.logout();
      this.goTo();
      this.router.navigateByUrl('/beacon/home');
    }
  }

  public ngOnInit() {
    this.sidebarService
      .isCollapsed$
      .subscribe((isCollapsed) => {
        this.isCollapsed = isCollapsed;
        this.applyCollapseClasses();
      });

    this.suscriptionService
      .getUserSubscriptionSignal()
      .subscribe({
        next: (subscriptions) => {
          this.hasActiveSubscription = subscriptions
            .some((subscription) => Date.now() < new Date(subscription.endOfSuscriptionAt).getTime());
        },
        error: (error) => {
          this.reporting.error('Error al verificar suscripción activa.');
        }
      });
  }

  get isAdministrator(): boolean {
    return this.authService
      .hasRole(IRoleType.superAdmin);
  }
}
