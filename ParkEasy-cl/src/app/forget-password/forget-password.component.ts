import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent {
  verifyForm: FormGroup;
  passwordForm: FormGroup;
  userVerified = false;
  errorMessage: string | null = null;
  showPassword: boolean = false;
  passwordsMismatch: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.verifyForm = this.fb.group({
      emailOrUsername: ['', Validators.required],
    });

    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  verifyUser() {
    const emailOrUsername = this.verifyForm.value.emailOrUsername;
    this.authService.verifyUser(emailOrUsername).subscribe(
      (response) => {
        this.userVerified = true;
        this.errorMessage = null;
      },
      (error) => {
        this.errorMessage = 'Usuario no encontrado. Intenta nuevamente.';
        this.showNotification();
      }
    );
  }

  changePassword() {
    if (this.passwordForm.invalid) return;

    const emailOrUsername = this.verifyForm.value.emailOrUsername;
    const newPassword = this.passwordForm.value.newPassword;

    this.authService.changePassword(emailOrUsername, newPassword).subscribe(
      (response) => {
        this.errorMessage = null;
        this.showNotification();
        this.redirectToLogin();
      },
      (error) => {
        this.errorMessage = 'Error al cambiar la contraseña. Intenta nuevamente.';
        this.showNotification();
      }
    );
  }

  validatePasswords(): void {
    const newPassword = this.passwordForm.get('newPassword')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
    this.passwordsMismatch = newPassword !== confirmPassword;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  showNotification() {
    const modalElement = document.getElementById('notificationModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  redirectToLogin() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}
