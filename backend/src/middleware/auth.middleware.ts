import type { NextFunction, Response } from 'express';
import { AppError } from './error.middleware';
import { verifyToken } from '../utils/jwt.utils';
import { UserModel } from '../models/user.model';
import type { AuthenticatedRequest } from '../types';

export async function protect(req: AuthenticatedRequest, _res: Response, next: NextFunction): Promise<void> {
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
    
    // Check if user still exists in DB
    const user = await UserModel.findById(payload.id);
    if (!user) {
      return next(new AppError('User belonging to this token no longer exists', 401));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated', 403));
    }

    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
}
