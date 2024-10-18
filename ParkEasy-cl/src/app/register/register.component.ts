import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  full_name: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;
  passwordsMismatch: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  // Validación en tiempo real de la confirmación de la contraseña
  validatePasswords(): void {
    this.passwordsMismatch = this.password !== this.confirmPassword;
  }

  onSubmit(): void {
    // Limpiar mensajes previos
    this.clearMessages();

    // Validaciones
    if (!this.username || !this.email || !this.password || !this.full_name) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'El formato del correo no es válido.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (this.passwordsMismatch) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    // Crear objeto de datos del usuario
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
      full_name: this.full_name,  // Asegurar que el nombre del campo coincide con el backend
      role_id: 2  // Ajusta el rol si es necesario
    };

    console.log('Datos enviados:', userData);

    this.authService.register(this.username, this.email, this.password, this.full_name).subscribe(
      response => {
        this.successMessage = `Registro exitoso. Te hemos enviado un correo a ${this.email}.`;
        this.clearForm();
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error => {
        console.error('Error en el registro:', error);
        this.errorMessage = error.error?.error || 'Hubo un error al registrar el usuario. Inténtalo de nuevo.';
      }
    );
  }

  // Validar el formato del correo
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  // Limpiar mensajes de error y éxito
  clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }

  // Limpiar el formulario
  clearForm(): void {
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.full_name = '';
    this.passwordsMismatch = false;
  }
}
