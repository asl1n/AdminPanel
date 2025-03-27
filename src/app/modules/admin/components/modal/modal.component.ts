import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MeroType } from '../../mero-type';
import { WorkersService } from '../../service/workers.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  meroForm: FormGroup;
  validEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  education: string[] = [
    'Basic Level',
    'Secondary Level',
    'Higher Secondary Level',
    'Diploma',
    'Graduated'
  ];

  constructor(
    private fb: FormBuilder,
    private workerService: WorkersService,
    private dialogRef: DialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MeroType
  ) {

    this.meroForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(this.validEmail)]],
      dob: ['', [Validators.required, this.validDate]],
      gender: ['', Validators.required],
      education: ['', Validators.required],
      company: ['', Validators.required],
      experience: ['', Validators.required],
      salary: ['', Validators.required]
    });
    
  }

  ngOnInit(): void {
    if (this.data && this.data.id) {
      this.meroForm.patchValue(this.data);
    }
  }

  validDate(control: AbstractControl): ValidationErrors | null {
    const inputDate = new Date(control.value);
    const today = new Date();
    const required = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());

    return inputDate < required ? null : { pastDate: true };
  }

  meroFormSubmit() {
    if (this.meroForm.valid) {
      if (this.data && this.data.id) {
        this.workerService.editWorker(this.data.id, this.meroForm.value as MeroType).subscribe({
          next: () => {
            this.dialogRef.close(); 
            location.reload();
          },
          error: (err) => {
            console.error('Error editing worker:', err);
          }
        });
      } else {
        this.workerService.addWorker(this.meroForm.value as MeroType).subscribe({
          next: () => {
            this.dialogRef.close(); 
            location.reload();
          },
          error: (err) => {
            console.error('Error adding worker:', err);
          }
        });
      }
    }
  }
}