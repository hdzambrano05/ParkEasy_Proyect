# 🚗 ParkEasy - Parking Management System 🚗

ParkEasy is a parking management system that allows users to efficiently reserve parking spaces. This project is built with **Angular** for the frontend and **Node.js (Express)** for the backend, using **PostgreSQL** as the database and **Sequelize** for database interaction.

## 🛠️ Technologies Used

### Frontend (Angular)
- **Angular 15+**: Framework for modern web applications
- **Bootstrap 5**: Design library for responsive and attractive UI
- **RxJS**: Handling asynchronous operations
- **Angular Router**: For component navigation

### Backend (Node.js + Express)
- **Node.js**: Runtime environment for the backend
- **Express**: Minimalist framework for Node.js servers
- **Sequelize**: ORM for PostgreSQL database management

### Database
- **PostgreSQL**: Relational database used to store users, vehicles, spaces, and reservations

## 🚀 Features

### User
- Registration and authentication (Login)
- View available spaces
- Parking space reservation
- View active and completed reservations

### Administrator
- User and vehicle management
- Parking space management (creation, editing, deletion)
- Parking reservation monitoring

## 🛠️ Installation and Setup

### 1. Clone this repository
```bash
git clone https://github.com/your-username/parkeasy.git
cd parkeasy
```

### 2. Configure Backend (Node.js + Express)
1. Go to the `backend` folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Install Nodemon:
```bash
npm install nodemon
```

4. Start the server:
```bash
nodemon
```
The server should be running on `http://localhost:3000`.

### 3. Configure Frontend (Angular)
1. Go to the `frontend` folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the Angular application:
```bash
ng serve
```
The frontend should be running on `http://localhost:4200`.

## 🔧 API - Main Endpoints
- **POST** `/auth/login`: Login
- **POST** `/auth/register`: User registration
- **GET** `/spaces`: List all available parking spaces
- **POST** `/reservations`: Reserve a parking space
- **PATCH** `/reservations/:id/checkout`: Mark vehicle departure
- **GET** `/vehicles`: Query registered vehicles

## 📦 Main Dependencies

### Backend (Node.js + Express)
- **bcryptjs**: For password encryption
- **Sequelize**: Database ORM
- **pg**: PostgreSQL connector

### Frontend (Angular)
- **Bootstrap**: For responsive design
- **RxJS**: For handling asynchronous events
- **ngx-bootstrap**: For handling modals and other components

## 🗂️ Project Structure
```bash
parkeasy/
│
├── backend/         # Backend folder with Express and Node.js
│   ├── config/      # Database configuration
│   ├── controllers/ # Route business logic
│   ├── models/      # Sequelize models
│   ├── routes/      # API routes
│   └── server.js    # Backend entry point
│
├── frontend/        # Frontend folder with Angular
│   ├── src/         # Angular application source code
│   ├── environments # Environment configuration
│   └── app/         # Application components and services
└── README.md        # This file
```
