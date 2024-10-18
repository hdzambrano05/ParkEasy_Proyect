export interface Reservation {
    reservation_id: number;
    user_id: number;
    space_id: number;
    vehicle_id: number;
    reservation_start: Date;
    reservation_end: Date;
    status: string; // por ejemplo: 'pending', 'completed'
    fee?: number; // Tarifa opcional
  }
  