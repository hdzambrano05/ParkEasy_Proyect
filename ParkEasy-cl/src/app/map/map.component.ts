import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router
import * as L from 'leaflet';
import * as bootstrap from 'bootstrap';

import 'leaflet-routing-machine';


interface Parking {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  capacity: number;
  description: string;
  rating: number;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map: L.Map | undefined;
  private parkings: Parking[] = [
    {

      id: 1,
      name: 'Parqueadero 1',
      lat: 1.2146,
      lng: -77.2805,
      address: 'Calle 1 #23-45',
      capacity: 50,
      description: 'Parqueadero Cerrado, Espacio cerrado con piso de cemento de alta resistencia. Su capacidad es adecuada para vehículos de diferentes tamaños, y su diseño garantiza seguridad y protección contra las inclemencias del tiempo. Ideal para quienes buscan un parqueadero seguro y duradero.',
      rating: 5
    },
    {
      id: 2,
      name: 'Parqueadero 2',
      lat: 1.2160,
      lng: -77.2825,
      address: 'Carrera 4 #56-78',
      capacity: 30,
      description: 'Parqueadero Abierto, Estacionamiento al aire libre con piso de cemento, robusto y fácil de mantener. Es ideal para vehículos pequeños, y su estructura permite un acceso rápido y eficiente. Perfecto para quienes necesitan un parqueadero sencillo pero funcional.',
      rating: 4
    },
    {
      id: 3,
      name: 'Parqueadero 3',
      lat: 1.2185,
      lng: -77.2830,
      address: 'Diagonal 7 #12-34',
      capacity: 20,
      description: 'Parqueadero al aire libre, Estacionamiento al aire libre con piso de piedras compactadas. Aunque más pequeño y rústico, ofrece un lugar económico para estacionar vehículos de tamaño pequeño o mediano. Su superficie es resistente y fácil de limpiar, ideal para quienes prefieren una opción más natural.',
      rating: 3
    }
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
    const userCoords = this.getUserCoordinates();
    if (!userCoords) {
      console.error("No se pudieron obtener las coordenadas del usuario.");
      return;
    }

    const nearestParking = this.findNearestParking(userCoords);

    this.parkings.forEach(parking => {
      const customIcon = L.divIcon({
        html: `<i class="bi bi-geo-alt-fill" style="color: red; font-size: 1.5rem;"></i>`,
        className: ''
      });

      const marker = L.marker([parking.lat, parking.lng], { icon: customIcon }).addTo(this.map!);

      // Función para generar las estrellas en base a la puntuación
      const generateStars = (rating: number): string => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
          stars += `<i class="bi bi-star${i <= rating ? '-fill' : ''}" style="color: #ffd700;"></i>`;
        }
        return stars;
      };

      const popupContent = `
      <div class="card mb-4 shadow-sm">
        <div class="card-body">
          <h5 class="card-title d-flex align-items-center">
            <i class="bi bi-building me-2" style="font-size: 1.5rem; color: #007bff;"></i>
            ${parking.name}
          </h5>
          <p class="card-text text-muted">
            <i class="bi bi-geo-alt me-2"></i>${parking.address}
          </p>
          <p class="card-text">
            <i class="bi bi-person-fill me-2"></i>Capacidad: <strong>${parking.capacity}</strong>
          </p>
          <p class="card-text">
            <i class="bi bi-star me-2"></i>Rating: ${generateStars(parking.rating || 0)} <!-- Puntuación -->
          </p>
          <div class="d-flex justify-content-between align-items-center">
            <a href="#" class="btn btn-primary btn-sm" id="parking-${parking.id}-details">
              <i class="bi bi-info-circle me-2"></i>Ver más
            </a>
          </div>
        </div>
      </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const detailsButton = document.getElementById(`parking-${parking.id}-details`);
        if (detailsButton) {
          detailsButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.showParkingDetailsModal(parking, nearestParking);
          });
        }
      });
    });
  }

  /**
   * Muestra un modal con información completa del parqueadero.
   * @param parking Detalles del parqueadero seleccionado.
   * @param nearestParking El parqueadero más cercano.
   */
  public showParkingDetailsModal(parking: any, nearestParking: any): void {
    const isNearest = parking === nearestParking;

    // Función para generar las estrellas en base a la puntuación
    const generateStars = (rating: number): string => {
      let stars = '';
      for (let i = 1; i <= 5; i++) {
        stars += `<i class="bi bi-star${i <= rating ? '-fill' : ''}" style="color: #ffd700;"></i>`;
      }
      return stars;
    };

    const modalContent = `
     <div class="modal fade" id="parkingDetailsModal" tabindex="-1" aria-labelledby="parkingDetailsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title d-flex align-items-center" id="parkingDetailsModalLabel">
            <i class="bi bi-geo-alt-fill me-2" style="font-size: 1.5rem; color: #007bff;"></i>
            ${parking.name}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex justify-content-between mb-3">
            <p><strong>Dirección:</strong> ${parking.address}</p>
            <p><strong>Capacidad:</strong> ${parking.capacity}</p>
          </div>
          <div class="mb-4">
            <p><strong>Descripción:</strong> ${parking.description || 'No disponible'}</p>
          </div>
          <div class="alert alert-info mb-4">
            <i class="bi bi-info-circle me-2"></i> Este parqueadero tiene acceso fácil y vigilancia 24/7.
          </div>
          <div class="mb-4">
            <p><strong>Puntuación:</strong> ${generateStars(parking.rating || 0)}</p> <!-- Puntuación -->
          </div>
          <div class="text-center">
            <p><i class="bi bi-calendar-check me-2"></i><strong>Reserva ahora y asegura tu espacio</strong></p>
          </div>
        </div>
        <div class="modal-footer justify-content-between">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            <i class="bi bi-x-circle me-2"></i>Cerrar
          </button>
          <button type="button" class="btn btn-primary" id="reserveButton" ${isNearest ? '' : 'disabled'}>
            <i class="bi bi-check-circle me-2"></i>Reservar
          </button>
        </div>
      </div>
    </div>
  </div>
    `;

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalContent;
    document.body.appendChild(modalContainer);

    const modalElement = document.getElementById('parkingDetailsModal');
    const modal = new bootstrap.Modal(modalElement!);
    modal.show();

    const reserveButton = document.getElementById('reserveButton');
    if (reserveButton) {
      reserveButton.addEventListener('click', () => {
        if (isNearest) {
          modal.hide();
          this.openReservationComponent(parking);
        } else {
          alert('Este parqueadero no está disponible para reservas.');
        }
      });
    }

    modalElement?.addEventListener('hidden.bs.modal', () => {
      modalContainer.remove();
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

  // Variable para almacenar el control de la ruta, para poder eliminar la ruta anterior si es necesario
  private routeControl: L.Routing.Control | null = null;

  private setUserLocation(): void {
    const defaultLocation: L.LatLngExpression = [1.2136, -77.2815]; // Coordenadas de Pasto

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords: L.LatLngExpression = [
            position.coords.latitude,
            position.coords.longitude
          ];

          // Crear un ícono personalizado para el usuario
          const userIcon = L.divIcon({
            html: `<i class="bi bi-person-fill" style="color: blue; font-size: 1.5rem;"></i>`, // Ícono de persona
            className: ''
          });

          // Crear marcador para la ubicación del usuario
          const userMarker = L.marker(userCoords, { icon: userIcon })
            .addTo(this.map!)
            .bindPopup('Tu ubicación actual', { closeButton: false })
            .openPopup();

          this.map?.setView(userCoords, 15);

          // Encontrar el parqueadero más cercano
          const nearestParking = this.findNearestParking(userCoords);
          if (nearestParking) {
            userMarker.bindPopup(`
            <div>
              <strong>Tu ubicación actual</strong><br>
              <strong>El parqueadero más cercano es:</strong><br>
              <span>${nearestParking.name}</span><br>
            
          `)
              .openPopup();


            // Crear la ruta hacia el parqueadero más cercano sin marcadores adicionales
            this.createRoute(userCoords, [nearestParking.lat, nearestParking.lng]);
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

  /**
   * Crear una ruta desde la ubicación del usuario hasta el parqueadero más cercano.
   * @param start LatLng de la ubicación de inicio (usuario).
   * @param end LatLng de la ubicación de destino (parqueadero).
   */
  private createRoute(start: L.LatLngExpression, end: L.LatLngExpression): void {
    // Si ya existe una ruta, eliminarla antes de crear una nueva
    if (this.routeControl) {
      this.map?.removeControl(this.routeControl);
    }

    // Crear el control de la ruta sin marcadores
    this.routeControl = L.Routing.control({
      waypoints: [
        L.latLng(start),
        L.latLng(end)
      ],
      routeWhileDragging: true,  // Permite mover el marcador de ruta
      showAlternatives: false,   // No mostrar rutas alternativas
      // No crear marcadores en la ruta
    }).addTo(this.map!);
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
      // Crear la ruta hacia el parqueadero más cercano sin marcadores
      this.createRoute(location, [nearestParking.lat, nearestParking.lng]);
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
