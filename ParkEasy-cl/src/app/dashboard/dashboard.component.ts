// dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ParkingSpaceService } from '../services/parking-space.service';
import { AdminReservationService } from '../services/admin-reservation.service';
import { MyProfileService } from '../services/my-profile.service'; // Importa el servicio de usuarios
import { ParkingSpace } from '../models/parking-space.model';
import { Reservation } from '../models/reservation.model';
import { User } from '../models/user.model'; // Asegúrate de que este modelo exista
import { Chart, registerables, TooltipItem } from 'chart.js';
import { Subscription, interval } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  totalSpaces: number = 0;
  availableSpaces: number = 0;
  occupiedSpaces: number = 0;
  totalReservations: number = 0;
  completedReservations: number = 0;
  pendingReservations: number = 0;
  allReservations: Reservation[] = [];
  recentReservations: Reservation[] = [];
  showPending: boolean = false;
  totalEarnings: number = 0;
  topUsers: User[] = []; 


  private updateInterval!: Subscription;

  constructor(
    private parkingSpaceService: ParkingSpaceService,
    private reservationService: AdminReservationService,
    private userService: MyProfileService // Inyectar el servicio de usuarios
  ) { }

  ngOnInit(): void {
    this.loadSpacesStatistics();
    this.loadReservationStatistics();
    this.loadTopUsers(); 
    this.loadMonthlyEarnings();
    this.updateInterval = interval(5000).subscribe(() => {
      this.loadSpacesStatistics();
      this.loadReservationStatistics();
      this.loadTopUsers(); 
      this.loadMonthlyEarnings();
    });
  }

  ngOnDestroy(): void {
    if (this.updateInterval) {
      this.updateInterval.unsubscribe();
    }
    this.destroyChart();
  }

  // Carga estadísticas de espacios
  loadSpacesStatistics(): void {
    this.parkingSpaceService.getSpaces().subscribe((spaces: ParkingSpace[]) => {
      this.totalSpaces = spaces.length;
      this.occupiedSpaces = spaces.filter(space => space.is_occupied).length;
      this.availableSpaces = this.totalSpaces - this.occupiedSpaces;
      this.availableSpaces = this.availableSpaces >= 0 ? this.availableSpaces : 0;
      this.createPieChart();
    });
  }

  // Carga estadísticas de reservas
  loadReservationStatistics(): void {
    this.reservationService.getReservations().subscribe((reservations: Reservation[]) => {
      this.totalReservations = reservations.length;
      this.completedReservations = reservations.filter(reservation => reservation.status === 'completed').length;
      this.pendingReservations = reservations.filter(reservation => reservation.status === 'pending').length;
      this.completedReservations = typeof this.completedReservations === 'number' ? this.completedReservations : 0;
      this.pendingReservations = typeof this.pendingReservations === 'number' ? this.pendingReservations : 0;
      this.allReservations = reservations;
      this.updateRecentReservations();
      this.createBarChart();
    });
  }

  // Carga los usuarios más activos
  loadTopUsers(): void {
    this.userService.getAllUsers().subscribe((users: User[]) => {
      // Ordenar los usuarios por ID de forma descendente y obtener los últimos 5
      this.topUsers = users.sort((a, b) => b.user_id - a.user_id).slice(0, 5); 
      console.log('Top Users:', this.topUsers); // Para verificar los datos
    });
  }

  loadMonthlyEarnings(): void {
    this.reservationService.getMonthlyEarnings().subscribe(
      (response) => {
        this.totalEarnings = response.totalEarnings;
        console.log('Total Earnings for the month:', this.totalEarnings); // Para verificar los datos
      },
      error => {
        console.error('Error al obtener las ganancias mensuales:', error);
      }
    );
  }
  // Crear gráfico circular
  createPieChart(): void {
    const ctx = document.getElementById('myPieChart') as HTMLCanvasElement;
    this.destroyChart();
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Occupied Spaces', 'Available Spaces'],
        datasets: [{
          data: [this.occupiedSpaces, this.availableSpaces],
          backgroundColor: ['#FF6384', '#36A2EB'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const label = tooltipItem.label || '';
                const value = typeof tooltipItem.raw === 'number' ? tooltipItem.raw : 0;
                const percentage = this.totalSpaces > 0 ? ((value / this.totalSpaces) * 100).toFixed(2) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  // Crear gráfico de barras
  createBarChart(): void {
    const ctx = document.getElementById('myBarChart') as HTMLCanvasElement;
    this.destroyChart();
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Completed ', 'Pending '],
        datasets: [
          {
            label: 'Completed',
            data: [this.completedReservations, 0],
            backgroundColor: '#4CAF50',
            borderWidth: 1
          },
          {
            label: 'Pending',
            data: [0, this.pendingReservations],
            backgroundColor: '#FF9800',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Reservations Statistics'
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem: TooltipItem<'bar'>) => {
                const label = tooltipItem.label || '';
                const value = typeof tooltipItem.raw === 'number' ? tooltipItem.raw : 0;
                return `${label}: ${value}`;
              }
            }
          }
        }
      }
    });
    ctx.addEventListener('click', () => {
      this.showPending = !this.showPending;
      this.updateRecentReservations();
      this.createBarChart();
    });
  }

  // Actualiza las reservas recientes
  updateRecentReservations(): void {
    if (this.showPending) {
      this.recentReservations = this.allReservations.filter(reservation => reservation.status === 'pending')
        .sort((a, b) => new Date(b.reservation_start).getTime() - new Date(a.reservation_start).getTime())
        .slice(0, 10);
    } else {
      this.recentReservations = this.allReservations.sort((a, b) => new Date(b.reservation_start).getTime() - new Date(a.reservation_start).getTime())
        .slice(0, 10);
    }
  }

  private destroyChart(): void {
    const canvas = document.getElementById('myPieChart') as HTMLCanvasElement;
    const barCanvas = document.getElementById('myBarChart') as HTMLCanvasElement;

    if (canvas && (canvas as any).chart) {
      (canvas as any).chart.destroy();
      (canvas as any).chart = undefined;
    }

    if (barCanvas && (barCanvas as any).chart) {
      (barCanvas as any).chart.destroy();
      (barCanvas as any).chart = undefined;
    }
  }
}
