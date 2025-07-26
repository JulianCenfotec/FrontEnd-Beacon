import { Component, OnInit, Input, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ISubscriptionPlan } from '../../../../../interfaces';
import { SubscriptionPlanService } from '../../../../../services/subscriptionPlan.service';
import { ProfileService } from '../../../../../services/profile.service';
import { FormGroup, FormsModule } from '@angular/forms';
import { SubscriptionPlanFormComponent } from './subscriptionPlan-form/subscriptionPlan-form.component';
import { SubscriptionPlanDeleteFormComponent } from './subscriptionPlan-delete-form/subscriptionPlan-delete-form.component';
import { setFaviconBeacon } from '../../../../../utility/page-icon.utility';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-subPlan-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    SubscriptionPlanFormComponent,
    SubscriptionPlanDeleteFormComponent,
  ],
  templateUrl: './subscriptionPlan.component.html',
})
export class ConfigSubscriptionPlanComponent implements OnInit {
  private windowTitle = 'Ajustes de Suscripciones | Configuraciones | Beacon';
  public formRegistroDirective!: FormGroup;
  @Input() title!: string;
  @Input() action: string = 'add';
  @Input() size?: string;
  public subscriptionList: ISubscriptionPlan[] = [];
  private service = inject(SubscriptionPlanService);
  public profileService = inject(ProfileService);
  public currentSubscription: ISubscriptionPlan = {
    titulo: '',
    descripcion: '',
    precio: 0,
    plazo: 0,
  };

  constructor(private modalService: NgbModal) {
    this.service.getAllSignal();
    effect(() => {
      this.subscriptionList = this.service.subscriptionPlan$();
    });
  }

  ngOnInit() {
    window.document.title = this.windowTitle;
    setFaviconBeacon();
    this.profileService.getUserInfoSignal();
  }

  trackById(index: number, item: ISubscriptionPlan): number {
    return item.id!;
  }

  openFormModal() {
    this.currentSubscription = {
      titulo: '',
      descripcion: '',
      precio: 0,
      plazo: 0,
    };
    const modalRef: NgbModalRef = this.modalService.open(SubscriptionPlanFormComponent, {
      ariaLabelledBy: 'modal-component',
      centered: true,
      size: this.size ?? 'lg',
    });
    modalRef.componentInstance.subscriptionPlan = this.currentSubscription;
    modalRef.componentInstance.action = 'add';
    modalRef.componentInstance.title = 'Agregar Plan de Suscripción';
  }

  showDetail(subscriptionPlan: ISubscriptionPlan) {
    this.currentSubscription = { ...subscriptionPlan };
    const modalRef = this.modalService.open(SubscriptionPlanFormComponent, {
      ariaLabelledBy: 'modal-component',
      centered: true,
      size: this.size ?? 'lg',
    });
    modalRef.componentInstance.subscriptionPlan = this.currentSubscription;
    modalRef.componentInstance.action = 'update';
    modalRef.componentInstance.title = 'Modificar Plan de Suscripción';
  }

  deletePlan(subscriptionPlan: ISubscriptionPlan) {
    this.currentSubscription = { ...subscriptionPlan };
    const modalRef = this.modalService.open(SubscriptionPlanDeleteFormComponent, {
      ariaLabelledBy: 'modal-component',
      centered: true,
      size: this.size ?? 'lg',
    });
    modalRef.componentInstance.title = 'Eliminar Plan de Suscripción';
    modalRef.componentInstance.subscriptionPlan = this.currentSubscription;
  }
}
