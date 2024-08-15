import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, CommonModule, MatInputModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  isLoginMode = true;
  errorLoginMessage = '';
  authForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', [Validators.minLength(6), Validators.required])
  })

  constructor(private authService: AuthService, private router: Router) {}

  onToggleMode() {
    this.authForm.reset();
    this.isLoginMode = !this.isLoginMode;
    if (this.isLoginMode) {
      this.authForm.get('username')?.clearValidators();
    } else {
      this.authForm.get('username')?.setValidators([Validators.required]);
    }
    this.authForm.get('username')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }
    const username = this.authForm.value.username!;
    const email = this.authForm.value.email!;
    const password = this.authForm.value.password!;
    if (this.isLoginMode) {
      const isSuccess = this.authService.login(email, password);
      if (isSuccess) {
        this.errorLoginMessage = '';
        this.router.navigateByUrl('/dashboard');
      } else {
        this.errorLoginMessage = 'Email or Password is incorrect!';
      }
    } else {
      this.authService.register(username, email, password);
    }
  }
}
