import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MeroType } from '../../mero-type';
import { WorkersService } from '../../service/workers.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit{
  meroForm: FormGroup;

  education: string[]= [
    'Basic Level',
    'Secondary Level',
    'Higher Secondary Level',
    'Diploma',
    'Graduated'
  ]

  constructor(private fb : FormBuilder, 
    private workerService : WorkersService, 
    private dialogRef : DialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MeroType 
  ){
    this.meroForm = this.fb.group({
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
      gender: '',
      education: '',
      company: '',
      experience: '',
      salary: ''
    })
  }

  ngOnInit(): void {
      this.meroForm.patchValue(this.data);
  }

  meroFormSubmit(){
    if(this.meroForm.valid){
      if(this.data){
          this.workerService.editWorker(this.data.id, this.meroForm.value as MeroType).subscribe({
            next: (val: any) => {
              this.dialogRef.close();
              location.reload();
            },
            error: (err: any) => {
              console.log(err);
            }
          })
      }
      else{
          this.workerService.addWorker(this.meroForm.value as MeroType).subscribe({
            next: (val: any) => {
              this.dialogRef.close();
              location.reload();
            },
            error: (err: any) => {
              console.log(err);
            }
          })
      }
  }};
}
