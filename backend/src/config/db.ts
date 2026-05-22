import mongoose from 'mongoose';
import { config } from './env';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(config.MONGO_URI);
  } catch (error) {
    throw error;
  }
}
