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
    { name: 'Parqueadero 3', lat: 1.2185, lng: -77.2830 }
  ];

  constructor(private router: Router) { }

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
    const userCoords = this.getUserCoordinates(); // Obtiene las coordenadas del usuario
    if (!userCoords) {
      console.error("No se pudieron obtener las coordenadas del usuario.");
      return; // Salir si no se pueden obtener las coordenadas
    }

    const nearestParking = this.findNearestParking(userCoords);

    this.parkings.forEach(parking => {
      // Crear un icono de marcador personalizado usando Bootstrap Icons
      const customIcon = L.divIcon({
        html: `<i class="bi bi-geo-alt-fill" style="color: red; font-size: 1.5rem;"></i>`,
        className: '' // Evitar estilos de icono predeterminados
      });

      const marker = L.marker([parking.lat, parking.lng], { icon: customIcon }).addTo(this.map!);
      marker.bindPopup(parking.name);

      if (nearestParking === parking) {
        marker.on('click', () => this.openReservationComponent(parking));
      } else {
        marker.on('click', () => this.showUnavailableModal(parking));
      }
    });
  }

  private openReservationComponent(parking: Parking): void {
    // Redirigir a la ruta del componente de reservas, pasando el nombre del parqueadero como parámetro
    this.router.navigate(['/spaces', { parkingName: parking.name }]);
  }

  private showUnavailableModal(parking: Parking): void {
    alert(`El parqueadero ${parking.name} no está disponible en este momento.`);
  }

  private getUserCoordinates(): L.LatLngExpression | null {
    // Devuelve las coordenadas del usuario; puedes implementar aquí la lógica para obtener las coordenadas actuales
    // En este ejemplo, simplemente devolveré un valor ficticio
    return [1.2136, -77.2815]; // Debes reemplazar esto por las coordenadas reales
  }

  private setUserLocation(): void {
    const defaultLocation: L.LatLngExpression = [1.2136, -77.2815]; // Coordenadas de Pasto
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords: L.LatLngExpression = [
            position.coords.latitude,
            position.coords.longitude
          ];
  
          // Cambiar a un ícono de persona usando Bootstrap Icons (bi-person-fill)
          const userIcon = L.divIcon({
            html: `<i class="bi bi-person-fill" style="color: blue; font-size: 1.5rem;"></i>`, // Ícono de persona
            className: '' // Evitar estilos predeterminados de icono
          });
  
          // Usar el nuevo ícono personalizado en el marcador
          const userMarker = L.marker(userCoords, { icon: userIcon })
            .addTo(this.map!)
            .bindPopup('Tu ubicación actual', { closeButton: false })
            .openPopup();
  
          this.map?.setView(userCoords, 15);
          const nearestParking = this.findNearestParking(userCoords);
          if (nearestParking) {
            userMarker.bindPopup(`
              <div>
                <strong>Tu ubicación actual</strong><br>
                <strong>El parqueadero más cercano es:</strong><br>
                <span>${nearestParking.name}</span><br>
                <a href="/spaces?parkingName=${nearestParking.name}" style="color: blue; text-decoration: underline;">Ver más detalles</a>
              </div>
            `).openPopup();
          }
        },
        (error) => {
          console.warn("No se pudo obtener la ubicación, utilizando ubicación por defecto.");
          this.setDefaultLocation(defaultLocation);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.warn("La geolocalización no está disponible en este navegador, utilizando ubicación por defecto.");
      this.setDefaultLocation(defaultLocation);
    }
  }
  
  private setDefaultLocation(location: L.LatLngExpression): void {
    this.map?.setView(location, 15);
    const userMarker = L.marker(location)
      .addTo(this.map!)
      .bindPopup('Ubicación predeterminada en Pasto', { closeButton: false })
      .openPopup();

    const nearestParking = this.findNearestParking(location);
    if (nearestParking) {
      userMarker.bindPopup(`
        <div>
          <strong>Ubicación predeterminada en Pasto</strong><br>
          <strong>El parqueadero más cercano es:</strong><br>
          <span>${nearestParking.name}</span><br>
          <a href="/spaces?parkingName=${nearestParking.name}" style="color: blue; text-decoration: underline;">Ver más detalles</a>
        </div>
      `).openPopup();
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
