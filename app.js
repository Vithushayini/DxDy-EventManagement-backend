import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
  app.use(express.json());

  // Simple health check
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is running' });
  });
  app.use('/api/auth', authRoutes);

  app.use(errorHandler);

  return app;
}
