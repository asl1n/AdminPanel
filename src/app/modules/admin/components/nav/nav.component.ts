import {Component} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-nav',
  templateUrl: 'nav.component.html',
  styleUrls: ['nav.component.scss'],
})
export class NavComponent {
  constructor(private dialog: MatDialog){}
  openModal(){
    this.dialog.open(ModalComponent);
  }
}
