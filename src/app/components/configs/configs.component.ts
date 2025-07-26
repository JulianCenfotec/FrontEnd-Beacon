import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../services/layout.service';
import { ConfigDisplayComponent } from './elements/config-display/config-display.component';
import { ConfigbarComponent } from './elements/configbar/configbar.component';

@Component({
  selector: 'app-configs',
  standalone: true,
  imports: [
    CommonModule,
    ConfigbarComponent,
    ConfigDisplayComponent,
    RouterOutlet,
],
  templateUrl: './configs.component.html',
})
export class ConfigsComponent {

}
