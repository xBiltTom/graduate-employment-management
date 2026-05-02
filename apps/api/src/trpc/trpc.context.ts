import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

export interface TrpcContext {
  req: Request;
  res: Response;
  user: AuthenticatedUser | null;
}

export async function createTrpcContext({
  req,
  res,
  authService,
}: {
  req: Request;
  res: Response;
  authService: AuthService;
}): Promise<TrpcContext> {
  return {
    req,
    res,
    user: await authService.getUserFromRequest(req),
  };
}
