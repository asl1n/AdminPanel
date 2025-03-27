import {Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { WorkersService } from '../../service/workers.service';
import { MeroType } from '../../mero-type';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  displayedColumns: string[] = 
  [
    'id',
    'firstName', 
    'lastName', 
    'email',
    'dob',
    'gender',
    'education',
    'company',
    'experience',
    'salary',
    'actions'
  ];
  dataSource!: MatTableDataSource<MeroType>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
  private workerService: WorkersService,
  private dialog: MatDialog
  ){}

  getWorkers(){
    this.workerService.getWorkers().subscribe({
      next: (val: MeroType[]) => {
        this.dataSource = new MatTableDataSource(val);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log
    })
  }

  ngOnInit(): void {
    this.getWorkers();
  }

  editWorker(id: number, updatedData: Partial<MeroType>){
    this.workerService.editWorker(id, updatedData).subscribe({
      next: (res) =>{
        console.log('edited',res);
      }
    });
  }

  deleteWorker(id: number){
    this.workerService.deleteWorker(id).subscribe({
      next: (res) =>{
        this.getWorkers();
      },
      error: console.log
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openEditModal(data: MeroType){
    this.dialog.open(ModalComponent, {
      data, 
    });
  }
}
