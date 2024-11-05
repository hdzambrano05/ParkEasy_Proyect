import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Importa el guard de autenticación
import { RoleGuard } from './guards/role.guard'; // Importa el guard basado en roles



import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ParkingSpacesComponent } from './parking-spaces/parking-spaces.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { AdminReservasComponent } from './admin-reservas/admin-reservas.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersManagerComponent } from './users-manager/users-manager.component';
import { SpacesAdminComponent } from './spaces-admin/spaces-admin.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [




  {
    path: '',
    component: HomeComponent
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path : 'forget_password',
    component: ForgetPasswordComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'map',
    component: MapComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'spaces',
    component: ParkingSpacesComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'myProfile',
    component: MyProfileComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'adminSpaces',
    component: SpacesAdminComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 1 } // Sólo accesible para administradores
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 1 } // Sólo accesible para administradores
  },

  {
    path: 'manage-users',
    component: UsersManagerComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 1 } // Sólo accesible para administradores
  },

  {
    path: 'adminReservas',
    component: AdminReservasComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 1 } // Sólo accesible para administradores
  },


  // Redirige a la página de inicio para cualquier ruta no encontrada
  {
    path: '**',
    redirectTo: ''
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
