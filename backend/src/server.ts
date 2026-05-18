import 'dotenv/config';
import { config } from './config/env';
import { connectDB } from './config/db';
import app from './app';

async function start(): Promise<void> {
  try {
    await connectDB();

    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });

    process.on('unhandledRejection', (reason: unknown) => {
      console.error('Unhandled Rejection:', reason);
      process.exit(1);
    });

    process.on('uncaughtException', (error: unknown) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
