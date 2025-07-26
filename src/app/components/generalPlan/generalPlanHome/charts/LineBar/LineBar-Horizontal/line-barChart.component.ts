import { Component, HostListener, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { Color } from '@swimlane/ngx-charts';
import { PlanGeneralService } from '../../../../../../services/generalPlan.service';
import { getGastosDelMes } from '../../chartData';

@Component({
  selector: 'barLine-horizontal-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './line-barChart.component.html'
})
export class LineChartHorizontalComponent implements OnInit, OnChanges {
  @Input() selectedMonthYear: string = '';

  single: any[] = [];
  noData: boolean = false;

  view: [number, number] = [0, 0];

  showLegend = false;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showXAxisLabel = false;
  xAxisLabel = 'Category';
  showYAxisLabel = false;
  yAxisLabel = 'Amount';
  colorScheme: Color = {
    domain: ['#D91616','#FFD6D6'],
    name: 'ordinal',
    selectable: true,
    group: ScaleType.Ordinal
  };

  constructor(private planGeneralService: PlanGeneralService) {}

  ngOnInit() {
    this.updateChartDimensions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedMonthYear']) {
      this.fetchData();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateChartDimensions();
  }

  private updateChartDimensions() {
    const width = window.innerWidth * 0.5;
    const height = 200;

    this.view = [width, height];
  }

  private fetchData() {
    getGastosDelMes(this.planGeneralService, this.selectedMonthYear).subscribe(data => {
      this.single = data;
      this.noData = this.single.length === 0;
    });
  }
}
