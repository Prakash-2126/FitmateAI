import fs from 'fs';
import { execSync } from 'child_process';

// Detect whether we are running in the repo root or inside the client directory
const inRoot = fs.existsSync('./client');
const targetDir = inRoot ? './client' : '.';

console.log(`[Build] Detected execution location: ${inRoot ? 'Repository Root' : 'client directory'}`);
console.log(`[Build] Running Vite build in: ${targetDir}`);

// Install client dependencies and run build
execSync('npm install', { cwd: targetDir, stdio: 'inherit' });
execSync('npm run build', { cwd: targetDir, stdio: 'inherit' });

// Ensure output is available at both client/dist and ./dist
if (inRoot && fs.existsSync('./client/dist')) {
  try {
    if (!fs.existsSync('./dist')) {
      fs.cpSync('./client/dist', './dist', { recursive: true });
      console.log('[Build] Synced client/dist to ./dist for Vercel.');
    }
  } catch (err) {
    console.warn('[Build] Notice syncing dist folders:', err.message);
  }
}
