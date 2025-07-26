import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '../../../../services/layout.service';
import { AuthService } from '../../../../services/auth.service';
import { SvgIconComponent } from '../../../svg-icon/svg-icon.component';
import { routes } from '../../../../app.routes';

@Component({
  selector: 'app-configbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    SvgIconComponent
  ],
  templateUrl: './configbar.component.html',
})
export class ConfigbarComponent implements OnInit {
  public authService = inject(AuthService);
  permittedRoutes: Route[] = [];
  appRoutes: any;
  hasAdminOptions: boolean = false;
  
  ngOnInit() {
    this.appRoutes = routes.find(route => route.path === 'beacon')?.children?.find(route => route.path === 'configuration');
    if (this.appRoutes && this.appRoutes.children) {
      this.permittedRoutes = this.authService.getPermittedRoutes(this.appRoutes.children);
      this.hasAdminOptions = this.permittedRoutes.some(route => route.data && route.data['showInSidebar'] && route.data['adminOption']);
    } else {
      console.error('Configuration route not found or has no children');
    }
  }
}
