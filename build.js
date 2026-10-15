import fs from 'fs';
import { execSync } from 'child_process';

const inRoot = fs.existsSync('./client');
const targetDir = inRoot ? './client' : '.';

console.log(`[Build] Location: ${inRoot ? 'Repository Root' : 'client directory'}`);
console.log(`[Build] Building Vite client in: ${targetDir}`);

// Install dependencies and run Vite production build
execSync('npm install', { cwd: targetDir, stdio: 'inherit' });
execSync('npm run build', { cwd: targetDir, stdio: 'inherit' });

// Ensure output is available at ./dist for Vercel
if (inRoot && fs.existsSync('./client/dist')) {
  try {
    fs.cpSync('./client/dist', './dist', { recursive: true, force: true });
    console.log('[Build] Successfully synchronized client/dist to ./dist for Vercel.');
  } catch (err) {
    console.warn('[Build] Warning copying dist directory:', err.message);
  }
}
