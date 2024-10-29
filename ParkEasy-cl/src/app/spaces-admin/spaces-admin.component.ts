import { Component, OnInit } from '@angular/core';
import { ParkingSpace } from '../models/parking-space.model';
import { ParkingSpaceService } from '../services/parking-space.service';
import * as bootstrap from 'bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  editSpaceForm: FormGroup;
  newSpace: ParkingSpace = {
    space_id: 0,
    space_number: '',
    is_occupied: false,
    space_type: '',
    location: '',
  };

  constructor(private parkingSpaceService: ParkingSpaceService, private fb: FormBuilder) {
    this.editSpaceForm = this.fb.group({
      space_number: ['', Validators.required],
      space_type: ['', Validators.required],
      is_occupied: [false, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSpaces();
  }

  loadSpaces(): void {
    this.parkingSpaceService.getSpaces().subscribe(spaces => {
      this.spaces = spaces.sort((a, b) => this.extractNumber(a.space_number) - this.extractNumber(b.space_number));
      this.spacesA = this.spaces.filter(space => space.space_number.startsWith('A'));
      this.spacesB = this.spaces.filter(space => space.space_number.startsWith('B'));
    });
  }

  private extractNumber(spaceNumber: string): number {
    return parseInt(spaceNumber.slice(1), 10);
  }

  viewSpace(space: ParkingSpace): void {
    this.selectedSpace = space;
    this.openModal('spaceDetailModal');
  }

  openCreateModal(): void {
    this.newSpace = { space_id: 0, space_number: '', is_occupied: false, space_type: '', location: '' };
    this.openModal('createSpaceModal');
  }

  createSpace(): void {
    this.newSpace.location = this.newSpace.space_number;
    this.parkingSpaceService.createSpace(this.newSpace).subscribe(() => {
      this.loadSpaces();
      this.closeModal('createSpaceModal');
    });
  }

  deleteSpace(): void {
    if (this.selectedSpace) {
      this.parkingSpaceService.deleteSpace(this.selectedSpace.space_id).subscribe(() => {
        this.loadSpaces();
        this.closeModal('spaceDetailModal');
      });
    }
  }

  editSpace(): void {
    this.closeModal('spaceDetailModal');
    if (this.selectedSpace) {
      this.editSpaceForm.patchValue({
        space_number: this.selectedSpace.space_number,
        space_type: this.selectedSpace.space_type,
        is_occupied: this.selectedSpace.is_occupied
      });
      this.openModal('editSpaceModal');
    }

  }

  submitEdit(): void {
    if (this.editSpaceForm.valid && this.selectedSpace) {
      const updatedSpace = { ...this.selectedSpace, ...this.editSpaceForm.value };
      this.parkingSpaceService.updateSpace(updatedSpace.space_id, updatedSpace).subscribe(() => {
        this.loadSpaces();
        this.closeModal('editSpaceModal');
      });
    }
  }

  private openModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }
}
