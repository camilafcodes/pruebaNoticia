import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { HealthResponse } from '@app/shared';
import newsRoutes from './routes/newsRoutes';
import { errorHandler } from './middleware/errorHandler';
import { startCronJobs } from './services/cronService';
import { ingestAllNews } from './services/ingestionService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  const response: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };
  res.json(response);
});

app.use('/api/v1', newsRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      console.log('Running initial news ingestion...');
      await ingestAllNews();
      
      startCronJobs();
    }

    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
