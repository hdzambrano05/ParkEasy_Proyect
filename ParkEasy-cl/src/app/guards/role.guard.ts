import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const expectedRole = route.data['role']; // El rol esperado se pasa como parámetro

    return this.authService.getUserId().pipe(
      take(1),
      map(() => {
        const currentRole = this.authService.getRole();
        if (currentRole && currentRole === expectedRole) {
          return true;
        } else {
          this.router.navigate(['/']); // Redirigir a la página principal si no tiene el rol
          return false;
        }
      })
    );
  }
}
