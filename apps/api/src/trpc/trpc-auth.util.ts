import { TRPCError } from '@trpc/server';
import { RolUsuario } from '@graduate-employment-management/database';
import { TrpcContext } from './trpc.context';

export function requireUser(ctx: TrpcContext) {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Autenticación requerida',
    });
  }

  return ctx.user;
}

export function requireRole(ctx: TrpcContext, ...roles: RolUsuario[]) {
  const user = requireUser(ctx);

  if (!roles.includes(user.rol)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'No tienes permisos para realizar esta acción',
    });
  }

  return user;
}
