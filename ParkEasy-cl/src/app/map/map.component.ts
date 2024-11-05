import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router
import * as L from 'leaflet';

interface Parking {
  name: string;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map: L.Map | undefined;
  private parkings: Parking[] = [
    { name: 'Parqueadero 1', lat: 1.2146, lng: -77.2805 },
    { name: 'Parqueadero 2', lat: 1.2160, lng: -77.2825 },
    { name: 'Parqueadero 3', lat: 1.2130, lng: -77.2850 }
  ];

  constructor(private router: Router) { } // Corregido la sintaxis aquí

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([1.2136, -77.2815], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.loadParkingMarkers();
    this.setUserLocation();
    this.map.zoomControl.setPosition('topright');
  }

  private loadParkingMarkers(): void {
    this.parkings.forEach(parking => {
      const marker = L.marker([parking.lat, parking.lng])
        .addTo(this.map!)
        .bindPopup(parking.name)
        .on('click', () => this.openReservationComponent(parking)); // Evento click
    });
  }

  private openReservationComponent(parking: Parking): void {
    // Redirigir a la ruta del componente de reservas, pasando el nombre del parqueadero como parámetro
    this.router.navigate(['/spaces', { parkingName: parking.name }]);
  }

  private setUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords: L.LatLngExpression = [
            position.coords.latitude,
            position.coords.longitude
          ];

          const userMarker = L.marker(userCoords)
            .addTo(this.map!)
            .bindPopup('Tu ubicación actual', { closeButton: false })
            .openPopup();

          this.map?.setView(userCoords, 15);
          const nearestParking = this.findNearestParking(userCoords);
          if (nearestParking) {
            userMarker.bindPopup(`Tu ubicación actual<br>El parqueadero más cercano es ${nearestParking.name}`).openPopup();
          }
        },
        (error) => {
          console.error("Error al obtener la ubicación: ", error.message);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error("La geolocalización no está disponible en este navegador.");
    }
  }

  private findNearestParking(userCoords: L.LatLngExpression): Parking | null {
    let nearestParking: Parking | null = null;
    let minDistance = Infinity;

    this.parkings.forEach(parking => {
      const parkingCoords: L.LatLngExpression = [parking.lat, parking.lng];
      const distance = this.calculateDistance(userCoords, parkingCoords);

      if (distance < minDistance) {
        minDistance = distance;
        nearestParking = parking;
      }
    });

    return nearestParking;
  }

  private calculateDistance(coord1: L.LatLngExpression, coord2: L.LatLngExpression): number {
    const [lat1, lon1] = Array.isArray(coord1) ? coord1 : [0, 0];
    const [lat2, lon2] = Array.isArray(coord2) ? coord2 : [0, 0];

    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI / 180; // Conversión a radianes
    const φ2 = lat2 * Math.PI / 180; // Conversión a radianes
    const Δφ = (lat2 - lat1) * Math.PI / 180; // Diferencia de latitud en radianes
    const Δλ = (lon2 - lon1) * Math.PI / 180; // Diferencia de longitud en radianes

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
  }
}
