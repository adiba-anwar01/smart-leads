import type { Response, NextFunction } from 'express';
import { UserModel } from '../models/user.model';
import { LeadModel } from '../models/lead.model';
import { AppError } from '../middleware/error.middleware';
import type { AuthenticatedRequest } from '../types/index';

export async function getUsers(
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const users = await UserModel.find({ role: 'sales_user' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: 'Users fetched successfully', data: users });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (id === req.user!.id) {
      return next(new AppError('You cannot delete your own account', 400));
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    await LeadModel.deleteMany({ createdBy: id });
    await UserModel.findByIdAndDelete(id);
    
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function updateUserStatus(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    if (id === req.user!.id) {
      return next(new AppError('You cannot change your own status', 400));
    }

    const user = await UserModel.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({ success: true, message: 'User status updated successfully', data: user });
  } catch (error) {
    next(error);
  }
}
