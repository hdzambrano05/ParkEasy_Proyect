import { Component, OnInit } from '@angular/core';
import { AdminReservationService } from '../services/admin-reservation.service';

@Component({
  selector: 'app-admin-reservas',
  templateUrl: './admin-reservas.component.html',
  styleUrls: ['./admin-reservas.component.css']
})
export class AdminReservasComponent implements OnInit {
  pendingReservations: any[] = [];
  completedReservations: any[] = [];
  selectedReservation: any = {}; // Inicializar como un objeto vacío

  constructor(private AdminReservationService: AdminReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.AdminReservationService.getReservations().subscribe((reservations) => {
      console.log('Reservas recibidas:', reservations); // Añadir este log
  
      // Filtrar las reservas por estado
      this.pendingReservations = reservations.filter(reservation => reservation.status === 'pending');
      this.completedReservations = reservations.filter(reservation => reservation.status !== 'pending');
  
      // Ordenar las reservas más actuales primero (suponiendo que 'reservation_end' es una fecha)
      this.pendingReservations.sort((a, b) => new Date(b.reservation_end).getTime() - new Date(a.reservation_end).getTime());
      this.completedReservations.sort((a, b) => new Date(b.reservation_end).getTime() - new Date(a.reservation_end).getTime());
    });
  }

  openEditModal(reservation: any): void {
    this.selectedReservation = { ...reservation }; // Clonar la reserva seleccionada
    console.log('Reserva seleccionada:', this.selectedReservation);

    const modalElement = document.getElementById('editReservationModal');

    if (modalElement) {
      const modal = new window.bootstrap.Modal(modalElement as HTMLElement);
      modal.show();
    } else {
      console.error('El modal no se pudo encontrar.');
    }
  }

  openViewModal(reservation: any): void {
    this.selectedReservation = { ...reservation }; // Clonar la reserva seleccionada
    console.log('Reserva seleccionada para ver:', this.selectedReservation);

    const modalElement = document.getElementById('viewReservationModal');

    if (modalElement) {
      const modal = new window.bootstrap.Modal(modalElement as HTMLElement);
      modal.show();
    } else {
      console.error('El modal no se pudo encontrar.');
    }
  }

  updateReservation(): void {
    console.log('Actualizando reserva con ID:', this.selectedReservation.reservation_id);

    const updatedData = {
      reservation_end: this.selectedReservation.reservation_end,
      status: this.selectedReservation.status
    };

    this.AdminReservationService.updateReservation(this.selectedReservation.reservation_id, updatedData).subscribe(
      (response) => {
        this.loadReservations();
        alert('Reserva actualizada con éxito!');
        const modalElement = document.getElementById('editReservationModal');
        const modal = window.bootstrap.Modal.getInstance(modalElement as HTMLElement);
        modal?.hide();
      },
      (error) => {
        console.error('Error al actualizar la reserva', error);
        alert('Error al actualizar la reserva. Inténtalo de nuevo.');
      }
    );
  }
}
