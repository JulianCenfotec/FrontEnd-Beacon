import { Component, OnInit, Input, inject, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { IBanks } from "../../../../../interfaces";
import { BankService } from "../../../../../services/bank.service";
import { ProfileService } from "../../../../../services/profile.service";
import { FormsModule } from "@angular/forms";
import { BankFormComponent } from "./banks-form/bank-form.component";
import { BankFormComponentDeleteFormComponent } from "./banks-delete-form/bank-delete-form.component";
import { setFaviconBeacon } from "../../../../../utility/page-icon.utility";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-subPlan-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    BankFormComponent,
    BankFormComponentDeleteFormComponent,
  ],
  templateUrl: "./banks.component.html",
  styleUrls: ["./banks.component.scss"],
})
export class ConfigBanksComponent implements OnInit {
  private windowTitle = "Ajustes de Intereses | Configuraciones | Beacon";

  @Input() title!: string;
  @Input() action: string = "add";
  @Input() size?: string;
  public bankList: IBanks[] = [];
  private bankService = inject(BankService);
  public profileService = inject(ProfileService);
  public currentBank: IBanks = {
    nombre: "",
    tasaAhorro: undefined,
    tasaUnificacion: undefined,
    tasaCredito: undefined,
  };

  constructor(private modalService: NgbModal) {
    this.bankService.getAllSignal();
    effect(() => {
      this.bankList = this.bankService.banks$();
    });
  }

  ngOnInit() {
    window.document.title = this.windowTitle;
    setFaviconBeacon();
    this.profileService.getUserInfoSignal();
  }

  trackById(index: number, item: IBanks): number {
    return item.id!;
  }

  openFormModal() {
    this.currentBank = {
      nombre: "",
      tasaAhorro: undefined,
      tasaUnificacion: undefined,
      tasaCredito: undefined,
    };
    const modalRef: NgbModalRef = this.modalService.open(BankFormComponent, {
      ariaLabelledBy: "modal-component",
      centered: true,
      size: this.size ?? "lg",
    });
    modalRef.componentInstance.bank = this.currentBank;
    modalRef.componentInstance.action = "add";
    modalRef.componentInstance.title = "Agregar Banco";
  }

  showDetail(bank: IBanks) {
    this.currentBank = { ...bank };
    const modalRef = this.modalService.open(BankFormComponent, {
      ariaLabelledBy: "modal-component",
      centered: true,
      size: this.size ?? "lg",
    });
    modalRef.componentInstance.bank = this.currentBank;
    modalRef.componentInstance.action = "update";
    modalRef.componentInstance.title = "Modificar Banco";
  }

  deleteBank(bank: IBanks) {
    this.currentBank = { ...bank };
    const modalRef = this.modalService.open(
      BankFormComponentDeleteFormComponent,
      {
        ariaLabelledBy: "modal-component",
        centered: true,
        size: this.size ?? "lg",
      }
    );
    modalRef.componentInstance.title = "Eliminar Banco";
    modalRef.componentInstance.bank = this.currentBank;
  }
}
