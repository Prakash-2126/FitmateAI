import app from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { seedExercises } from './utils/seedExercises.js';
import { seedRecipes } from './utils/seedRecipes.js';

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Seed default exercise library and diet recipes if empty
    await seedExercises();
    await seedRecipes();

    const server = app.listen(ENV.PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 FitMate AI Server running in ${ENV.NODE_ENV} mode`);
      console.log(`🔗 API URL: http://localhost:${ENV.PORT}/api`);
      console.log(`🌐 Allowed Client: ${ENV.CLIENT_URL}`);
      console.log(`🤖 AI Provider: ${ENV.AI_PROVIDER} (${ENV.AI_API_KEY ? 'Key configured' : 'Unconfigured'})`);
      console.log(`===============================================`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[Unhandled Rejection] Error: ${err.message}`);
      // Close server & exit
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error(`[Startup Error] ${error.message}`);
    process.exit(1);
  }
};

startServer();
