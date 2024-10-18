import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MyProfileService {
  // URL para manejar usuarios
  private usersApiUrl = `${environment.apiUrl}/users`;

  // URL para manejar vehículos
  private vehiclesApiUrl = `${environment.apiUrl}/vehicles`;

  constructor(private http: HttpClient) {}


  getAllUsers(): Observable<any>{
    return this.http.get<any>(`${this.usersApiUrl}`);
  }

  // Obtener la información del usuario
  getUserInfo(userId: number): Observable<any> {
    return this.http.get<any>(`${this.usersApiUrl}/info/${userId}`);
  }

  // Actualizar la información del usuario
  updateUser(user: any): Observable<any> {
    const userId = user.user_id; // Asegúrate de que user tiene un campo user_id
    return this.http.put(`${this.usersApiUrl}/${userId}`, user);
  }

  // Actualizar un vehículo específico
  updateVehicle(vehicleId: number, updatedVehicle: any): Observable<any> {
    return this.http.put(`${this.vehiclesApiUrl}/${vehicleId}`, updatedVehicle);
  }

  // Eliminar un vehículo específico
  deleteVehicle(vehicleId: number): Observable<any> {
    return this.http.delete(`${this.vehiclesApiUrl}/${vehicleId}`);
  }
}
