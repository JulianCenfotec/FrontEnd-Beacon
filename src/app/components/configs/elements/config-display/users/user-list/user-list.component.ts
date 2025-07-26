import { Component, effect, inject } from '@angular/core';
import { UserService } from '../../../../../../services/user.service';
import { IUser } from '../../../../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../../modal/modal.component';
import { UserDeleteFormComponent } from '../user-form/delete-form/user-delete-form.component';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { ProfileService } from '../../../../../../services/profile.service';
import {MaskEmailPipe} from "./mask-email-pipe.pipe";


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    UserDeleteFormComponent,
    MatSnackBarModule,
    MaskEmailPipe
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  public search: String = '';
  public userList: IUser[] = [];
  private service = inject(UserService);
  private snackBar = inject(MatSnackBar);
  public profileService = inject(ProfileService);
  public currentUser: IUser = {
    email: '',
    lastname: '',
    password: '',
    name: '',
    displayname: ''
  };
  
  constructor() {
    this.service.getAllSignal();
    effect(() => {      
      this.userList = this.service.users$();
    });

    this.profileService.getUserInfoSignal();
  }

  showDetail(user: IUser, modal: any) {
    this.currentUser = {...user}; 
    modal.show();
  }

  deleteUser(user: IUser, modal: any) {
    this.currentUser = {...user}; 
    modal.show();
  }
  
}

