import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-calculator-display',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './calculator-display.component.html',
})
export class CalculatorDisplayComponent implements OnInit {
  public authService = inject(AuthService);
  permittedRoutes: Route[] = [];
  appRoutes: any;

  ngOnInit() {
    this.appRoutes = routes.find(route => route.path === 'beacon')
      ?.children?.find(route => route.path === 'app')
      ?.children?.find(route => route.path === 'calculator');
      
    if (this.appRoutes && this.appRoutes.children) {
      this.permittedRoutes = this.authService.getPermittedRoutes(this.appRoutes.children);
    } else {
      console.error('Calculator route not found or has no children');
    }
    console.log('this.permittedRoutes', this.permittedRoutes);
  }
}
