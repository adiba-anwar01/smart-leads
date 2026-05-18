import jwt, { type SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';
import type { JwtPayload } from '../types';

export function generateToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: config.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, config.JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.JWT_SECRET) as JwtPayload;
}
