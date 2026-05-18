import type { RequestHandler } from 'express';
import { UserModel } from '../models/user.model';
import { generateToken } from '../utils/jwt.utils';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/error.middleware';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return next(new AppError('Email already exists', 409));
    }

    const user = await UserModel.create({ name, email, password });

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    sendSuccess(res, 201, 'User created successfully', {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
      return next(new AppError('Invalid credentials', 401));
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid credentials', 401));
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    sendSuccess(res, 200, 'Login successful', {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
