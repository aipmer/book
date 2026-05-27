[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.02) ](./ch02_setup.md) | [ ➡️ 下一章 (Ch.04) ](./ch04_goal_driven.md) | [ 🌐 English ](../en/ch03_sandbox.md)

# Ch.03 破局云端孤岛：沙盒调试与本地环境深度穿透

使用 Codex 运行数据库测试时，常见问题之一是智能体报错 `Connection refused to ``localhost:5432`，即便本地已通过 Docker 启动了 PostgreSQL 服务。



这就是 **沙盒隔离（Sandbox Isolation）** 带来的典型壁垒。为了系统的安全和环境的纯净，Codex 默认是在云端独立的虚拟化容器中执行代码的。这意味着，AI 眼中的 `localhost` 是它自己的虚拟隔离环境，而不是你的 Mac 电脑本身。



本章我们聊聊怎么破局，打通云端沙盒与你本地宿主机的网络通道。

---

## 3.1 沙盒网络壁垒：为什么 `localhost` 连不上？

如下图所示，默认状态下，沙盒与本地宿主机（Your Mac）是网络阻断的：

```Plain Text
+───────────────────────────+                  +───────────────────────────+
|     云端沙盒 (Sandbox)     |                  |    宿主机 (Local Mac)     |
| - App Code                |    (隔离屏障)    | - Docker container        |
| - localhost:5432 (空无一人) ───[ X ]─────────> | - PostgreSQL (port: 5432) |
+───────────────────────────+                  +───────────────────────────+
```



如果我们要让沙盒里的代码能正常读写本地的数据库，或者调通本地跑着的微服务，我们必须在“网络防火墙”上钻开一个孔，也就是进行**端口映射与反向隧道穿透 (Reverse Tunneling)**。

---

## 3.2 实战：使用 SSH / Ngrok 建立反向隧道

我们以最常见的场景为例：**让云端沙盒里的 Codex 连接本地宿主机 Docker 里的 PostgreSQL 数据库。**

### 方法一：使用 SSH 反向端口转发 (推荐)

如果你拥有一个公网中转服务器（VPS），你可以利用 SSH 自带的端口转发机制，将本地的数据库端口安全地挂载到云端。

在本地终端运行：

```Bash
# 将本地的 5432 (Postgres) 转发到公网中转机的 54320 端口
ssh -R 54320:localhost:5432 user@your-public-vps.com -N
```

接着，配置 Codex 沙盒中的环境变量，让其直接访问公网服务器的映射端口：

```Bash
export DATABASE_URL="postgresql://postgres:password@your-public-vps.com:54320/dev_db"
```

### 方法二：使用 Ngrok 穿透本地端口 (零配置极速方案)

如果你没有公网服务器，`ngrok` 是最快的方式。

在宿主机运行：

```Bash
# 启动 TCP 隧道映射本地 PostgreSQL 端口
ngrok tcp 5432
```

终端会输出如下穿透地址：

`Forwarding tcp://0\.tcp\.ngrok\.io:12345 \-\&gt; localhost:5432`



将该动态地址配置到你的 [AGENTS.md](./AGENTS.md) 或是 Codex Cloud 的环境变量中：

```Bash
export DATABASE_URL="postgresql://postgres:password@0.tcp.ngrok.io:12345/dev_db"
```

> 💡 **小提示**：ngrok 免费版每次重启地址会变；如果做长期开发，建议要么用付费的固定 TCP 端口，要么换 Cloudflare Tunnel / frp 等替代方案。

---

## 3.3 目录映射与环境变量同步

除了网络，文件和密钥也需要顺畅流转。

### 1. 密钥文件的安全同步规则

千万不要让 Codex 自动把 `\.env` 文件同步到公共云端。我们必须在本地的 `\.gitignore` 中加入 `\.env`，并在项目的 [AGENTS.md](./AGENTS.md) 中添加硬约束：

```Markdown
## 🛑 Hard Constraints
- Never sync or commit files matching *.env.
- Use `src/config.ts` as the unified wrapper to fetch environment configurations.
```

### 2. 沙盒临时缓存清理

为了避免沙盒缓存导致的“灵异 Bug”（比如旧的依赖包未清除），我们可以让 Codex 在每次启动测试前自动运行清理命令。在 [AGENTS.md](./AGENTS.md) 的开发指令中写入：

```Markdown
## 💻 Developer Commands
- **Clean Run**: `rm -rf node_modules/.cache && npm run test`
```



通过这一系列的配置，云端沙盒不再是与世隔绝的孤岛。它就像是你本地电脑的外延，能够流畅、安全地读取各种本地数据与服务，让 Vibe Coding 的丝滑度再上一个台阶。

---

[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.02) ](./ch02_setup.md) | [ ➡️ 下一章 (Ch.04) ](./ch04_goal_driven.md) | [ 🌐 English ](../en/ch03_sandbox.md)
