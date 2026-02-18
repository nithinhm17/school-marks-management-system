const { exec } = require('child_process');

exec('netstat -ano | findstr :5000', (err, stdout, stderr) => {
    if (err) {
        console.log('No process found on port 5000');
        return;
    }

    const lines = stdout.trim().split('\n');
    if (lines.length > 0) {
        const parts = lines[0].trim().split(/\s+/);
        const pid = parts[parts.length - 1];

        if (pid) {
            console.log(`Killing process ${pid}...`);
            exec(`taskkill /F /PID ${pid}`, (kErr, kStdout, kStderr) => {
                if (kErr) {
                    console.error('Failed to kill process:', kErr);
                } else {
                    console.log('Process killed successfully');
                }
            });
        }
    }
});
