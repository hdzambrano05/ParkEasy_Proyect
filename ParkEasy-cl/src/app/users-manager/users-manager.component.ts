import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/admin-users.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-users-manager',
  templateUrl: './users-manager.component.html',
  styleUrls: ['./users-manager.component.css']
})
export class UsersManagerComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];

  // Variables para la búsqueda y el filtrado
  searchTerm: string = '';
  filterRole: string = '';
  showFilterOptions: boolean = false;
  isListView: boolean = false;

  // Inicializar el usuario seleccionado con los campos correspondientes
  selectedUser: User = {
    user_id: 0,
    username: '',
    password: '',
    full_name: '',
    email: '',
    role_id: 2,
    created_at: '' // Por defecto se asigna el rol de usuario
  };

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  // Cargar los usuarios al iniciar el componente y asignarlos a filteredUsers
  loadUsers(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
      this.filteredUsers = data; // Inicialmente mostrar todos los usuarios
      this.sortUsers(); // Ordenar los usuarios después de cargarlos
    });
  }

  // Método para alternar las opciones de filtro
  toggleFilter(): void {
    this.showFilterOptions = !this.showFilterOptions;
  }

  // Método para alternar entre vista de lista y tarjeta
  toggleView(): void {
    this.isListView = !this.isListView; // Cambiar entre vista de lista y tarjeta
  }

  filterUsers(): void {
    console.log("Término de búsqueda:", this.searchTerm); // Log para depuración
    this.filteredUsers = this.users.filter(user => {
      const username = user.username ? user.username.toLowerCase() : ''; // Manejar valores nulos
      const fullName = user.full_name ? user.full_name.toLowerCase() : ''; // Manejar valores nulos
      const matchesSearch = this.searchTerm
        ? username.includes(this.searchTerm.toLowerCase()) ||
        fullName.includes(this.searchTerm.toLowerCase())
        : true;
      const matchesRole = this.filterRole ? user.role_id === +this.filterRole : true;

      // Log para depurar
      console.log(`Usuario: ${user.username}, Coincide con búsqueda: ${matchesSearch}, Coincide con rol: ${matchesRole}`);

      return matchesSearch && matchesRole;
    });

    this.sortUsers(); // Ordenar después de filtrar
  }

  // Ordenar usuarios por fecha de creación (más recientes primero)
  sortUsers(): void {
    this.filteredUsers.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA; // Ordenar de más reciente a más antiguo
    });
  }

  // Seleccionar usuario para edición y abrir el modal
  editUser(user: User): void {
    this.selectedUser = { ...user };
  }

  // Eliminar usuario
  deleteUser(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.loadUsers(); // Recargar usuarios después de la eliminación
      });
    }
  }
  isPasswordVisible = false;

  togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
  }

  // Resetear el formulario a sus valores iniciales
  resetForm(): void {
    this.selectedUser = {
      user_id: 0,
      username: '',
      password: '',
      full_name: '',
      email: '',
      role_id: 2, // Valor por defecto como usuario
      created_at: ''
    };
  }

  // Enviar los datos del formulario (Crear o Editar)
  onSubmit(): void {
    if (this.selectedUser.user_id) {
      this.userService.updateUser(this.selectedUser.user_id, this.selectedUser).subscribe(() => {
        this.loadUsers(); // Recargar usuarios después de la actualización
        this.resetForm(); // Reiniciar el formulario
      });
    } else {
      this.userService.createUser(this.selectedUser).subscribe(() => {
        this.loadUsers(); // Recargar usuarios después de crear
        this.resetForm(); // Reiniciar el formulario
      });
    }
  }
}
