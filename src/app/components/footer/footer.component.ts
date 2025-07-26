import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit, AfterContentChecked {
  isAuthenticated = false;
  private previousAuthState = false;

  constructor(
    private navigationService: NavigationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.check();
    this.previousAuthState = this.isAuthenticated;
  }

  ngAfterContentChecked(): void {
    const currentAuthState = this.authService.check();
    if (this.previousAuthState !== currentAuthState) {
      this.isAuthenticated = currentAuthState;
      this.previousAuthState = currentAuthState;
    }
  }

  goTo(): void {
    this.navigationService.goToTop();
  }
}
