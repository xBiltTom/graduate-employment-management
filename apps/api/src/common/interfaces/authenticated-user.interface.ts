import { RolUsuario } from '@graduate-employment-management/database';

export interface AuthenticatedUser {
  id: string;
  email: string;
  rol: RolUsuario;
}
