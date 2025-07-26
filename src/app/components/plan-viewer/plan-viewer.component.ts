import { Route, RouterLink, RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { routes } from '../../app.routes';

@Component({
  imports: [RouterLink, RouterOutlet],
  templateUrl: './plan-viewer.component.html',
  styleUrl: './plan-viewer.component.scss',
  selector: 'app-plan-viewer',
  standalone: true,
})
export class PlanViewerComponent {
  private authService = inject(AuthService);
  protected permittedRoutes: Route[] = [];
  protected appRoutes: any;

  ngOnInit() {
    this.appRoutes = routes.find(route => route.path === 'beacon')
      ?.children?.find(route => route.path === 'app')
      ?.children?.find(route => route.path === 'plan-viewer');

    if (this.appRoutes && this.appRoutes.children) {
      this.permittedRoutes = this.authService.getPermittedRoutes(this.appRoutes.children);
    }
  }
}
