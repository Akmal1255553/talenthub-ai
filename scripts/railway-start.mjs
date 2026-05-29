import { execSync } from 'node:child_process';

const service = (process.env.RAILWAY_SERVICE_NAME ?? 'api').toLowerCase();

const commands = {
  api: 'npm run railway:start:api',
  web: 'npm run railway:start:web',
};

const cmd = service.includes('web') ? commands.web : commands.api;

console.log(`[railway-start] service=${service} → ${cmd}`);
execSync(cmd, { stdio: 'inherit' });
