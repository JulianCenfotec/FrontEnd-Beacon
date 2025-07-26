import { Component, AfterViewInit, Renderer2, OnInit, AfterContentChecked } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { NavigationService } from '../../services/navigation.service';
import { setFaviconBeacon } from '../../utility/page-icon.utility';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'homepage',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomepageComponent implements AfterViewInit, OnInit, AfterContentChecked {
  private windowTitle = 'Beacon | Trazando éxitos con valor';
  public isAuthenticated = false;
  private previousAuthState = false;

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private navigationService: NavigationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    window.document.title = this.windowTitle;
    setFaviconBeacon();
    this.isAuthenticated = this.authService.check();
    this.previousAuthState = this.isAuthenticated;
  }

  ngAfterViewInit(): void {
    this.navigationService.addClickHandlers(this.renderer);
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
