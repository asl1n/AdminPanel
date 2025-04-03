import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { WorkersService } from '../../service/workers.service';
import { MeroType } from '../../mero-type';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { FormControl } from '@angular/forms';
import { merge, startWith, debounceTime, distinctUntilChanged } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements AfterViewInit {
  // Table columns to display
  displayedColumns: string[] = [
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
  
  dataSource: MeroType[] = []; // Holds the worker data
  totalItems = 0;              // Total number of items for pagination
  isLoading = false;           // Loading state
  filterControl = new FormControl(''); // Search input control

  // Get reference to paginator and sort from template
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private workerService: WorkersService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) {}

  ngAfterViewInit() {
    // Check authentication first
    if (!this.authService.getAdminId()) {
      this.router.navigate(['/login']);
      return;
    }

    // Set initial pagination values
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 5;

    // Reset to first page when sorting changes
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
    });

    // Combine all data-changing events
    merge(
      this.sort.sortChange,        // Sorting changes
      this.paginator.page,         // Pagination changes
      this.filterControl.valueChanges.pipe( // Filter changes
        debounceTime(1000),         // Wait 1 sec after typing
        distinctUntilChanged()     // Only emit when value changes
    ).pipe(
      startWith({})                // Initial load trigger
    ).subscribe(() => {
      this.loadData();
    });
  }

  // Main data loading function
  loadData() {
    try {
      this.isLoading = true;
      
      this.workerService.getWorkersPaginated(
        this.paginator.pageIndex + 1, // JSON Server uses 1-based index
        this.paginator.pageSize,
        this.sort.active || 'id',     // Default sort by ID
        this.sort.direction || 'asc', // Default ascending
        this.filterControl.value || ''// Search term
      ).subscribe({
        next: (response) => {
          this.dataSource = response.data;
          this.totalItems = response.total;
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.handleAuthError();
        }
      });
    } catch (error) {
      this.handleAuthError();
    }
  }

  // Handle authentication errors
  private handleAuthError() {
    this.isLoading = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Delete worker
  deleteWorker(id: number) {
    this.workerService.deleteWorker(id).subscribe({
      next: () => this.loadData(), // Refresh data after delete
      error: console.error
    });
  }

  // Open edit modal
  openEditModal(data: MeroType) {
    const dialogRef = this.dialog.open(ModalComponent, { data });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.workerService.editWorker(data.id, result).subscribe({
          next: () => this.loadData(), // Refresh data after edit
          error: console.error
        });
      }
    });
  }
}