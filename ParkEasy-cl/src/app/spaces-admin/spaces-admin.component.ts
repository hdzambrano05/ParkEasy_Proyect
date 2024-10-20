import { Component, OnInit } from '@angular/core';
import { ParkingSpace } from '../models/parking-space.model';
import { ParkingSpaceService } from '../services/parking-space.service';

import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-spaces-admin',
  templateUrl: './spaces-admin.component.html',
  styleUrls: ['./spaces-admin.component.css']
})
export class SpacesAdminComponent implements OnInit {

  spaces: ParkingSpace[] = [];
  spacesA: ParkingSpace[] = [];
  spacesB: ParkingSpace[] = [];
  selectedSpace: ParkingSpace | null = null;

  constructor(private parkingSpaceService: ParkingSpaceService) { }

  ngOnInit(): void {
    this.loadSpaces();
  }

  // Cargar espacios desde el servicio
  loadSpaces(): void {
    this.parkingSpaceService.getSpaces().subscribe(spaces => {
      this.spaces = spaces.sort((a, b) => {
        const numA = parseInt(a.space_number.slice(1), 10);
        const numB = parseInt(b.space_number.slice(1), 10);
        return numA - numB;
      });

      // Dividir espacios en grupos A y B
      this.spacesA = this.spaces.filter(space => space.space_number.startsWith('A'));
      this.spacesB = this.spaces.filter(space => space.space_number.startsWith('B'));
    });
  }

  // Seleccionar un espacio y abrir el modal
  selectSpace(space: ParkingSpace): void {
    this.selectedSpace = space;
    const modalElement = document.getElementById('spaceOptionsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }


  // Ver espacio y abrir el modal
  viewSpace(space: ParkingSpace): void {
    this.selectedSpace = space;
    const modalElement = document.getElementById('spaceDetailModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.selectedSpace = null; // Opcional: Limpia el espacio seleccionado
    const modalElement = document.getElementById('spaceDetailModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.show();
    }
  }
  addSpace(): void {
    console.log('Editar espacio:', this.selectedSpace);
  }

  // Editar espacio (acción placeholder)
  editSpace(): void {
    console.log('Editar espacio:', this.selectedSpace);
  }

  // Eliminar espacio
  deleteSpace(): void {
    if (this.selectedSpace) {
      this.parkingSpaceService.deleteSpace(this.selectedSpace.space_id).subscribe(() => {
        console.log('Espacio eliminado:', this.selectedSpace?.space_number);
        this.loadSpaces(); // Recargar espacios después de eliminar
      });
    }
  }
}
