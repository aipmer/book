[ 🏠 主目录 ](/) | [ ⬅️ 上一章 (Ch.02) ](./ch02_setup.md) | [ ➡️ 下一章 (Ch.04) ](./ch04_goal_driven.md) | [ 🌐 English ](../en/ch03_sandbox.md)

# Ch.03 破局云端孤岛：沙盒调试与本地环境深度穿透

> 🎯 **具体工程麻烦**：AI 在隔离沙盒跑测试时连不上本地 Docker 的 PostgreSQL/Redis，报错 `Connection refused`，智能体抓瞎。  
> 💡 **可运行实战代码与落地收益**：提供基于 CLI 0.14x 沙盒级别解析、SSH / Ngrok 端口反向映射脚本与 3 步网络排错流程。  
> ⚡ **社交传播 / 截图金句**：“AI 报错连不上 localhost？不是代码写错了，是你没给隔离沙盒开网络通道。”

使用 Codex 运行数据库测试时，新手最常碰到的灵异报错是：明明本地 Docker 里的 PostgreSQL 跑得好好的，AI 却在终端狂喊 `Connection refused to localhost:5432`。

这就是 **沙盒隔离（Sandbox Isolation）** 带来的典型壁垒。本章教你如何穿透这层隔离屏障，打通沙盒与宿主机的安全通道。

---

## 🎯 生活化直觉隐喻：防爆隔离仓与专用生命导管

把 Codex 的执行环境想象成医院里的「高等级无菌防爆隔离仓」：

```Plaintext
【你的宿主机 Mac/PC】 ──> 外部大世界：装着你真实的本地数据库、私钥配置、个人微信和文件系统。
【Codex 运行沙盒】    ──> 无菌隔离仓：AI 所有的代码编译、文件生成都在这个密闭盒子里运行，就算把代码写崩了，也绝不会删掉你的系统文件。
【端口穿透与反向隧道】──> 密封手套与气体导管：当隔离仓里的 AI 需要连外界的本地数据库时，你必须主动在舱壁接一根“专用导管”（把端口转接到仓内）。
```

如果不接这根导管，AI 在隔离仓里自言自语喊 `localhost`，找到的只是空无一人的仓壁，自然就会报错 `Connection refused`。

---

## 🚀 新手极速上手 3 步走（无痛起步）

如果你需要让沙盒连上本地数据库，按以下 3 步建立通道：

1. **步骤一：确认本地服务端口正处于监听状态**  
   在终端确认 Docker 或本地服务正常运行（如 Postgres 在 5432 端口）：
   ```bash
   lsof -i :5432  # 查看端口是否有进程正在监听
   ```
2. **步骤二：启动极简端口穿透（使用 ngrok 或 SSH）**  
   运行一条命令为 5432 端口打通公网安全临时通道：
   ```bash
   ngrok tcp 5432
   # 获得转发地址，形如：tcp://0.tcp.ngrok.io:12345
   ```
3. **步骤三：将穿透连接串注入 Codex 沙盒执行任务**  
   在执行时将地址作为环境变量传入，让 AI 执行连接测试：
   ```bash
   export DATABASE_URL="postgresql://postgres:password@0.tcp.ngrok.io:12345/dev_db"
   codex exec --sandbox workspace-write "运行数据库连通性自测脚本 npm run test:db"
   ```

---

## 3.1 沙盒网络壁垒：为什么 `localhost` 连不上？

默认状态下，沙盒与本地宿主机处于安全网络阻断状态：

```Plain Text
+───────────────────────────+                  +───────────────────────────+
|     云端沙盒 (Sandbox)     |                  |    宿主机 (Local Mac)     |
| - App Code                |    (隔离屏障)    | - Docker container        |
| - localhost:5432 (空无一人) ───[ X ]─────────> | - PostgreSQL (port: 5432) |
+───────────────────────────+                  +───────────────────────────+
```

在 2026 年的 CLI 0.14x 中，Codex 强化了沙盒边界规范：
- `--sandbox read-only`：只读模式，智能体只分析代码，不具备写权限。
- `--sandbox workspace-write`（推荐常用）：智能体可以修改当前项目目录，但不可随意跨出目录或篡改全局系统。

要让沙盒内的代码读写宿主机上的数据库或微服务，必须进行**端口映射与反向隧道穿透 (Reverse Tunneling)**。

---

## 3.2 实战：使用 SSH / Ngrok 建立反向隧道

### 方法一：使用 SSH 反向端口转发（推荐长效方案）

如果你有公网 VPS 服务器，SSH 反向转发是最安全且免费的方案：

```bash
# 将本地的 5432 (Postgres) 转发到公网中转机的 54320 端口
ssh -R 54320:localhost:5432 user@your-public-vps.com -N
```

接着在环境中配置：

```bash
export DATABASE_URL="postgresql://postgres:password@your-public-vps.com:54320/dev_db"
```

### 方法二：使用 Ngrok 极速穿透（零服务器方案）

宿主机终端直接运行：

```bash
ngrok tcp 5432
```

终端输出类似：`Forwarding tcp://0.tcp.ngrok.io:12345 -> localhost:5432`。

将该临时地址写入环境变量或注入 Codex 会话即可。

---

## 3.3 目录映射与环境变量同步规范

### 1. 密钥安全硬隔离

严禁让 AI 自动把包含真实生产密钥的 `.env` 提交到仓库或云端。在 `.gitignore` 与项目 [AGENTS.md](../AGENTS.md) 中添加硬约束：

```markdown
## 🛑 Hard Constraints
- Never sync, copy, or commit files matching *.env.
- Always use `src/config.ts` or environment variables for secret injection.
```

### 2. 沙盒临时缓存清理

为防止 node_modules 缓存或 build 缓存导致的幽灵构建故障，在 [AGENTS.md](../AGENTS.md) 中写入标准化清理脚本：

```markdown
## 💻 Developer Commands
- **Clean Run**: `rm -rf node_modules/.cache .next/cache && npm run test`
```

---

## 🛡️ 翻车自救与避坑速查表

| 常见报错 / 翻车现象 | 致命原因 | 极速排查与自救指南 |
| :--- | :--- | :--- |
| `Connection refused to 127.0.0.1:5432` | 沙盒以为本地有数据库，实际隔离舱内空无一物 | 检查反向穿透隧道是否开启，严禁用 `localhost`，必须使用穿透地址 |
| `ngrok session expired / reconnecting` | 免费版 ngrok 隧道中断或地址重置 | 重启 ngrok 复制新地址，或改用项目自带的 `scripts/codex-watchdog` 反向穿透工具 |
| `EACCES: permission denied` | 沙盒权限受限，试图写入项目外的受保护系统目录 | 检查命令是否使用了正确的 `--sandbox workspace-write`，并约束操作在项目根目录内 |

---

[ 🏠 主目录 ](/) | [ ⬅️ 上一章 (Ch.02) ](./ch02_setup.md) | [ ➡️ 下一章 (Ch.04) ](./ch04_goal_driven.md) | [ 🌐 English ](../en/ch03_sandbox.md)
