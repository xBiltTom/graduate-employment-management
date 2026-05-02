import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '@graduate-employment-management/database';
import { ROLES_KEY } from '../constants/app.constants';

export const Roles = (...roles: RolUsuario[]) => SetMetadata(ROLES_KEY, roles);
