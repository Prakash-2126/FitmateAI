import mongoose from 'mongoose';
import { ENV } from './env.js';

let cachedConnection = null;

export const connectDB = async () => {
  // If already connected, reuse connection (readyState: 1 = connected)
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If already connecting, wait for it
  if (mongoose.connection.readyState === 2) {
    let attempts = 0;
    while (mongoose.connection.readyState === 2 && attempts < 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      attempts++;
    }
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
  }

  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    cachedConnection = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[Database] MongoDB Connected: ${cachedConnection.connection.host}/${cachedConnection.connection.name}`);
    return cachedConnection;
  } catch (error) {
    console.error(`[Database Error] MongoDB connection failed: ${error.message}`);
    throw error;
  }
};

