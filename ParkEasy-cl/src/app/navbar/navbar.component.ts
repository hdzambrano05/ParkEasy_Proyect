import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  username: string | null = null;
  isAdmin: boolean = false;
  private authSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router, private eRef: ElementRef) {}

  ngOnInit(): void {
    this.subscribeToAuthChanges();

    // Escucha los cambios en la autenticación
    window.addEventListener('authChange', this.subscribeToAuthChanges.bind(this));
  }

  subscribeToAuthChanges(): void {
    this.authSubscription = this.authService.isAuthenticated().subscribe((authStatus: boolean) => {
      this.isAuthenticated = authStatus;
      this.username = this.authService.getUsername();
      this.isAdmin = this.authService.getRole() === 1; // Suponemos que 1 es el rol de administrador
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    window.removeEventListener('authChange', this.subscribeToAuthChanges.bind(this));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const navbarCollapse = document.getElementById('navbarNav');
    const isClickInside = this.eRef.nativeElement.contains(event.target);

    if (!isClickInside && navbarCollapse?.classList.contains('show')) {
      navbarCollapse.classList.remove('show');  // Cierra el menú
    }
  }
}
