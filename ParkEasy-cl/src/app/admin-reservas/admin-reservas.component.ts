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

  constructor(private adminReservationService: AdminReservationService) { }

  selectMode = false;

  toggleSelectMode() {
    this.selectMode = !this.selectMode; // Cambia el estado de selectMode
  }
  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.adminReservationService.getReservations().subscribe(
      (reservations) => {
        console.log('Reservas recibidas:', reservations);
        this.pendingReservations = reservations.filter(reservation => reservation.status === 'pending');
        this.completedReservations = reservations.filter(reservation => reservation.status !== 'pending');

        // Ordenar las reservas por fecha (más actuales primero)
        this.sortReservations();
      },
      (error) => {
        console.error('Error al cargar reservas:', error);
        alert('No se pudieron cargar las reservas. Intenta de nuevo más tarde.');
      }
    );
  }

  sortReservations(): void {
    this.pendingReservations.sort((a, b) => new Date(b.reservation_end).getTime() - new Date(a.reservation_end).getTime());
    this.completedReservations.sort((a, b) => new Date(b.reservation_end).getTime() - new Date(a.reservation_end).getTime());
  }

  openEditModal(reservation: any): void {
    this.selectedReservation = { ...reservation }; // Clonar la reserva seleccionada
    this.showModal('editReservationModal');
  }

  openViewModal(reservation: any): void {
    this.selectedReservation = { ...reservation }; // Clonar la reserva seleccionada
    this.showModal('viewReservationModal');
  }

  showModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new window.bootstrap.Modal(modalElement as HTMLElement);
      modal.show();
    } else {
      console.error('El modal no se pudo encontrar:', modalId);
    }
  }

  updateReservation(): void {
    const updatedData = {
      reservation_end: this.selectedReservation.reservation_end,
      status: this.selectedReservation.status
    };

    this.adminReservationService.updateReservation(this.selectedReservation.reservation_id, updatedData).subscribe(
      () => {
        this.loadReservations();
        alert('Reserva actualizada con éxito!');
        this.hideModal('editReservationModal');
      },
      (error) => {
        console.error('Error al actualizar la reserva', error);
        alert('Error al actualizar la reserva. Inténtalo de nuevo.');
      }
    );
  }

  hideModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    const modal = window.bootstrap.Modal.getInstance(modalElement as HTMLElement);
    modal?.hide();
  }

  // Seleccionar/deseleccionar todas las reservas pendientes
  selectAllPending(event: any): void {
    const checked = event.target.checked;
    this.pendingReservations.forEach(reservation => reservation.selected = checked);
  }

  // Seleccionar/deseleccionar todas las reservas completadas
  selectAllCompleted(event: any): void {
    const checked = event.target.checked;
    this.completedReservations.forEach(reservation => reservation.selected = checked);
  }

  // Eliminar reservas seleccionadas
  deleteSelectedPending(): void {
    this.deleteSelected(this.pendingReservations);
  }

  deleteSelectedCompleted(): void {
    this.deleteSelected(this.completedReservations);
  }

  private deleteSelected(reservations: any[]): void {
    const selectedIds = reservations.filter(reservation => reservation.selected).map(reservation => reservation.reservation_id);

    if (selectedIds.length > 0) {
      this.adminReservationService.deleteReservations(selectedIds).subscribe(
        () => {
          this.loadReservations();
          alert('Reservas eliminadas con éxito!');
        },
        (error) => {
          console.error('Error al eliminar reservas', error);
          alert('Error al eliminar reservas. Inténtalo de nuevo.');
        }
      );
    } else {
      alert('Por favor, selecciona al menos una reserva para eliminar.');
    }
  }
}
