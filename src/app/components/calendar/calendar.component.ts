import { CalendarOptions, CustomContentGenerator, EventClickArg, EventContentArg, EventDropArg } from '@fullcalendar/core';
import interactionPlugin, { DateClickArg, Draggable, DropArg } from '@fullcalendar/interaction';
import { Component, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FullCalendarModule } from '@fullcalendar/angular';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import { NgFor, NgIf } from '@angular/common';
import listPlugin from '@fullcalendar/list';

import { ICalendario, ICalendarioPlan, IGasto, IIngreso, IPlan } from '../../interfaces';
import { UnexpectedEventPreviewComponent } from './unexpected-event-preview/unexpected-event-preview.component';
import { DeleteCalendarPreviewComponent } from './delete-calendar-preview/delete-calendar-preview.component';
import { PostcalendarPreviewComponent } from './postcalendar-preview/postcalendar-preview.component';
import { DeleteEventPreviewComponent } from './delete-event-preview/delete-event-preview.component';
import { CalendarPlanListComponent } from './calendar-plan-list/calendar-plan-list.component';
import { EventPreviewComponent } from './event-preview/event-preview.component';
import { CalendarioService } from '../../services/calendario.service';
import { ReportingService } from '../../services/reporting.service';
import { setFaviconBeacon } from '../../utility/page-icon.utility';


@Component({
  imports: [FullCalendarModule, CalendarPlanListComponent, NgbTooltipModule, NgFor, NgIf],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  selector: 'app-calendar',
  standalone: true,
})
export class CalendarComponent implements AfterViewInit {
  @ViewChild('sidebar', { static: false })
  private sidebar!: ElementRef<HTMLElement>;

  private windowTitle = "Planificador Financiero | Aplicación | Beacon";
  private reporting = inject(ReportingService);
  private service = inject(CalendarioService);
  private modalService = inject(NgbModal);
  protected activeCalendarIds: Array<number> = [];
  protected calendars: Array<ICalendario> = [];

  protected calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, bootstrap5Plugin],
    views: {
      listMonth: {
        eventContent: function (eventInfo: CustomContentGenerator<EventContentArg> & { event: { title: string } }) {
          return { html: eventInfo.event.title };
        }
      }
    },

    eventClick: this.handleEventClick.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    dateClick: this.handleDateClick.bind(this),
    drop: this.handleDrop.bind(this),

    moreLinkContent: (args) => `${args.num} más`,
    noEventsText: 'No hay eventos que mostrar',
    initialView: 'dayGridMonth',
    allDayText: 'Todo el día',
    moreLinkClick: 'popover',
    
    displayEventTime : false,
    dayMaxEventRows: true,
    dayMaxEvents: 4,
    droppable: true,
    editable: true,
    locale: 'es',
    events: [],

    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Lista',
    },
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listMonth',
    },
  };

  private calculateEndDate(startDate: Date, duration: string): Date {
    const days = parseInt(duration.split(' ')[0], 10);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);
    return endDate;
  }

  private getDuration(periodo: string): number {
    switch (periodo) {
      case 'SEMANAL':
        return 7;
      case 'QUINCENAL':
        return 14;
      case 'MENSUAL':
        return 30;
      default:
        return 1;
    }
  }

  private PatchPlanEventDrop(calendar: ICalendario, calendarioPlan: ICalendarioPlan, plan: IPlan, iso: Date) {
    if (!calendarioPlan.hasOwnProperty('id')) {
      this.reporting.error('No se pudo mover el evento con vinculación al calendario.');
      return console.error('No se pudo mover el evento:', iso);
    }

    if (!plan.hasOwnProperty('id')) {
      this.reporting.error('No se pudo mover el evento con la plantilla vinculada.');
      return console.error('No se pudo mover el evento:', iso);
    }
    
    this.service
      .patchCalendarioPlanSignal(
        calendarioPlan.id,
        calendar.id,
        plan.id!,
        iso,
      )
      .subscribe({
        next: () => {
          this.reloadCalendars();
          this.reporting.success('Evento movido exitosamente');
        },
        error: () => this.reporting.error('Ocurrió un error al mover el evento'),
      });
  }

  private handleEventClick(click: EventClickArg) {
    const {
      ingreso, calendarioIngreso,
      gasto, calendarioGasto,
      plan, calendarioPlan,
      description, calendar,
    } = click.event._def.extendedProps;
    const { start } = click.event;

    if (!start) {
      this.reporting.error('No se pudo mover el evento sin una fecha de inicio.');
      return console.error('No se pudo mover el evento:', click.event);
    }

    const modalRef = this.modalService.open(DeleteEventPreviewComponent, { size: 'lg' });
    modalRef.componentInstance.onSuccess = () => this.reloadCalendars();
    modalRef.componentInstance.selector = {
      descripcion: description,
      nombre: click.event.title,
      startDate: new Date(start),

      ingreso: calendarioIngreso,
      gasto: calendarioGasto,
      plan: calendarioPlan,
      type: ingreso ? 'Ingreso'
        : gasto ? 'Gasto'
        : plan ? 'Plan'
        : 'Otro',
    };
  }

  private PatchIngresoEventDrop(calendar: ICalendario, calendarioIngreso: ICalendarioPlan, ingreso: IPlan, iso: Date) {
    if (!calendarioIngreso.hasOwnProperty('id')) {
      this.reporting.error('No se pudo mover el evento con vinculación al calendario.');
      return console.error('No se pudo mover el evento:', iso);
    }

    if (!ingreso.hasOwnProperty('id')) {
      this.reporting.error('No se pudo mover el evento con el ingreso vinculado.');
      return console.error('No se pudo mover el evento:', iso);
    }

    this.service
      .patchCalendarioIngresoSignal(
        calendarioIngreso.id,
        calendar.id,
        { id: ingreso.id! } as IIngreso,
        iso,
      )
      .subscribe({
        next: () => {
          this.reloadCalendars();
          this.reporting.success('Ingreso movido exitosamente');
        },
        error: () => this.reporting.error('Ocurrió un error al mover el evento'),
      });
  }

  private PatchGastoEventDrop(calendar: ICalendario, calendarioGasto: ICalendarioPlan, gasto: IPlan, iso: Date) {
    if (!calendarioGasto.hasOwnProperty('id')) {
      this.reporting.error('No se pudo mover el evento con vinculación al calendario.');
      return console.error('No se pudo mover el evento:', iso);
    }

    if (!gasto.hasOwnProperty('id')) {
      this.reporting.error('No se pudo mover el evento con el gasto vinculado.');
      return console.error('No se pudo mover el evento:', iso);
    }

    this.service
      .patchCalendarioGastoSignal(
        calendarioGasto.id,
        calendar.id,
        { id: gasto.id! } as IGasto,
        iso,
      )
      .subscribe({
        next: () => {
          this.reloadCalendars();
          this.reporting.success('Gasto movido exitosamente');
        },
        error: () => this.reporting.error('Ocurrió un error al mover el evento'),
      });
  }

  private handleEventDrop(drop: EventDropArg) {
    drop.jsEvent.preventDefault();
    const {
      ingreso, calendarioIngreso,
      gasto, calendarioGasto,
      plan, calendarioPlan,
      calendar,
    } = drop.event._def.extendedProps;
    const { start } = drop.event;

    if (!calendar.hasOwnProperty('id')) {
      this.reporting.error('No se pudo mover el evento con el calendario vinculado.');
      return console.error('No se pudo mover el evento:', drop.event);
    }

    if (!start) {
      this.reporting.error('No se pudo mover el evento sin una fecha de inicio.');
      return console.error('No se pudo mover el evento:', drop.event);
    }

    const iso = new Date(start);
    iso.setHours(0, 0, 0, 0);

    console.log(
      { calendarioIngreso, ingreso },
      { calendarioGasto, gasto },
      { calendarioPlan, plan },
      { calendar, iso },
    );
    if (plan) return this.PatchPlanEventDrop(calendar, calendarioPlan, plan, iso);
    if (ingreso) return this.PatchIngresoEventDrop(calendar, calendarioIngreso, ingreso, iso);
    if (gasto) return this.PatchGastoEventDrop(calendar, calendarioGasto, gasto, iso);
    return this.reporting.error('No se pudo mover el evento');
  }

  private handleDateClick(arg: DateClickArg) {
    console.info('Fecha seleccionada: ' + arg.date);

    const modalRef = this.modalService.open(UnexpectedEventPreviewComponent, { size: 'lg' });
    modalRef.componentInstance.selector = { startDate: new Date(arg.date) };
    modalRef.componentInstance.onSuccess = () => this.reloadCalendars();
    modalRef.componentInstance.calendarios = this.calendars;
  }

  private handleDrop(info: DropArg) {
    if (this.calendarOptions.events) {
      const data: IPlan & { duration: number } = JSON.parse(info.draggedEl.getAttribute('data-event') || '{}');

      // ? Atrributes must include id and duration for the plan.
      if (Object.keys(data).length === 0) return;
      if (!data.hasOwnProperty('id')) return;
      if (!data.hasOwnProperty('duration')) return;

      this.openCreateEventPreview(data, info.date);
      this.reloadCalendarEvents();
    }
  }

  protected handleCreateCalendar(){
    const modalRef = this.modalService.open(PostcalendarPreviewComponent, { size: 'lg' });
    modalRef.componentInstance.onSuccess = () => this.reloadCalendars();
  }

  private reloadCalendarEvents() {
    const eventos: typeof this.calendarOptions.events = [];

    for (const calendar of this.calendars) {
      if (this.activeCalendarIds.includes(calendar.id)) {
        const planes = calendar.calendarioPlans
          .map(calendarioPlan => {
            const { plan } = calendarioPlan;
            const duration = this.getDuration(plan.periodo);
            const fechaInicio = new Date(calendarioPlan.fechaInicio);
            const fechaFinal = this.calculateEndDate(fechaInicio, duration.toString());
            return {
              end: fechaFinal,
              start: fechaInicio,
              title: plan.titulo,
              description: plan.descripcion,
              extendedProps: {
                description: plan.descripcion,
                calendarioPlan,
                duration,
                calendar,
                plan,
              },
            };
          });

        const gastos = calendar.calendarioGastosImprevistos 
          .map(calendarioGasto => {
            const { gasto } = calendarioGasto;
            const fechaInicio = new Date(calendarioGasto.fechaInicio);
            return {
              end: fechaInicio,
              start: fechaInicio,
              title: gasto.nombre,
              description: gasto.nombre,
              extendedProps: {
                description: gasto.nombre,
                calendarioGasto,
                calendar,
                gasto,
              },
            };
          });

        const ingresos = calendar.calendarioIngresosImprevistos
          .map(calendarioIngreso => {
            const { ingreso } = calendarioIngreso;
            const fechaInicio = new Date(calendarioIngreso.fechaInicio);
            return {
              end: fechaInicio,
              start: fechaInicio,
              title: ingreso.nombre,
              description: ingreso.nombre,
              extendedProps: {
                description: ingreso.nombre,
                calendarioIngreso,
                calendar,
                ingreso,
              },
            };
          });

        eventos.push(...planes);
        eventos.push(...gastos);
        eventos.push(...ingresos);
      }
    }

    this.calendarOptions.events = eventos;
  }

  private reloadCalendars() {
    this.service
      .getCalendarioFromUserSignal()
      .subscribe({
        next: (calendars: Array<ICalendario>) => {
          this.calendars = calendars;
          return this.reloadCalendarEvents();
        },
        error: (error: any) => this.reporting.error('Error al cargar los calendarios.'),
      });
  }

  protected openCreateEventPreview(plan: IPlan & { duration: number }, start_date?: Date) {
    if (!(start_date instanceof Date)) start_date = new Date();
    const extract: IPlan = { ...plan };
    const { duration } = plan;

    const modalRef = this.modalService.open(EventPreviewComponent, { size: 'lg' });
    modalRef.componentInstance.selector = { startDate: start_date, days: duration, plan: extract };
    modalRef.componentInstance.onSuccess = () => this.reloadCalendars();
    modalRef.componentInstance.calendarios = this.calendars;
    return void 0;
  }

  protected handleCalendarActivate(calendar: ICalendario, event: Event) {
    event.preventDefault();

    if (event.target instanceof HTMLInputElement && !event.target.checked) {
      this.activeCalendarIds = this.activeCalendarIds
        .filter(id => id !== calendar.id);

      this.reloadCalendarEvents();
      return;
    }

    this.activeCalendarIds.push(calendar.id);
    this.reloadCalendars();
  }

  protected handleCalendarDeletion(calendar: ICalendario, event: Event) {
    event.preventDefault();

    const modalRef = this.modalService.open(DeleteCalendarPreviewComponent, { size: 'lg' });
    modalRef.componentInstance.onSuccess = () => this.reloadCalendars();
    modalRef.componentInstance.calendario = calendar;
    this.reloadCalendars();
  }

  public ngOnInit() {
    window.document.title = this.windowTitle;
    setFaviconBeacon();
    this.reloadCalendars();
  }

  public ngAfterViewInit() {
    if (this.sidebar) {
      new Draggable(this.sidebar.nativeElement, {
        itemSelector: '.plan-card',
        eventData: function (eventEl) {
          return JSON.parse(eventEl.getAttribute('data-event') || '{}');
        },
      });
    }
  }

  get openCreateEventPreviewAsProperty() {
    return this.openCreateEventPreview.bind(this);
  }
}