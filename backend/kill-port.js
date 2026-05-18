const { execSync } = require('child_process');

const PORT = 5000;

try {
  const result = execSync(`netstat -ano | findstr :${PORT}`, { encoding: 'utf8' });
  const lines = result.trim().split('\n');

  const pids = new Set();
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    const localAddr = parts[1] || '';
    if (localAddr.endsWith(`:${PORT}`)) {
      const pid = parts[parts.length - 1];
      if (pid && /^\d+$/.test(pid) && pid !== '0') {
        pids.add(pid);
      }
    }
  }

  if (pids.size === 0) {
    console.log(`✅  Port ${PORT} is already free.`);
  } else {
    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { encoding: 'utf8' });
        console.log(`🔪  Killed PID ${pid} (was using port ${PORT})`);
      } catch {
        // process may have already exited
      }
    }
  }
} catch {
  // netstat found nothing — port is free
  console.log(`✅  Port ${PORT} is already free.`);
}
