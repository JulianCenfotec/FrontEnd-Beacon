import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../../services/side.service';
import { NavigationService } from '../../../services/navigation.service';
import { AuthService } from '../../../services/auth.service'; 

@Component({
  selector: 'app-main-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
})
export class MainTopbarComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    private sidebarService: SidebarService,
    private navigationService: NavigationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.check();
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
  

  goTo(): void {
    this.navigationService.goToTop();
  }

  logout(): void {
    if (this.isAuthenticated) {
      this.authService.logout();
      this.isAuthenticated = false;
      this.router.navigateByUrl('/beacon/home');
      this.goTo();
    }
  }
}
