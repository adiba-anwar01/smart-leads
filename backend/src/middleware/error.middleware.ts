import type { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';
import { sendError } from '../utils/response.utils';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, string>;
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message);
    return;
  }

  const mongoErr = err as MongoError;

  if (mongoErr.code === 11000) {
    const field = Object.keys(mongoErr.keyValue || {})[0];
    sendError(res, 409, `${field || 'field'} already exists`);
    return;
  }

  if (err.name === 'CastError') {
    sendError(res, 400, 'Invalid ID format');
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    sendError(res, 401, 'Invalid token');
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 401, 'Token expired');
    return;
  }

  if (config.NODE_ENV !== 'production') {
  }

  sendError(res, 500, 'Internal server error');
}
