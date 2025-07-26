import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterLink } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { setFaviconBeacon } from '../../utility/page-icon.utility';
import { CommonModule } from '@angular/common';
import { GeneralFinances, Account, PaymentsReceipts, Features } from '../../data/faq';

@Component({
  selector: 'help-center-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.scss']
})
export class HelpCenterComponent implements OnInit, AfterViewInit {
  isAuthenticated = false;
  private windowTitle = 'Centro de Ayuda | Beacon';

  generalFinances = GeneralFinances;
  accountDetails = Account;
  paymentsReceipts = PaymentsReceipts;
  featuresInformation = Features;

  constructor(
    private renderer: Renderer2,
    private navigationService: NavigationService,
  ) {}

  ngOnInit() {
    window.document.title = this.windowTitle;
    setFaviconBeacon();
  }

  ngAfterViewInit() {
    this.navigationService.addClickHandlers(this.renderer);
  }
}
