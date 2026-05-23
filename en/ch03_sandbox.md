[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.02) ](./ch02_setup.md) | [ ➡️ Next (Ch.04) ](./ch04_goal_driven.md)

# Ch.03 Breaking the Cloud Island: Sandbox Debugging and Deep Local Environment Tunneling

One of the most common developer complaints is: *"Why does Codex keep saying 'Connection refused to localhost:5432' when I have PostgreSQL running in Docker?"*

This happens because Codex runs in an isolated cloud sandbox. `localhost` inside the sandbox refers to the container itself, not your local machine.

---

## 3.1 The Sandbox Barrier

```
+───────────────────────────+                  +───────────────────────────+
|     Cloud Sandbox         |                  |    Local Machine (Mac)    |
| - App Code                |    (Isolated)    | - Docker container        |
| - localhost:5432 (Empty)  ───[ X ]─────────> | - PostgreSQL (port: 5432) |
+───────────────────────────+                  +───────────────────────────+
```

To connect the cloud sandbox to your local database, we must build a reverse tunnel.

---

## 3.2 Setting Up Reverse Tunnels via SSH or Ngrok

### Method 1: SSH Port Forwarding (Recommended)
If you have a public VPS, run this locally:

```bash
ssh -R 54320:localhost:5432 user@your-public-vps.com -N
```
Then configure your database URL in the sandbox env to target the VPS port:
`DATABASE_URL="postgresql://postgres:password@your-public-vps.com:54320/dev_db"`

### Method 2: Ngrok (Fast Zero-Config Option)
Run locally:
```bash
ngrok tcp 5432
```
And bind the public TCP tunnel address provided by Ngrok to your sandbox configuration:
`DATABASE_URL="postgresql://postgres:password@0.tcp.ngrok.io:12345/dev_db"`

---

## 3.3 Directory and Environment Variable Isolation
Never sync `.env` files containing raw secrets to the sandbox. Keep them in `.gitignore` and add strict instructions to your [AGENTS.md](file:///Users/hunkwu/Desktop/ai/book/AGENTS.md):

```markdown
## 🛑 Hard Constraints
- Never sync or commit files matching *.env.
- Access configurations through src/config.ts.
```

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.02) ](./ch02_setup.md) | [ ➡️ Next (Ch.04) ](./ch04_goal_driven.md)
