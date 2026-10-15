import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { ENV } from './config/env.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import mealRoutes from './routes/mealRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import completionRoutes from './routes/completionRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import recommendationsRoutes from './routes/recommendationsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';

const app = express();

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Logging
if (ENV.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// CORS configuration supporting credentials
const allowedOrigins = [
  ENV.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Dev flexible origin
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(ENV.COOKIE_SECRET));

// Global API Rate Limiter
app.use('/api', apiLimiter);

// Base API status endpoint
app.get(['/api', '/api/'], (req, res) => {
  res.status(200).json({
    success: true,
    service: 'FitMate AI Backend API',
    status: 'online',
    message: 'FitMate AI REST API is running successfully.',
    environment: ENV.NODE_ENV,
    clientUrl: ENV.CLIENT_URL,
    health: '/api/health',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      profile: '/api/profile',
      goals: '/api/goals',
      meals: '/api/meals',
      exercises: '/api/exercises',
      workouts: '/api/workouts',
      schedule: '/api/schedule',
      completions: '/api/workout-completions',
      progress: '/api/progress',
      recommendations: '/api/recommendations',
      ai: '/api/ai',
      settings: '/api/settings',
      recipes: '/api/recipes',
    },
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'FitMate AI Backend API',
    environment: ENV.NODE_ENV,
    aiProvider: ENV.AI_PROVIDER,
    aiConfigured: Boolean(ENV.AI_API_KEY && ENV.AI_API_KEY.trim()),
  });
});

// Mount modular REST API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/workout-completions', completionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/recipes', recipeRoutes);

// Static client serving when built
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // If no dist build, provide a clean welcome page on GET /
  app.get('/', (req, res) => {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>FitMate AI Backend</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #1e293b; padding: 2.5rem; border-radius: 1rem; border: 1px solid #334155; text-align: center; max-width: 480px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); }
            h1 { color: #10b981; margin-top: 0; }
            p { color: #94a3b8; line-height: 1.6; }
            a { display: inline-block; margin-top: 1.5rem; background: #10b981; color: #022c22; padding: 0.75rem 1.5rem; border-radius: 0.75rem; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>FitMate AI API Server</h1>
            <p>The backend service is online and healthy on <strong>port 5000</strong>.</p>
            <p>Open the web application in your browser at:</p>
            <a href="http://localhost:5173" target="_blank">Open FitMate AI App (http://localhost:5173) &rarr;</a>
          </div>
        </body>
      </html>
    `);
  });
}

// Catch 404s and handle errors
app.use(notFound);
app.use(errorHandler);

export default app;
