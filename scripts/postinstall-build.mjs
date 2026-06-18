import { execSync } from 'child_process';
import { existsSync } from 'fs';

if (process.env.RENDER && !existsSync('dist-server/server.js')) {
  console.log('Running production build on Render...');
  execSync('npm run build', { stdio: 'inherit' });
}
