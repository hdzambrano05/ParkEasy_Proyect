import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminReservationService {
  private apiUrl = 'http://localhost:3000/reservations'; // URL de tu backend

  constructor(private http: HttpClient) {}

  getReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/full`); 
  }

  updateReservation(id: number, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updatedData);
  }

  getMonthlyEarnings(): Observable<{ message: string; totalEarnings: number }> {
    return this.http.get<{ message: string; totalEarnings: number }>(`${this.apiUrl}/earnings/monthly`);
  }

}