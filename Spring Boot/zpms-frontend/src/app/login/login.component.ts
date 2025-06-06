import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RegisterService } from '../register.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  message = '';
    hidePassword: boolean = true;


  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

togglePassword(): void {
  this.hidePassword = !this.hidePassword;
}


  onSubmit(): void {
  if (this.loginForm.invalid) {
    this.message = 'Please enter valid credentials.';
    return;
  }

  this.registerService.loginUser(this.loginForm.value).subscribe({
    next: (res: any) => {
      if (res.success && res.user) {
        const department = res.user.department;
        localStorage.setItem('user', JSON.stringify(res.user));

        // ✅ Show success popup
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Welcome, ${res.user.fullName}`,
          timer: 2000,
          showConfirmButton: false
        });

        // Redirect after a short delay
        setTimeout(() => {
          switch (department) {
            case 'शिक्षण विभाग (Education)':
              this.router.navigate(['/education']);
              break;
            case 'आरोग्य विभाग (wcd)':
              this.router.navigate(['/health']);
              break;
            case 'शाळा विभाग (School)':
              this.router.navigate(['/revenue']);
              break;
            default:
              this.router.navigate(['/dashboard']);
          }
        }, 2000); // Delay matches Swal timer
      } else {
        this.message = res.message || 'Invalid credentials';
      }
    },
    error: (err) => {
      this.message = err?.error?.message || 'Login failed. Please try again.';
    }
  });
}

}