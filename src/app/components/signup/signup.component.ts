import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  errorMessage: string = '';

  //regex format for validation
  validEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;  
  validPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.validEmail)]],
      password: ['', [Validators.required, Validators.pattern(this.validPassword)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/admin']);
    }
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe({
        next: () => {
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Signup failed. Please try again.';
        }
      });
    } else {
      this.errorMessage = this.myError();
    }
  }

  myError (){
    const emailControl = this.signupForm.get('email');
    const passwordControl = this.signupForm.get('password');
  
    if (emailControl?.hasError('required')) return 'Email is required.';
    if (emailControl?.hasError('pattern')) return 'Invalid email format. Example: example@domain.com';
  
    if (passwordControl?.hasError('required')) return 'Password is required.';
    if (passwordControl?.hasError('pattern')) 
      return 'Password needs to be 8 characters long with symbol, number, Upper case';
  
    return 'Try Again Later!!'; 
  }

}