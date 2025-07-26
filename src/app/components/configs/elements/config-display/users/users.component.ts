import { Component } from '@angular/core';
import { UserListComponent } from './user-list/user-list.component';
import { UserDeleteFormComponent } from './user-form/delete-form/user-delete-form.component';
import { LoaderComponent } from '../../../../loader/loader.component';
import { ModalComponent } from '../../../../modal/modal.component';
import { setFaviconBeacon } from '../../../../../utility/page-icon.utility';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    UserListComponent,
    UserDeleteFormComponent,
    LoaderComponent,
    ModalComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  private windowTitle = 'Usuarios del Sistema | Configuraciones | Beacon';

  ngOnInit() { 
    window.document.title = this.windowTitle;
    setFaviconBeacon();
  }
}


