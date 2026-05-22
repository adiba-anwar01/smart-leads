import type { Response } from 'express';
import type { ApiResponse, ValidationError } from '../types';



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
