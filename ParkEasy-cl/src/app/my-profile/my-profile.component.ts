import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MyProfileService } from '../services/my-profile.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  user: any;
  vehicles: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  isEditing: boolean = false;
  isEditingVehicle: boolean = false;
  editingVehicle: any = null;
  selectedVehicleId: number | null = null;
  userId: number | null = null;
  selectedVehicleToDelete: number | null = null;

  constructor(private authService: AuthService, private myprofileService: MyProfileService) { }

  ngOnInit(): void {
    this.authService.getUserId().subscribe(userId => {
      if (userId) {
        this.userId = userId;
        this.myprofileService.getUserInfo(userId).subscribe(
          (data) => {
            console.log('User data:', data);
            this.user = data;
            this.vehicles = data.vehicles_models || [];
            this.loading = false;
          },
          (error) => {
            console.error('Error fetching user info:', error);
            this.error = 'Error fetching user information';
            this.loading = false;
          }
        );
      } else {
        console.error('No user ID found');
        this.loading = false;
      }
    });
  }

  enableEdit() {
    this.isEditing = true;
  }

  updateUser() {
    this.myprofileService.updateUser(this.user).subscribe(
      (response) => {
        console.log('User updated successfully:', response);
        this.isEditing = false;
      },
      (error) => {
        console.error('Error updating user:', error);
        this.error = 'Error updating user information';
      }
    );
  }

  cancelEdit() {
    this.isEditing = false;
  }

  enableEditVehicle(vehicle: any) {
    this.isEditingVehicle = true;
    this.editingVehicle = { ...vehicle };
    this.selectedVehicleId = vehicle.vehicle_id;
    console.log('ID del vehículo seleccionado para editar:', this.selectedVehicleId);
  }

  editVehicle(): void {
    if (this.userId && this.selectedVehicleId) {
      const updatedVehicle = {
        license_plate: this.editingVehicle.license_plate,
        vehicle_type: this.editingVehicle.vehicle_type,
        color: this.editingVehicle.color
      };

      this.myprofileService.updateVehicle(this.selectedVehicleId, updatedVehicle).subscribe(
        (response) => {
          console.log('Vehicle updated successfully:', response);
          const index = this.vehicles.findIndex(v => v.vehicle_id === this.selectedVehicleId);
          if (index !== -1) {
            this.vehicles[index] = { ...this.editingVehicle, vehicle_id: this.selectedVehicleId };
          }
          this.isEditingVehicle = false;
          this.editingVehicle = null;
        },
        (error) => {
          console.error('Error updating vehicle:', error);
        }
      );
    }
  }

  cancelEditVehicle() {
    this.isEditingVehicle = false;
    this.editingVehicle = null;
    this.selectedVehicleId = null;
  }

  deleteVehicle(vehicleId: number) {
    this.selectedVehicleToDelete = vehicleId;
    const modalElement = document.getElementById('deleteVehicleModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('El modal no se encontró');
    }
  }
  confirmDeleteVehicle() {
    if (this.selectedVehicleToDelete) {
      this.myprofileService.deleteVehicle(this.selectedVehicleToDelete).subscribe(
        (response) => {
          console.log('Vehículo eliminado:', response);
          this.vehicles = this.vehicles.filter(v => v.vehicle_id !== this.selectedVehicleToDelete);
          this.selectedVehicleToDelete = null;
  
          const modalElement = document.getElementById('deleteVehicleModal');
          if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal?.hide(); // Usa el operador de encadenamiento opcional
          }
        },
        (error) => {
          console.error('Error eliminando vehículo:', error);
          this.error = 'Error eliminando vehículo';
          this.selectedVehicleToDelete = null;
        }
      );
    }
  }
  
}
