import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegisterService } from '../register.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  selectedFile: File | null = null;
  departments = [
    'Admin',
  'शिक्षण विभाग (Education)',
  'शाळा विभाग (School)',
  'आरोग्य विभाग (Health)',
  // 'कृषी विभाग (Agriculture)',
  // 'महसूल विभाग (Revenue)',
  // 'पंचायत विभाग (Panchayat)',
  // 'अभियांत्रिकी विभाग (Engineering)',
  // 'पाणीपुरवठा विभाग (Water Supply)',
  // 'ग्रामीण विकास विभाग (Rural Development)',
  // 'सामाजिक कल्याण विभाग (Social Welfare)'
];

  message = '';
  

  constructor(private fb: FormBuilder, private registerService: RegisterService) {
    this.registerForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Added ^ and $ for exact 10 digits
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        department: ['', Validators.required],
        role: ['FIELD', Validators.required]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];

    // Limit to 1MB
    if (file.size > 1 * 1024 * 1024) {
      this.message = 'File size should be less than 1MB.';
      return;
    }

    this.selectedFile = file;
  }
}

  togglePasswordVisibility() {
    const passwordField = this.registerForm.get('password');
    if (passwordField) {
      passwordField.setValue(passwordField.value); // Trigger validation
    }
  }
  onSubmit() {
    if (this.registerForm.invalid) {
      this.message = 'Please fill all required fields correctly.';
      return;
    }
    if (!this.selectedFile) {
      this.message = 'Please upload a profile photo.';
      return;
    }

    const formData = new FormData();
    // Append form controls except confirmPassword
    Object.entries(this.registerForm.value).forEach(([key, value]) => {
      if (key !== 'confirmPassword') {
        formData.append(key, value as string);
      }
    });
    formData.append('photo', this.selectedFile);

    this.registerService.registerUser(formData).subscribe({
      next: (res: any) => {
        this.message = res?.message || 'Registration successful!';
        this.registerForm.reset();
        this.selectedFile = null; // reset file input as well
      },
      error: (err) => {
        console.error(err);
        this.message = err?.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
