import { TestBed } from '@angular/core/testing';

import { AdminReservationService } from './admin-reservation.service';

describe('AdminReservationService', () => {
  let service: AdminReservationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminReservationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
