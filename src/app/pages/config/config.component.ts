import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ConfigsComponent } from '../../components/configs/configs.component';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [
  NavbarComponent,
  ConfigsComponent,
  FooterComponent
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent {

}
