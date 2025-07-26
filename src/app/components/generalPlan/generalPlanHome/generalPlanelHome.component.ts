import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { PlanCreationComponent } from '../planGestor/planCreation/planCreation.component';
import { setFaviconBeacon } from '../../../utility/page-icon.utility';
import { Router, RouterLink } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LineChartComponent } from './charts/LineBar/LineBar-Vertical/line-barChart.component';
import { LineChartHorizontalComponent } from './charts/LineBar/LineBar-Horizontal/line-barChart.component';
import { AuthService } from '../../../services/auth.service';
import { PlanGeneralService } from '../../../services/generalPlan.service';
import { NgxPrintModule } from 'ngx-print';
import { IGasto, IIngreso } from '../../../interfaces';

@Component({
  selector: 'app-general-plan',
  standalone: true,
  imports: [
    CommonModule,
    PlanCreationComponent,
    ReactiveFormsModule,
    NgxChartsModule,
    LineChartComponent,
    LineChartHorizontalComponent,
    RouterLink,
    NgxPrintModule
  ],
  templateUrl: './generalPlanelHome.component.html',
  styleUrls: ['./generalPlanelHome.component.scss'],
})
export class GeneralPlanHomeComponent implements OnInit {
  private windowTitle = "Panel General | Aplicación | Beacon";
  private authService = inject(AuthService);
  private planGeneralService = inject(PlanGeneralService);
  private router = inject(Router);

  protected totalGastosToShow: string = '';
  protected totalIngresosToShow: string = '';
  protected monthlyTotalsGastos: { [monthYear: string]: number } = {};
  protected monthlyTotalsIngresos: { [monthYear: string]: number } = {};
  protected currentMonthYear: string = '';
  protected dailyTotalsGastos: { [date: string]: number } = {};
  protected dailyTotalsIngresos: { [date: string]: number } = {};
  protected currentDate: string = '';
  protected dailyGastosToShow: string = '';
  protected dailyIngresosToShow: string = '';
  protected currentDateInput: string = '';  
  protected selectedDate: string = '';    
  protected selectedMonthYear: string = ''; 

  ngOnInit(): void {
    window.document.title = this.windowTitle;
    this.setCurrentDateAndMonth(); 
    this.cargaDeDatos(); 
    this.updateSelectedDate(new Date()); 
    this.selectedMonthYear = this.currentMonthYear; 
    console.log(this.selectedMonthYear);
  }

  gestionarPlantillas(): void {  
    this.router.navigateByUrl("/beacon/app/plan-viewer");
  }
  
  gestionarRegistros(): void {  
    this.router.navigateByUrl("/beacon/error-page");
  }

  setCurrentDateAndMonth(): void {
    const now = new Date();
    this.currentDate = `${now.getFullYear()}-${('0' + (now.getMonth() + 1)).slice(-2)}-${('0' + now.getDate()).slice(-2)}`;
    this.currentMonthYear = `${now.getFullYear()}-${('0' + (now.getMonth() + 1)).slice(-2)}`;
    this.currentDateInput = this.currentDate; 
  }

  cargaDeDatos(): void {
    let totalGastos = 0;
    let totalIngresos = 0;
  
    this.monthlyTotalsGastos = {};
    this.monthlyTotalsIngresos = {};
    this.dailyTotalsGastos = {};
    this.dailyTotalsIngresos = {};
  
    this.planGeneralService.getCalendarioFromUserSignal().subscribe({
      next: (data) => {
        data.forEach(calendario => {
          if (Array.isArray(calendario.calendarioPlans)) {
            calendario.calendarioPlans.forEach(plan => {
              const fechaInicio = new Date(plan.fechaInicio);
              const monthYear = `${fechaInicio.getFullYear()}-${('0' + (fechaInicio.getMonth() + 1)).slice(-2)}`;
              const date = `${fechaInicio.getFullYear()}-${('0' + (fechaInicio.getMonth() + 1)).slice(-2)}-${('0' + fechaInicio.getDate()).slice(-2)}`;
  
              if (!this.monthlyTotalsGastos[monthYear]) {
                this.monthlyTotalsGastos[monthYear] = 0;
              }
              if (!this.monthlyTotalsIngresos[monthYear]) {
                this.monthlyTotalsIngresos[monthYear] = 0;
              }
              if (!this.dailyTotalsGastos[date]) {
                this.dailyTotalsGastos[date] = 0;
              }
              if (!this.dailyTotalsIngresos[date]) {
                this.dailyTotalsIngresos[date] = 0;
              }
  
              if (Array.isArray(plan.plan.gastos)) {
                plan.plan.gastos.forEach(gasto => {
                  totalGastos += gasto.monto;
                  if (date === this.currentDate) {
                    this.dailyTotalsGastos[date] += gasto.monto;
                  }
                  if (monthYear === this.currentMonthYear) {
                    this.monthlyTotalsGastos[monthYear] += gasto.monto;
                  }
                });
              }
  
              if (Array.isArray(plan.plan.ingresos)) {
                plan.plan.ingresos.forEach(ingreso => {
                  totalIngresos += ingreso.monto;
                  if (date === this.currentDate) {
                    this.dailyTotalsIngresos[date] += ingreso.monto;
                  }
                  if (monthYear === this.currentMonthYear) {
                    this.monthlyTotalsIngresos[monthYear] += ingreso.monto;
                  }
                });
              }
            });
          }

          if (Array.isArray(calendario.calendarioGastosImprevistos)) {
            calendario.calendarioGastosImprevistos.forEach(calendarioGastosImprevistos => {
              const fechaInicio = new Date(calendarioGastosImprevistos.fechaInicio);
              const monthYear = `${fechaInicio.getFullYear()}-${('0' + (fechaInicio.getMonth() + 1)).slice(-2)}`;
              const date = `${fechaInicio.getFullYear()}-${('0' + (fechaInicio.getMonth() + 1)).slice(-2)}-${('0' + fechaInicio.getDate()).slice(-2)}`;
  
              if (!this.monthlyTotalsGastos[monthYear]) {
                this.monthlyTotalsGastos[monthYear] = 0;
              }
              if (!this.dailyTotalsGastos[date]) {
                this.dailyTotalsGastos[date] = 0;
              }
  
              const gasto = calendarioGastosImprevistos.gasto;
              totalGastos += gasto.monto;
              if (date === this.currentDate) {
                this.dailyTotalsGastos[date] += gasto.monto;
              }
              if (monthYear === this.currentMonthYear) {
                this.monthlyTotalsGastos[monthYear] += gasto.monto;
              }
            });
          }

          if (Array.isArray(calendario.calendarioIngresosImprevistos)) {
            calendario.calendarioIngresosImprevistos.forEach(calendarioIngresosImprevistos => {
              const fechaInicio = new Date(calendarioIngresosImprevistos.fechaInicio);
              const monthYear = `${fechaInicio.getFullYear()}-${('0' + (fechaInicio.getMonth() + 1)).slice(-2)}`;
              const date = `${fechaInicio.getFullYear()}-${('0' + (fechaInicio.getMonth() + 1)).slice(-2)}-${('0' + fechaInicio.getDate()).slice(-2)}`;
  
              if (!this.monthlyTotalsIngresos[monthYear]) {
                this.monthlyTotalsIngresos[monthYear] = 0;
              }
              if (!this.dailyTotalsIngresos[date]) {
                this.dailyTotalsIngresos[date] = 0;
              }
  
              const ingreso = calendarioIngresosImprevistos.ingreso;
              totalIngresos += ingreso.monto;
              if (date === this.currentDate) {
                this.dailyTotalsIngresos[date] += ingreso.monto;
              }
              if (monthYear === this.currentMonthYear) {
                this.monthlyTotalsIngresos[monthYear] += ingreso.monto;
              }
            });
          }
        });
  
        const newTotalGastosToShow = `${totalGastos.toFixed(2)} CRC`;
        const newTotalIngresosToShow = `${totalIngresos.toFixed(2)} CRC`;
  
        if (this.totalGastosToShow !== newTotalGastosToShow) {
          this.totalGastosToShow = newTotalGastosToShow;
        }
        if (this.totalIngresosToShow !== newTotalIngresosToShow) {
          this.totalIngresosToShow = newTotalIngresosToShow;
        }
  
        this.dailyGastosToShow = `${(this.dailyTotalsGastos[this.currentDate] || 0).toFixed(2)} CRC`;
        this.dailyIngresosToShow = `${(this.dailyTotalsIngresos[this.currentDate] || 0).toFixed(2)} CRC`;
      },
      error: (err) => {
        console.error('Error retrieving data:', err);
      }
    });
  }
  

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selectedDate = input.value;

    if (selectedDate === '') {
      const currentDate = new Date();
      this.currentDate = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}-${('0' + currentDate.getDate()).slice(-2)}`;
    } else {
      this.currentDate = selectedDate;
    }

    this.currentMonthYear = this.currentDate.slice(0, 7);
    this.currentDateInput = this.currentDate;
    
    const dateObject = new Date(`${this.currentDate}T00:00:00`);
    this.updateSelectedDate(dateObject);
    
    this.selectedMonthYear = this.currentMonthYear; 
    this.cargaDeDatos();
  }
  

  updateSelectedDate(date: Date): void {
    this.selectedDate = this.formatDateToSpanish(date);
  }
  
  formatDateToSpanish(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const monthNamesSpanish = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const month = monthNamesSpanish[date.getMonth()];
    const year = date.getFullYear();
    return `${day} de ${month} de ${year}`;
  }
  
}