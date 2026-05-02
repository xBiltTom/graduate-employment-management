import { RolUsuario } from '@graduate-employment-management/database';

export interface JwtPayload {
  sub: string;
  email: string;
  rol: RolUsuario;
  iat?: number;
  exp?: number;
}
