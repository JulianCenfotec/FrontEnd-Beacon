import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MainSidebarComponent } from '../../components/dashboard/app-sidebar/sidebar.component';
import { MainTopbarComponent } from '../../components/dashboard/app-topbar/topbar.component';
import { SidebarService } from '../../services/side.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { setFaviconBeacon } from '../../utility/page-icon.utility';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MainSidebarComponent, 
    MainTopbarComponent,
    RouterOutlet
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  @ViewChild('mainContent', { static: true }) mainContent!: ElementRef;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.isCollapsed$.subscribe((isCollapsed) => {
      this.adjustMainContentMargin(isCollapsed);
    });
    setFaviconBeacon();
  }

  private adjustMainContentMargin(isCollapsed: boolean) {
    if (this.mainContent) {
      if (isCollapsed) {
        this.mainContent.nativeElement.classList.add('collapsed');
      } else {
        this.mainContent.nativeElement.classList.remove('collapsed');
      }
    }
  }
}
