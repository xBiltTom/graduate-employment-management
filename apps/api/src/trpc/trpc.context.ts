import { Request, Response } from 'express';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

export interface TrpcContext {
  req: Request;
  res: Response;
  user: AuthenticatedUser | null;
}

export function createTrpcContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): TrpcContext {
  return {
    req,
    res,
    user: null,
  };
}
