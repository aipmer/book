#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
🤖 Codex Watchdog CLI Tool
=============================================
Usage:
  codex-watchdog <command> [options]

Commands:
  install    Interactive onboarding wizard — generates watchdog.config.json
  gateway    Launch the mobile watchdog notification gateway (Ch.08)
  tunnel     Launch reverse port-forwarding helper (Ch.03)

Options:
  --port     Specify port (default: 8080 for gateway, 5432 for tunnel)
  --user     Specify authorized user (default: hunkwu)
  --type     Specify tunnel provider [ngrok | ssh] (default: ngrok)
  --vps      VPS address for SSH (e.g. user@vps.com)
  --vps-port Exposed port on VPS (default: 54320)
  `);
}

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  printHelp();
  process.exit(0);
}

const command = args[0];

// Parse simple key-value arguments (e.g., --port 8080)
const params = {};
for (let i = 1; i < args.length; i += 2) {
  const key = args[i].replace(/^--/, '');
  const val = args[i + 1];
  if (key && val) {
    params[key] = val;
  }
}

// 若存在 install 向导生成的 watchdog.config.json，作为参数缺省值（命令行显式参数优先）
const fs = require('fs');
const configPath = path.resolve(process.cwd(), 'watchdog.config.json');
let savedConfig = null;
if (fs.existsSync(configPath)) {
  try {
    savedConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch {
    console.warn(`⚠️  watchdog.config.json 解析失败，忽略该文件。`);
  }
}

if (command === 'install') {
  // 交互式安装向导：自检环境 -> 收集参数 -> 生成 watchdog.config.json
  require('../lib/install.js').run().catch((err) => {
    console.error('❌ 安装向导执行失败:', err.message);
    process.exit(1);
  });

} else if (command === 'gateway') {
  const saved = savedConfig && savedConfig.gateway ? savedConfig.gateway : {};
  const port = params.port || String(saved.port || '8080');
  const user = params.user || saved.user || 'hunkwu';
  
  process.env.PORT = port;
  process.env.CODEX_USER = user;
  
  // Require the gateway module
  console.log(`[CLI] Launching Watchdog Gateway...`);
  require('../lib/gateway.js');

} else if (command === 'tunnel') {
  const saved = savedConfig && savedConfig.tunnel ? savedConfig.tunnel : {};
  const type = params.type || saved.type || 'ngrok';
  const localPort = params.port || String(saved.port || '5432');

  if (type === 'ngrok') {
    console.log(`[CLI] Launching Ngrok tunnel for local port ${localPort}...`);
    const ngrok = spawn('ngrok', ['tcp', localPort], { stdio: 'inherit' });
    ngrok.on('error', (err) => {
      console.error('❌ Failed to launch ngrok. Make sure ngrok CLI is installed:');
      console.error(err.message);
    });
  } else if (type === 'ssh') {
    const vps = params.vps || saved.vps;
    const vpsPort = params.vpsPort || String(saved.vpsPort || '54320');
    if (!vps) {
      console.error('❌ Error: --vps <user@host> is required for SSH tunneling.');
      process.exit(1);
    }
    console.log(`[CLI] Launching SSH reverse tunnel (local ${localPort} -> VPS ${vps}:${vpsPort})...`);
    const ssh = spawn('ssh', ['-R', `${vpsPort}:localhost:${localPort}`, vps, '-N'], { stdio: 'inherit' });
    ssh.on('error', (err) => {
      console.error('❌ Failed to run ssh:', err.message);
    });
  } else {
    console.error(`❌ Error: Unknown tunnel type "${type}". Use "ngrok" or "ssh".`);
    process.exit(1);
  }
} else {
  console.error(`❌ Error: Unknown command "${command}".`);
  printHelp();
  process.exit(1);
}
