import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router } from '@angular/router';


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

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  onToggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.authForm.reset();
    this.errorLoginMessage = '';

    this.authForm.get('username')?.clearValidators();
    this.authForm.get('email')?.clearValidators();
    this.authForm.get('password')?.clearValidators();

    this.authForm.get('username')?.updateValueAndValidity();
    this.authForm.get('email')?.updateValueAndValidity();
    this.authForm.get('password')?.updateValueAndValidity();

    if (this.isLoginMode) {
      this.authForm.get('email')?.setValidators([Validators.email, Validators.required]);
      this.authForm.get('password')?.setValidators([Validators.minLength(6), Validators.required]);
    } else {
      this.authForm.get('username')?.setValidators([Validators.required]);
      this.authForm.get('email')?.setValidators([Validators.email, Validators.required]);
      this.authForm.get('password')?.setValidators([Validators.minLength(6), Validators.required]);
    }

    this.authForm.get('username')?.updateValueAndValidity();
    this.authForm.get('email')?.updateValueAndValidity();
    this.authForm.get('password')?.updateValueAndValidity();

    this.authForm.markAsPristine();
    this.authForm.markAsUntouched();
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
        const redirectTo = this.route.snapshot.queryParams['redirectTo'] || '/';
        this.router.navigateByUrl(redirectTo);
      } else {
        this.errorLoginMessage = 'Email or Password is incorrect!';
      }
    } else {
      this.authService.register(username, email, password);
      this.isLoginMode = true;
    }
  }

}
