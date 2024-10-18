export interface User {
    user_id: number;
    username: string;
    full_name:string;
    email: string;
    role_id: 1 | 2;
    created_at: string;

    // Agrega otros campos según sea necesario
  }