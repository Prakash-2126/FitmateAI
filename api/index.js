import { connectDB } from '../server/src/config/db.js';
import app from '../server/src/app.js';

let isSeeded = false;

/**
 * Vercel Serverless Function entry point for FitMate AI API.
 * Ensures MongoDB is connected before dispatching requests to Express.
 */
export default async function handler(req, res) {
  try {
    // Connect / reuse cached connection to MongoDB
    await connectDB();

    // Trigger initial seed asynchronously on first container startup
    if (!isSeeded) {
      isSeeded = true;
      Promise.all([
        import('../server/src/utils/seedExercises.js').then((m) => m.seedExercises()),
        import('../server/src/utils/seedRecipes.js').then((m) => m.seedRecipes()),
      ]).catch((seedErr) => {
        console.warn('[Vercel Serverless] Auto-seed background notice:', seedErr.message);
      });
    }
  } catch (error) {
    console.error('[Vercel Serverless DB Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to connect to MongoDB database in serverless handler.',
      error: error.message,
      help: 'Please ensure MONGODB_URI is properly configured in Vercel Project Settings > Environment Variables.',
    });
  }

  // Forward request to Express app
  return app(req, res);
}
