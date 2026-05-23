# 📡 Codex Watchdog CLI Tool

`codex-watchdog` 是一个伴随《Codex 蓝皮书》电子书配套的极简命令行工具包，旨在帮助独立开发者快速打通本地开发宿主机与云端沙盒的网络穿透（Ch.03）和户外移动看护网关（Ch.08）。

---

## 📦 安装 (Installation)

由于目前该工具包处于项目内部，您可以在本地克隆本仓库后，直接通过 `npm link` 进行全局注册使用：

```bash
# 进入工具目录
cd scripts/codex-watchdog

# 本地链接为全局命令
npm link
```

---

## 🧭 指令说明 (Usage)

安装完成后，您可以在系统任意终端运行 `codex-watchdog` 触发以下子指令：

### 1. 启动移动审批中转网关 (Sentinel Webhook Gateway)
用于接收手机 ChatGPT App 或第三方 Webhook（如 Keepa/Make）转发来的控制卡片回复，控制 Codex 部署或中止：

```bash
# 启动网关，指定端口为 8080，授权用户为 hunkwu
codex-watchdog gateway --port 8080 --user hunkwu
```

### 2. 建立本地反向穿透隧道 (Reverse Tunneling Helper)
用于打通云端 Sandbox 与本地数据库（如 PostgreSQL）或微服务的链接通道：

#### 方案 A：使用 Ngrok 零配置穿透
```bash
# 穿透本地 5432 数据库端口
codex-watchdog tunnel --type ngrok --port 5432
```

#### 方案 B：使用 SSH 反向端口转发 (需要公网 VPS 中转)
```bash
# 将本地 5432 端口转发至公网机器上的 54320 端口
codex-watchdog tunnel --type ssh --port 5432 --vps user@your-public-vps.com --vps-port 54320
```

---

## 🔒 安全建议
* 强烈建议在公网使用代理工具（如 Cloudflare / Nginx）为 `gateway` 服务配上 HTTPS 证书与强鉴权逻辑。
* 严禁将含有敏感中转 Token 或账户秘钥的命令或配置文件上传到公共版本控制系统。
