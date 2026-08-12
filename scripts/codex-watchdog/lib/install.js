// lib/install.js — 交互式安装向导（对应 Roadmap「Watchdog 交互式部署脚本」）
// 零依赖：仅使用 node:readline，向导完成后生成 watchdog.config.json 与启动命令。

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONFIG_FILE = 'watchdog.config.json';

function createInterface() {
  return readline.createInterface({ input: process.stdin, output: process.stdout });
}

// 行缓冲队列：保证管道（非 TTY）批量输入时不会丢行
function makeAsker(rl) {
  const lines = [];
  const waiters = [];
  rl.on('line', (line) => {
    if (waiters.length > 0) waiters.shift()(line);
    else lines.push(line);
  });
  return function ask(question, defaultVal) {
    const hint = defaultVal !== undefined ? ` [${defaultVal}]` : '';
    process.stdout.write(`${question}${hint}: `);
    const settle = (raw) =>
      raw.trim() === '' && defaultVal !== undefined ? String(defaultVal) : raw.trim();
    if (lines.length > 0) return Promise.resolve(settle(lines.shift()));
    return new Promise((resolve) => waiters.push((line) => resolve(settle(line))));
  };
}

function checkBinary(name) {
  try {
    const cmd = process.platform === 'win32' ? `where ${name}` : `command -v ${name}`;
    execSync(cmd, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function checkNodeVersion() {
  const major = parseInt(process.versions.node.split('.')[0], 10);
  return { ok: major >= 18, version: process.versions.node };
}

async function run() {
  const rl = createInterface();
  const ask = makeAsker(rl);
  console.log('\n🤖 Codex Watchdog 交互式安装向导');
  console.log('=============================================\n');

  // ── 第 0 步：环境自检 ─────────────────────────────
  console.log('🔍 [0/4] 环境自检...');
  const node = checkNodeVersion();
  console.log(`   Node.js ${node.version} ${node.ok ? '✅' : '❌ 需要 >= 18'}`);
  if (!node.ok) {
    console.error('\n❌ Node.js 版本过低，请先升级: https://nodejs.org');
    rl.close();
    process.exit(1);
  }
  const hasNgrok = checkBinary('ngrok');
  const hasSsh = checkBinary('ssh');
  console.log(`   ngrok CLI ${hasNgrok ? '✅ 已安装' : '⚠️  未安装（如选择 ngrok 穿透需先安装: brew install ngrok）'}`);
  console.log(`   ssh       ${hasSsh ? '✅ 可用' : '⚠️  不可用（SSH 反穿方案将不可用）'}`);

  // ── 第 1 步：用途选择 ─────────────────────────────
  console.log('\n🎯 [1/4] 选择你要启用的能力（对应蓝皮书章节）：');
  console.log('   1) gateway  —— 移动审批中转网关（Ch.08 手机审批高危操作）');
  console.log('   2) tunnel   —— 本地反向穿透隧道（Ch.03 打通云端沙盒与本地数据库）');
  console.log('   3) both     —— 两者都要');
  const purpose = await ask('请选择 (1/2/3)', '3');
  const enableGateway = purpose === '1' || purpose === '3';
  const enableTunnel = purpose === '2' || purpose === '3';

  const config = { gateway: null, tunnel: null };

  // ── 第 2 步：网关参数 ─────────────────────────────
  if (enableGateway) {
    console.log('\n📡 [2/4] 配置移动审批网关（Sentinel Gateway）：');
    const port = await ask('网关监听端口', '8080');
    const user = await ask('授权用户名（只有该用户的审批指令会被执行）', 'admin');
    config.gateway = { port: parseInt(port, 10), user };
  } else {
    console.log('\n📡 [2/4] 已跳过网关配置。');
  }

  // ── 第 3 步：隧道参数 ─────────────────────────────
  if (enableTunnel) {
    console.log('\n🚇 [3/4] 配置反向穿透隧道（Reverse Tunnel）：');
    const type = await ask(`穿透方案 (ngrok/ssh)${!hasNgrok ? '（注意：ngrok 未安装）' : ''}`, hasNgrok ? 'ngrok' : 'ssh');
    const port = await ask('要穿透的本地端口（PostgreSQL=5432, MySQL=3306, Web=3000）', '5432');
    config.tunnel = { type, port: parseInt(port, 10) };
    if (type === 'ssh') {
      const vps = await ask('公网 VPS 地址（user@host 格式）');
      if (!vps || !vps.includes('@')) {
        console.error('❌ VPS 地址格式无效（应为 user@host），向导中止。');
        rl.close();
        process.exit(1);
      }
      const vpsPort = await ask('VPS 上暴露的端口', '54320');
      config.tunnel.vps = vps;
      config.tunnel.vpsPort = parseInt(vpsPort, 10);
    }
  } else {
    console.log('\n🚇 [3/4] 已跳过隧道配置。');
  }

  // ── 第 4 步：落盘与指引 ───────────────────────────
  console.log('\n💾 [4/4] 写入配置并生成启动指引...');
  const outPath = path.resolve(process.cwd(), CONFIG_FILE);
  fs.writeFileSync(outPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
  console.log(`   ✅ 配置已保存: ${outPath}`);

  console.log('\n🎉 安装向导完成！你可以用以下命令启动：\n');
  if (config.gateway) {
    console.log('   # 启动移动审批网关');
    console.log(`   codex-watchdog gateway --port ${config.gateway.port} --user ${config.gateway.user}\n`);
  }
  if (config.tunnel) {
    console.log('   # 启动反向穿透隧道');
    const t = config.tunnel;
    const sshExtra = t.type === 'ssh' ? ` --vps ${t.vps} --vps-port ${t.vpsPort}` : '';
    console.log(`   codex-watchdog tunnel --type ${t.type} --port ${t.port}${sshExtra}\n`);
  }
  console.log('🔒 安全提醒：公网部署网关时，请用 Cloudflare/Nginx 前置 HTTPS 与鉴权；');
  console.log(`   ${CONFIG_FILE} 可能含敏感信息，请勿提交进公共仓库。`);

  rl.close();
}

module.exports = { run };
