import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private usernameSubject = new BehaviorSubject<string | null>(null);
  private roleSubject = new BehaviorSubject<number | null>(null);
  private userIdSubject = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient) {
    this.loadInitialAuthState();
  }

  private loadInitialAuthState(): void {
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const storedUsername = localStorage.getItem('username');
    const storedRole = parseInt(localStorage.getItem('role') || '0', 10);
    const storedUserId = parseInt(localStorage.getItem('userId') || '0', 10);

    this.isAuthenticatedSubject.next(storedIsAuthenticated);
    this.usernameSubject.next(storedUsername);
    this.roleSubject.next(storedRole || null);
    this.userIdSubject.next(storedUserId || null);
  }


  login(identifier: string, password: string): Observable<any> {
    const ruta = `${this.apiUrl}/users/login`;
    return this.http.post(ruta, { email: identifier, username: identifier, password }).pipe(
      tap((response: any) => {
        this.setAuthenticated(true, response.username, response.role_id, response.user_id);
      })
    );
  }

  register(username: string, email: string, password: string, full_name: string): Observable<any> {
    const ruta = `${this.apiUrl}/users/`;
    return this.http.post(ruta, { username, email, password, full_name }); // Cambiado a fullName
  }

  // Método para verificar si el usuario existe
  verifyUser(emailOrUsername: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/verify-user`, { emailOrUsername });
  }

  // Método para cambiar la contraseña
  changePassword(emailOrUsername: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/change-password`, { emailOrUsername, newPassword });
  }


  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getUsername(): string | null {
    return this.usernameSubject.getValue();
  }

  getRole(): number | null {
    return this.roleSubject.getValue();
  }

  getUserId(): Observable<number | null> {
    return this.userIdSubject.asObservable();
  }

  setAuthenticated(isAuthenticated: boolean, username: string | null, role: number | null, userId: number | null): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
    this.usernameSubject.next(username);
    this.roleSubject.next(role);
    this.userIdSubject.next(userId);
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
    localStorage.setItem('username', username || '');
    localStorage.setItem('role', role?.toString() || '0');
    localStorage.setItem('userId', userId?.toString() || '0');
  }

  logout(): void {
    this.setAuthenticated(false, null, null, null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  }
}
