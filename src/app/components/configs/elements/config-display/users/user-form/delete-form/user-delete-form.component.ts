import { Component, Input, inject, ViewChild, ElementRef } from '@angular/core';
import { IFeedBackMessage, IUser, IFeedbackStatus} from '../../../../../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ReportingService} from "../../../../../../../services/reporting.service";



@Component({
  selector: 'app-user-delete-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './user-delete-form.component.html',
  styleUrl: './user-delete-form.component.scss'
})
export class UserDeleteFormComponent {
  
  @Input() title!: string;
  @Input() user: IUser = {
    email: '',
    lastname: '',
    password: '',
    name: ''
  };
  @Input() action: string = 'delete';
  constructor(private modalService: NgbModal) {};
  private snackBar = inject(MatSnackBar);
  service = inject(UserService);
  private reporting = inject(ReportingService);
  

  handleDelete(user: IUser) {
    this.service.deleteUserSignal(user).subscribe({
      next: () => {
        this.closeModal();
        this.reporting.success("Usuario eliminado correctamente.");
      },
      error: (error: any) => {
        this.reporting.error("Ha ocurrido un error. No se pudo eliminar.")
      }
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }
}

