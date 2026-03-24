/**
 * Cross-platform helper script for API operations (build, setup, start, test).
 * Handles venv activation differences between Windows (Scripts/) and Unix (bin/).
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const apiDir = path.join(__dirname, '..', 'api');
const venvDir = path.join(apiDir, '.venv');
const binDir = path.join(venvDir, process.platform === 'win32' ? 'Scripts' : 'bin');

function run(cmd, opts = {}) {
  execSync(cmd, { stdio: 'inherit', cwd: apiDir, ...opts });
}

function ensureVenv() {
  if (!fs.existsSync(venvDir)) {
    console.log('Creating Python virtual environment...');
    run('python -m venv .venv');
  }
}

function installDeps() {
  const pip = path.join(binDir, 'pip');
  run(`"${pip}" install -r requirements.txt`);
}

function setup() {
  ensureVenv();
  installDeps();
}

const command = process.argv[2];

switch (command) {
  case 'build':
  case 'setup':
    run('python -m venv .venv');
    installDeps();
    break;

  case 'start':
    setup();
    const uvicorn = path.join(binDir, 'uvicorn');
    run(`"${uvicorn}" app.main:app --reload --port 3000`);
    break;

  case 'test':
    setup();
    const pytest = path.join(binDir, 'pytest');
    run(`"${pytest}"`);
    break;

  default:
    console.error(`Unknown command: ${command}`);
    console.error('Usage: node scripts/run-api.js [build|setup|start|test]');
    process.exit(1);
}
