import { Component, HostListener, OnChanges, SimpleChanges ,Input, OnInit } from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { Color } from '@swimlane/ngx-charts';
import { HistorialPorMes } from '../../chartData';
import { PlanGeneralService } from '../../../../../../services/generalPlan.service';

@Component({
  selector: 'app-my-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './line-barChart.component.html'
})
export class LineChartComponent implements OnInit {
  @Input() selectedMonthYear: string = '';
  multi: any[] = [];
  view: [number, number] = [0, 0];
  showLegend = false;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showXAxisLabel = true;
  xAxisLabel = 'Mes';
  showYAxisLabel = true;
  yAxisLabel = 'Monto';
  colorScheme: Color = {
    domain: ['#03B9AB', '#D91616'],
    name: 'ordinal',
    selectable: true,
    group: ScaleType.Ordinal
  };
  noData = false;

  constructor(private planGeneralService: PlanGeneralService) {}

  ngOnInit() {
    this.updateChartDimensions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedMonthYear']) {
      this.loadHistorialPorMes();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateChartDimensions();
  }

  private updateChartDimensions() {
    const width = window.innerWidth * 0.7;
    const height = 400;
    this.view = [width, height];
  }

  private loadHistorialPorMes() {
    HistorialPorMes(this.planGeneralService, this.selectedMonthYear).subscribe(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        this.multi = data;
        this.noData = false;
      } else {
        this.noData = true;
      }
    }, error => {
      console.error('Error loading historical data:', error);
      this.noData = true;
    });
  }
}
