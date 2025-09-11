import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { logger } from './config/logger';
import { requestLogger } from './middlewares/logger';
import { errorHandler } from './middlewares/errorHandler';
import { apiRoutes } from './routes';

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(requestLogger);

// API routes
app.use('/api', apiRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à Atabrinze API',
    version: '1.0.0',
    docs: '/api/health',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.method} ${req.originalUrl} não existe`,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`🚀 Atabrinze API running on port ${PORT}`);
  logger.info(`🌍 Environment: ${config.nodeEnv}`);
  logger.info(`📚 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
