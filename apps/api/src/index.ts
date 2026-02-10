import express, { Request, Response } from 'express';
import cors from 'cors';
import { HealthResponse } from '@app/shared';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  const response: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
