import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr'; 
import { ReactiveFormsModule } from '@angular/forms'; 


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ParkingSpacesComponent } from './parking-spaces/parking-spaces.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { AdminReservasComponent } from './admin-reservas/admin-reservas.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersManagerComponent } from './users-manager/users-manager.component';
import { SpacesAdminComponent } from './spaces-admin/spaces-admin.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ParkingSpacesComponent,
    MyProfileComponent,
    AdminReservasComponent,
    DashboardComponent,
    UsersManagerComponent,
    SpacesAdminComponent,
    ForgetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
     
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
