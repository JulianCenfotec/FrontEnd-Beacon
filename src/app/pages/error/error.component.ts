import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterLink } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { AuthService } from '../../services/auth.service';
import { setFaviconBeacon } from '../../utility/page-icon.utility';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'error-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorPageComponent implements OnInit {
  isAuthenticated = false;
  private windowTitle = 'Página de Error | Beacon';

  constructor(
    private navigationService: NavigationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    window.document.title = this.windowTitle;
    setFaviconBeacon();
    this.isAuthenticated = this.authService.check();
  }

  goTo() {
    this.navigationService.goToTop();
  }
}
