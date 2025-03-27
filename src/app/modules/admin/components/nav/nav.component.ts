import {Component} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: 'nav.component.html',
  styleUrls: ['nav.component.scss'],
})
export class NavComponent {
  constructor(
    private dialog: MatDialog,
    private authService: AuthService
  ){}
  openModal(){
    this.dialog.open(ModalComponent);
  }

  logOut(){
    this.authService.logout();
  }
}
