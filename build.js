import fs from 'node:fs';
import { execSync } from 'node:child_process';

const hasClient = fs.existsSync('./client/package.json');
const targetDir = hasClient ? './client' : '.';

console.log(`[Build] Building Vite client in: ${targetDir}`);

try {
execSync('npm run build', {
cwd: targetDir,
stdio: 'inherit'
});

const sourceDist = `${targetDir}/dist`;

if (!fs.existsSync(sourceDist)) {
throw new Error(`Build output directory not found: ${sourceDist}`);
}

if (hasClient) {
fs.cpSync(sourceDist, './dist', {
recursive: true,
force: true
});

```
console.log('[Build] Copied client/dist to root dist.');
```

}

if (!fs.existsSync('./dist/index.html')) {
throw new Error('dist/index.html was not found after the build.');
}

console.log('[Build] Build completed successfully.');
} catch (error) {
console.error('[Build] Failed:', error.message);
process.exit(1);
}
