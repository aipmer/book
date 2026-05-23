[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.02) ](./ch02_setup.md) | [ ➡️ Next (Ch.04) ](./ch04_goal_driven.md)

# Ch.03 Breaking the Cloud Island: Sandbox Debugging and Deep Local Environment Tunneling

In the background of my WeChat public account "Real-World Product Talk", I often receive questions from readers:
"Hunk, why does Codex always throw `Connection refused to localhost:5432` when I ask it to run database tests? I clearly have PostgreSQL running in Docker on my local machine!"

This is a classic barrier brought by **Sandbox Isolation**. To guarantee system security and clean runtimes, Codex executes code inside an isolated, virtualized container in the cloud by default. This means `localhost` to the AI refers to its own virtualized environment, not your host Mac machine.

In this chapter, we will discuss how to break this barrier and establish a network channel between the cloud sandbox and your local host machine.

---

## 3.1 Sandbox Network Barriers: Why Can't `localhost` Connect?

By default, the cloud sandbox and your local host (Your Mac) are blocked from communicating over the network, as shown below:

```text
+───────────────────────────+                  +───────────────────────────+
|     Cloud Sandbox         |                  |    Local Machine (Mac)    |
| - App Code                |    (Isolated)    | - Docker container        |
| - localhost:5432 (Empty)  ───[ X ]─────────> | - PostgreSQL (port: 5432) |
+───────────────────────────+                  +───────────────────────────+
```

If we want the code running in the sandbox to read/write our local database or invoke local microservices, we must tunnel a path through this firewall by utilizing **port mapping and reverse tunneling**.

---

## 3.2 Practice: Setting Up Reverse Tunnels via SSH / Ngrok

Let's look at the most common scenario: **allowing Codex in the cloud sandbox to connect to the PostgreSQL database inside Docker on your local host.**

### Method 1: Using SSH Reverse Port Forwarding (Recommended)
If you own a public-facing virtual private server (VPS), you can use SSH's built-in port forwarding mechanism to securely mount your local port to the cloud.

Run in your local terminal:

```bash
# Forward local port 5432 (Postgres) to port 54320 on your public VPS
ssh -R 54320:localhost:5432 user@your-public-vps.com -N
```

Then configure the environment variable inside the Codex sandbox to directly target the mapped port of the public server:

```bash
export DATABASE_URL="postgresql://postgres:password@your-public-vps.com:54320/dev_db"
```

### Method 2: Using Ngrok for Port Tunneling (Zero-Config Option)
If you don't have a public VPS, `ngrok` is the fastest alternative.

Run on your host machine:

```bash
# Start a TCP tunnel mapping the local PostgreSQL port
ngrok tcp 5432
```

The terminal will output a tunnel address like:
`Forwarding tcp://0.tcp.ngrok.io:12345 -> localhost:5432`

Configure this dynamic address in your [AGENTS.md](../AGENTS.md) or temporary environment variables:

```bash
export DATABASE_URL="postgresql://postgres:password@0.tcp.ngrok.io:12345/dev_db"
```

---

## 3.3 Directory Mapping and Env Syncing

In addition to networking, files and credentials also need to flow smoothly and securely.

### 1. Security Sync Rules for Secrets
Never allow Codex to automatically sync `.env` files containing raw credentials to public cloud environments. We must add `.env` to our local `.gitignore` and enforce strict boundaries in [AGENTS.md](../AGENTS.md):

```markdown
## 🛑 Hard Constraints
- Never sync or commit files matching *.env.
- Use `src/config.ts` as the unified wrapper to fetch environment configurations.
```

### 2. Sandbox Cache Clearing
To avoid "phantom bugs" caused by cached sandbox state (such as obsolete dependencies), we can tell Codex to automatically run clean commands before each test suite run. Add this to the developer commands section in [AGENTS.md](../AGENTS.md):

```markdown
## 💻 Developer Commands
- **Clean Run**: `rm -rf node_modules/.cache && npm run test`
```

By applying these settings, the cloud sandbox is no longer an isolated island. It functions as a direct extension of your local computer, securely accessing local data and services, bringing the smoothness of Vibe Coding to the next level.

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.02) ](./ch02_setup.md) | [ ➡️ Next (Ch.04) ](./ch04_goal_driven.md)
