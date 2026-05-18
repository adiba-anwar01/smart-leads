import type { NextFunction, Response } from 'express';
import { AppError } from './error.middleware';
import { verifyToken } from '../utils/jwt.utils';
import type { AuthenticatedRequest } from '../types';

export function protect(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new AppError('No token provided', 401));
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next(new AppError('No token provided', 401));
    }

    const token = parts[1];
    if (!token) {
      return next(new AppError('No token provided', 401));
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
}
