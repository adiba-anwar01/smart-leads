import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import router from './routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (config.NODE_ENV === 'development') {
        callback(null, true);
        return;
      }

      if (!origin) {
        callback(null, true);
        return;
      }

      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Content-Disposition'],
  }),
);

if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

export default app;
