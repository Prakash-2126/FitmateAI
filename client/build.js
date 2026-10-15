import { execSync } from 'child_process';

console.log('[Build] Running Vite build in client directory');
execSync('npm run build', { stdio: 'inherit' });
