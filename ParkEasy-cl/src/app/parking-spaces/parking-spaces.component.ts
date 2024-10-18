import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ParkingSpaceService } from '../services/parking-space.service';
import { AuthService } from '../services/auth.service';
import { ParkingSpace } from '../models/parking-space.model';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-parking-spaces',
  templateUrl: './parking-spaces.component.html',
  styleUrls: ['./parking-spaces.component.css']
})
export class ParkingSpacesComponent implements OnInit {
  @ViewChild('successModal') successModal!: ElementRef;
  spaces: ParkingSpace[] = [];
  spacesA: ParkingSpace[] = [];
  spacesB: ParkingSpace[] = [];
  selectedSpace: ParkingSpace | null = null;
  vehicle = {
    user_id: null as number | null,
    license_plate: ''.toUpperCase(),
    vehicle_type: ''.toUpperCase(),
    color: ''.toUpperCase()
  };
  reservation: any = {
    space_id: null,
    user_id: null,
    reservation_start: '',
    reservation_end: '',
    status: 'pending'
  };
  userId: number | null = null;
  showOccupiedNotification: boolean = false;
  isVehicleRegistered: boolean | null = null;
  vehicleId: number | null = null;
  hasActiveReservation: boolean = false;
  selectedReservation: any = null; // Reserva actual
  fee: number = 0; // Tarifa calculada
  isSuccessModalVisible: boolean = false; // Controla la visibilidad del modal de éxito
  isErrorModalVisible: boolean = false; // Controla la visibilidad del modal de error

  constructor(
    private parkingSpaceService: ParkingSpaceService,
    private authService: AuthService,
    private toastr: ToastrService,
  ) { }

  /* ngOnInit(): void {
     this.loadSpaces();
     this.authService.getUserId().subscribe(userId => {
       this.userId = userId;
       console.log('ID de usuario:', userId); // Log del ID de usuario
 
       if (userId) {
         this.parkingSpaceService.getActiveReservation(userId).subscribe(reservation => {
           console.log('Reserva activa en ngOnInit:', reservation);
           this.reservation = reservation;
           this.hasActiveReservation = !!reservation;
           if (reservation) {
             console.log('Reservation ID:', reservation.reservation_id);
           }
         });
       }
     });
   }*/

  ngOnInit(): void {
    this.loadSpaces();
    this.authService.getUserId().subscribe(userId => {
      this.userId = userId;
      console.log('ID de usuario:', userId); // Log del ID de usuario

      if (userId) {
        this.parkingSpaceService.getActiveReservation(userId).subscribe(reservation => {
          console.log('Reserva activa en ngOnInit:', reservation);
          this.reservation = reservation;
          this.hasActiveReservation = !!reservation;
          if (reservation) {
            console.log('Reservation ID:', reservation.reservation_id);
          }
        });
      }
    });
  }

  loadSpaces(): void {
    this.parkingSpaceService.getSpaces().subscribe(spaces => {
      // Ordenar los espacios por su número
      this.spaces = spaces.sort((a, b) => {
        const numA = parseInt(a.space_number.slice(1), 10);
        const numB = parseInt(b.space_number.slice(1), 10);
        return numA - numB;
      });

      // Filtrar y ordenar los espacios en grupos A y B
      this.spacesA = this.spaces.filter(space => space.space_number.startsWith('A'));
      this.spacesB = this.spaces.filter(space => space.space_number.startsWith('B'));

      this.spacesA.sort((a, b) => parseInt(a.space_number.slice(1), 10) - parseInt(b.space_number.slice(1), 10));
      this.spacesB.sort((a, b) => parseInt(a.space_number.slice(1), 10) - parseInt(b.space_number.slice(1), 10));
    });
  }



  checkActiveReservation(): void {
    if (this.userId) {
      this.parkingSpaceService.getActiveReservation(this.userId).subscribe(activeReservation => {
        this.hasActiveReservation = !!activeReservation; // Actualiza el estado de la reserva activa
      });
    }
  }

  openValidationModal(space: ParkingSpace): void {
    if (this.userId) {
      this.parkingSpaceService.getActiveReservation(this.userId).subscribe(activeReservation => {
        console.log('Reserva activa:', activeReservation); // Agrega este log para depurar

        if (activeReservation) {
          // Si el usuario tiene una reserva activa, mostrar el mensaje
          alert('Ya tienes una reserva activa. No puedes seleccionar otro espacio.');
          return;
        }

        // Si el espacio está ocupado, mostrar notificación en un modal
        if (space.is_occupied) {
          const occupiedModalElement = document.getElementById('occupiedNotificationModal');
          if (occupiedModalElement) {
            const modal = new (window as any).bootstrap.Modal(occupiedModalElement);
            modal.show();
          } else {
            console.error('Modal de espacio ocupado no encontrado');
          }
        } else {
          // Si no hay reserva activa y el espacio no está ocupado, abrir el modal de validación
          this.selectedSpace = space;
          this.isVehicleRegistered = null;
          const validationModalElement = document.getElementById('validationModal');
          if (validationModalElement) {
            const modal = new (window as any).bootstrap.Modal(validationModalElement);
            modal.show();
          } else {
            console.error('Modal de validación no encontrado');
          }
        }
      });
    } else {
      console.error('User ID no disponible');
    }
  }



  validateVehicle(): void {
    // Asegura que la placa se verifique en mayúsculas
    this.vehicle.license_plate = this.vehicle.license_plate.toUpperCase();

    this.parkingSpaceService.checkVehicleExistence(this.vehicle.license_plate).subscribe(vehicle => {
      if (vehicle) {
        this.isVehicleRegistered = true;
        this.vehicleId = vehicle.vehicle_id;
        this.openReservationForm(); // Si el vehículo está registrado, abre el formulario de reserva
      } else {
        this.isVehicleRegistered = false;
        this.openVehicleRegistrationForm(); // Si no está registrado, abre el formulario de registro del vehículo
      }
    });
  }


  openReservationForm(): void {
    const reservationModal = document.getElementById('reservationModal');
    if (reservationModal) {
      const modal = new (window as any).bootstrap.Modal(reservationModal);
      modal.show();
    } else {
      console.error('Modal no encontrado');
    }
  }

  openVehicleRegistrationForm(): void {
    const vehicleModal = document.getElementById('vehicleModal');
    if (vehicleModal) {
      const modal = new (window as any).bootstrap.Modal(vehicleModal);
      modal.show();
    } else {
      console.error('Modal no encontrado');
    }
  }

  registerVehicleAndReserve(): void {
    if (this.selectedSpace && this.userId) {
      // Asigna el userId al objeto vehicle
      this.vehicle.user_id = this.userId;

      // Asegura que los datos del vehículo estén en mayúsculas antes de registrar
      this.vehicle.license_plate = this.vehicle.license_plate.toUpperCase();
      this.vehicle.vehicle_type = this.vehicle.vehicle_type.toUpperCase();
      this.vehicle.color = this.vehicle.color.toUpperCase();

      this.parkingSpaceService.addVehicle(this.vehicle).subscribe(newVehicle => {
        if (newVehicle) {
          this.vehicleId = newVehicle.vehicle_id;
          this.reserveSpace(); // Procede a reservar después de registrar el vehículo
        } else {
          console.error('Error al registrar el vehículo');
        }
      });
    }
  }

  reserveSpace(): void {
    if (this.selectedSpace && this.userId && this.vehicleId) {
      this.reservation = {
        space_id: this.selectedSpace.space_id,
        user_id: this.userId,
        vehicle_id: this.vehicleId,
        reservation_start: new Date().toISOString(),
        reservation_end: new Date().toISOString(),
        status: 'pending'
      };

      console.log('Datos de la reserva:', this.reservation);
      console.log('Datos de Vehiculo', this.vehicle);


      this.parkingSpaceService.addReservation(this.reservation).subscribe(result => {
        if (result) {
          alert('Reserva exitosa.');

          // Cierra los modales automáticamente
          this.closeAllModals();

          // Recarga los espacios
          this.loadSpaces();

          // Si prefieres recargar toda la página, puedes usar
          window.location.reload();
        } else {
          console.error('Error al reservar espacio');
        }
      });
    }
  };

  selectReservation(reservation: any): void {

    this.selectedReservation = reservation;
    console.log('Reserva seleccionada:', this.selectedReservation);
  }

  markExit(): void {
    console.log('Reserva activa antes de marcar salida:', this.reservation);

    if (this.reservation && this.reservation.reservation_id) {
      this.parkingSpaceService.markExit(this.reservation.reservation_id).subscribe(
        response => {
          console.log('Salida marcada exitosamente:', response);

          // Guarda la tarifa
          this.fee = response.fee; // Asegúrate de que 'fee' es la propiedad que envía el backend

          // Actualiza el estado
          this.reservation = null; // Limpia la reserva después de marcar salida
          this.hasActiveReservation = false; // Actualiza el estado
          this.isSuccessModalVisible = true; // Muestra el modal de éxito
        },
        error => {
          console.error('Error al marcar la salida:', error);
          // Manejo del error si es necesario
        }
      );
    } else {
      console.log('No hay ninguna reserva seleccionada para marcar salida.'); // Mensaje de error
    }
  }


  closeAllModals(): void {
    const modals = ['validationModal', 'vehicleModal', 'reservationModal'];
    modals.forEach(modalId => {
      const modalElement = document.getElementById(modalId);
      if (modalElement) {
        const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    });
  }



  closeSuccessModal() {
    this.isSuccessModalVisible = false;

    // Usar un retraso para permitir que el modal se cierre antes de recargar
    setTimeout(() => {
      window.location.reload();
    }, 300); // Ajusta el tiempo según sea necesario, 1000 ms generalmente debería ser suficiente
  }

  closeErrorModal() {
    this.isErrorModalVisible = false;
  }



}
