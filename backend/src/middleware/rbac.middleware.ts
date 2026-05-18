import type { NextFunction, Response, RequestHandler } from 'express';
import { AppError } from './error.middleware';
import type { AuthenticatedRequest } from '../types';

export function restrictTo(...roles: Array<'admin' | 'sales_user'>): RequestHandler {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      return next(new AppError('Access denied', 403));
    }

    next();
  };
}
