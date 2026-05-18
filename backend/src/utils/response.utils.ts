import type { Response } from 'express';
import type { ApiResponse, ValidationError } from '../types';

export function sendSuccess<T>(res: Response, statusCode: number, message: string, data?: T): void {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors?: ValidationError[],
): void {
  const body: ApiResponse = {
    success: false,
    message,
    errors,
  };
  res.status(statusCode).json(body);
}
