import dotenv from 'dotenv';
dotenv.config();

/**
 * Automatically sanitizes MongoDB URIs when passwords contain unencoded special characters like '@'
 */
const sanitizeMongoUri = (rawUri) => {
  if (!rawUri || typeof rawUri !== 'string') return rawUri;
  try {
    const trimmed = rawUri.trim();
    const prefixMatch = trimmed.match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/);
    if (!prefixMatch) return trimmed;

    const [, prefix, rest] = prefixMatch;
    const lastAtIndex = rest.lastIndexOf('@');
    if (lastAtIndex === -1) return trimmed; // No credentials in URI

    const authPart = rest.substring(0, lastAtIndex);
    const hostPart = rest.substring(lastAtIndex + 1);

    const colonIndex = authPart.indexOf(':');
    if (colonIndex === -1) return trimmed;

    const user = authPart.substring(0, colonIndex);
    let pass = authPart.substring(colonIndex + 1);

    // If password contains literal '@' that is not yet encoded as '%40'
    if (pass.includes('@')) {
      pass = pass.replace(/@/g, '%40');
      return `${prefix}${user}:${pass}@${hostPart}`;
    }

    return trimmed;
  } catch {
    return rawUri;
  }
};

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: sanitizeMongoUri(process.env.MONGODB_URI) || 'mongodb://127.0.0.1:27017/fitmate_ai',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'fitmate_ai_jwt_super_secret_dev_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'fitmate_ai_cookie_dev_secret_2026',
  AI_PROVIDER: process.env.AI_PROVIDER || 'gemini',
  AI_API_KEY: process.env.AI_API_KEY || '',
  AI_MODEL: process.env.AI_MODEL || 'gemini-3.5-flash-lite',
};


