import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { ParkingSpace } from '../models/parking-space.model';
import { switchMap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ParkingSpaceService {
  private apiUrlSpaces = `${environment.apiUrl}/spaces`;
  private apiUrlVehicles = `${environment.apiUrl}/vehicles`;
  private apiUrlReservations = `${environment.apiUrl}/reservations`;

  constructor(private http: HttpClient) { }

  // Obtener espacios de estacionamiento
  getSpaces(): Observable<ParkingSpace[]> {
    return this.http.get<ParkingSpace[]>(`${this.apiUrlSpaces}/full`).pipe(
      catchError(error => {
        console.error('Error al obtener los espacios:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }

  getActiveReservation(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlReservations}/active/${userId}`).pipe(
      catchError(error => {
        console.error('Error al obtener la reserva activa:', error);
        return of(null); // Retorna null en caso de error
      })
    );
  }

  // Verificar si el vehículo existe por la placa
  checkVehicleExistence(licensePlate: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlVehicles}/check?license_plate=${licensePlate}`, { observe: 'response' }).pipe(
      map(response => {
        if (response.status === 200) {
          return response.body; // Si el vehículo existe, devuelve los datos del vehículo
        }
        return null; // Si no existe (o en caso de error 404)
      }),
      catchError(error => {
        if (error.status === 404) {
          return of(null); // Si la API devuelve 404, devolvemos null para indicar que no se encontró
        }
        console.error('Error al verificar el vehículo:', error);
        return of(null); // Manejo general de errores
      })
    );
  }


  markExit(reservationId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrlReservations}/exit/${reservationId}`, {});
  }
  // Agregar un nuevo vehículo
  addVehicle(vehicleData: any): Observable<any> {
    return this.http.post<any>(this.apiUrlVehicles, vehicleData).pipe(
      catchError(error => {
        console.error('Error al agregar el vehículo:', error);
        return of(null); // Retorna null en caso de error
      })
    );
  }

  // Agregar una nueva reserva
  addReservation(reservationData: any): Observable<any> {
    return this.http.post<any>(this.apiUrlReservations, reservationData).pipe(
      catchError(error => {
        console.error('Error al agregar la reserva:', error);
        return of(null); // Retorna null en caso de error
      })
    );
  }

  getSpaceById(id: number): Observable<ParkingSpace> {
    return this.http.get<ParkingSpace>(`${this.apiUrlSpaces}/${id}`);
  }


  // Crear un nuevo espacio
  createSpace(space: ParkingSpace): Observable<ParkingSpace> {
    return this.http.post<ParkingSpace>(this.apiUrlSpaces, space);
  }

  // Actualizar un espacio existente
  updateSpace(id: number, space: ParkingSpace): Observable<ParkingSpace> {
    return this.http.put<ParkingSpace>(`${this.apiUrlSpaces}/${id}`, space);
  }

  // Eliminar un espacio de estacionamiento
  deleteSpace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlSpaces}/${id}`);
  }

}
