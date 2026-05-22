import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { ValidationError } from 'express-validator';
import { validationResult, body } from 'express-validator';
import mongoose from 'mongoose';
import { sendError } from '../utils/response.utils';

export function validate(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map((error: ValidationError) => ({
      field: error.type === 'field' ? error.path : error.type,
      message: error.msg as string,
    }));
    sendError(res, 422, 'Validation failed', validationErrors);
    return;
  }
  next();
}

export const registerValidation: RequestHandler[] = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidation: RequestHandler[] = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const createLeadValidation: RequestHandler[] = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Status must be one of: New, Contacted, Qualified, Lost'),
  body('source')
    .notEmpty()
    .withMessage('Source is required')
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Source must be one of: Website, Instagram, Referral'),
  body('createdBy')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Invalid User ID format'),
];

export const updateLeadValidation: RequestHandler[] = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Status must be one of: New, Contacted, Qualified, Lost'),
  body('source')
    .optional()
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Source must be one of: Website, Instagram, Referral'),
  body('createdBy')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Invalid User ID format'),
];

export function validateObjectId(req: Request, res: Response, next: NextFunction): void {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    sendError(res, 400, 'Invalid ID format');
    return;
  }

  next();
}
