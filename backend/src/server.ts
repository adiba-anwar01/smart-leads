import 'dotenv/config';
import { config } from './config/env';
import { connectDB } from './config/db';
import app from './app';

async function start(): Promise<void> {
  try {
    await connectDB();

    app.listen(config.PORT, () => {
    });

    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection:', err);
      process.exit(1);
    });

    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      process.exit(1);
    });
  } catch (error) {
    console.error('Start Error:', error);
    process.exit(1);
  }
}

start().catch((err) => {
  console.error('Start Catch:', err);
  process.exit(1);
});

