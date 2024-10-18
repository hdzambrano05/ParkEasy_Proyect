import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  identifier: string = ''; // Puede ser email o nombre de usuario
  password: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    // Validación de campos
    if (!this.identifier || !this.password) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }
  
    this.errorMessage = ''; // Limpiar mensaje de error antes de iniciar sesión
  
    // Llamada al servicio de autenticación
    this.authService.login(this.identifier, this.password).subscribe(
      response => {
        const role = this.authService.getRole(); // Obtener el rol del usuario
  
        // Redirección según el rol
        if (role === 1) { // Suponiendo 1 es el rol de administrador
          this.router.navigate(['/dashboard']); // Redirige al dashboard de administrador
        } else {
          this.router.navigate(['/spaces']); // Redirige al dashboard de usuario
        }
  
        // Opción para refrescar el estado de la barra de navegación
        window.dispatchEvent(new Event('authChange'));
      },
      error => {
        console.error('Error en el inicio de sesión:', error);
        this.errorMessage = 'Correo electrónico o contraseña incorrectos.'; // Mensaje de error
      }
    );
  }
}  
