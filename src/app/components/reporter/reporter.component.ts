import { Component, inject, OnInit } from '@angular/core';
import { AngularToastifyModule, ToastService } from 'angular-toastify';

import { ReportingService } from '../../services/reporting.service';

@Component({
  templateUrl: './reporter.component.html',
  styleUrl: './reporter.component.scss',
  imports: [AngularToastifyModule],
  selector: 'app-reporter',
  standalone: true,
})
export class ReporterComponent implements OnInit {
  private service = inject(ReportingService);
  private toastify = inject(ToastService);
  ngOnInit(): void {
    this.service
      .events
      .subscribe((event) => {
        switch (event.type) {
          case "success":
            this.toastify.success(event.message);
            break;
          case "error":
            this.toastify.error(event.message);
            break;
          case "info":
            this.toastify.info(event.message);
            break;
          case "warn":
            this.toastify.warn(event.message);
            break;
        }
      });
  }
}