# 🚗 ParkEasy - Sistema de Gestión de Parqueadero 🚗

ParkEasy es un sistema de gestión de parqueaderos que permite a los usuarios reservar espacios de estacionamiento de manera eficiente. Este proyecto está construido con **Angular** en el frontend y **Node.js (Express)** en el backend, utilizando **PostgreSQL** como base de datos y **Sequelize** para la interacción con la misma.

## 🛠️ Tecnologías Utilizadas

### Frontend (Angular)
- **Angular 15+**: Framework para aplicaciones web modernas.
- **Bootstrap 5**: Librería de diseño para un UI responsivo y atractivo.
- **RxJS**: Manejo de operaciones asíncronas.
- **Angular Router**: Para la navegación entre componentes.

### Backend (Node.js + Express)
- **Node.js**: Entorno de ejecución para el backend.
- **Express**: Framework minimalista para servidores en Node.js.
- **Sequelize**: ORM para gestionar la base de datos PostgreSQL.
- **JWT**: Para la autenticación segura de usuarios.

### Base de Datos
- **PostgreSQL**: Base de datos relacional utilizada para almacenar usuarios, vehículos, espacios y reservas.

## 🚀 Funcionalidades

### Usuario
- Registro y autenticación (Inicio de sesión).
- Visualización de los espacios disponibles.
- Reserva de un espacio de parqueo.
- Consulta de reservas activas y finalizadas.

### Administrador
- Gestión de usuarios y vehículos.
- Gestión de espacios de estacionamiento (creación, edición, eliminación).
- Monitoreo de las reservas de estacionamiento.

## 🛠️ Instalación y Configuración

### 1. Clonar este repositorio

```bash
git clone https://github.com/tu-usuario/parkeasy.git
cd parkeasy


## 🛠️ Instalación y Configuración

### 2. Configurar el Backend (Node.js + Express)

1. Ve a la carpeta `backend`:

    ```bash
    cd backend
    ```

2. Instala las dependencias:

    ```bash
    npm install
    ```

5. Inicia el servidor:

    ```bash
    npm 
    ```
5. Inicia el servidor:

    ```bash
    npm 
    ```

    El servidor debería estar corriendo en `http://localhost:3000`.

### 3. Configurar el Frontend (Angular)

1. Ve a la carpeta `frontend`:

    ```bash
    cd frontend
    ```

2. Instala las dependencias:

    ```bash
    npm install
    ```

3. Configura las URL del backend en los archivos de entorno `src/environments/environment.ts`:

    ```ts
    export const environment = {
      production: false,
      apiUrl: 'http://localhost:3000'
    };
    ```

4. Inicia la aplicación Angular:

    ```bash
    ng serve
    ```

    El frontend debería estar corriendo en `http://localhost:4200`.

## 🧪 Pruebas

Puedes ejecutar pruebas unitarias para el frontend utilizando el siguiente comando:

```bash
ng test
