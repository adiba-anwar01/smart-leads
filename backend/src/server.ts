import 'dotenv/config';
import { config } from './config/env';
import { connectDB } from './config/db';
import app from './app';

async function start(): Promise<void> {
  try {
    await connectDB();

    app.listen(config.PORT, () => {
    });

    process.on('unhandledRejection', () => {
      process.exit(1);
    });

    process.on('uncaughtException', () => {
      process.exit(1);
    });
  } catch (error) {
    process.exit(1);
  }
}

start().catch(() => {
  process.exit(1);
});

