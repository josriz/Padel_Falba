import open from 'open';
import { spawn } from 'child_process';

const url = 'http://localhost:5173';

(async () => {
  await open(url);

  const vite = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });

  vite.on('close', (code) => {
    process.exit(code);
  });
})();
