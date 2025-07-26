import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  @ViewChild('navbarNav', { static: true }) navbarNav!: ElementRef<HTMLElement>;
  @ViewChild('btnMenu', { static: true }) btnMenu!: ElementRef<HTMLElement>;
  @ViewChild('navbarCollapse', { static: true }) navbarCollapse!: ElementRef<HTMLElement>;

  isAuthenticated = false;

  constructor(
    private renderer: Renderer2,
    private navigationService: NavigationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.navigationService.addClickHandlers(this.renderer);
    this.isAuthenticated = this.authService.check();
  }

  toggleMenu(): void {
    this.navigationService.toggleMenu(this.navbarNav, this.btnMenu);
  }

  onNavItemClick(): void {
    this.navigationService.onNavItemClick(this.navbarNav, this.btnMenu, this.navbarCollapse);
  }

  goTo(): void {
    this.navigationService.goToTop();
  }

  logout(): void {
    if (this.isAuthenticated) {
      this.goTo();
      this.authService.logout();
      this.isAuthenticated = false;
      this.router.navigateByUrl('/beacon/home');
    }
  }
}
