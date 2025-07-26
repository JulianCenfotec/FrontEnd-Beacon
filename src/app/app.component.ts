import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReporterComponent } from "./components/reporter/reporter.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ReporterComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'demo-angular-front';
}
