export interface ParkingSpace {
    space_id: number;
    space_number: string;
    is_occupied: boolean;
    space_type?: string;  // Opcional
    location?: string;    // Opcional
  }
