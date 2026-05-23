[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.01) ](./ch01_mindset.md) | [ ➡️ Next (Ch.03) ](./ch03_sandbox.md) | [ 🌐 中文版 ](../chapters/ch02_setup.md)

# Ch.02 Cross-Device Control: Building Your Codex Multi-Surface Productivity Matrix

To do a good job, one must first sharpen one's tools. In "Real-World Product Talk", I often emphasize a core principle: **The first step of AI-Native development is configuring your "cockpit" to be sufficiently stable.** Many beginners rush into prompting or writing code with AI, only to end up with AI screaming errors in the terminal and wasting tokens because of local environment mismatches or incorrect permission settings.

This chapter will guide you step-by-step through configuring Codex's multi-device productivity matrix, including the CLI client, the Desktop App, and the mobile link with ChatGPT.

---

## 2.1 Installing and Configuring the CLI (Rust Core)

The core of the Codex CLI is written in Rust, offering extremely high execution efficiency. On macOS/Linux, follow these steps to initialize it:

### 1. Basic Environment Check and Installation
Ensure your system has the Rust build toolchain installed. Run in the terminal:

```bash
# Check if the Rust compiler is available
rustc --version

# Install/update the Codex CLI via the official script
curl -fsSL https://codex-agent.download/install.sh | sh
```

### 2. Injecting API Keys and Setting Up Billing Guardrails
A runaway AI could drain your wallet in a matter of hours. We need to set up dual billing hard caps (both local and cloud) while injecting the key into the environment variables.

Add the following to your `~/.zshrc` or `~/.bashrc`:

```bash
# Inject the OpenAI API key
export OPENAI_API_KEY="sk-proj-xxxxxx..."

# Set the maximum budget per Codex task (in USD)
export CODEX_MAX_BUDGET_PER_TASK=2.0

# Limit the maximum requests per minute (RPM) to avoid Rate Limit penalties
export CODEX_MAX_RPM=50
```

> 💡 **Founder's Pro-Tip**: It is highly recommended to set a monthly hard cap (e.g., $50) for this API key in your OpenAI developer dashboard. Even if the AI falls into an infinite loop, this ensures your funds remain absolutely safe.

---

## 2.2 Desktop App & Computer Use Permissions

To allow Codex to autonomously operate your screen for visual auditing and verification, you need to install Codex Desktop and grant it low-level system permissions.

### 1. Installation and Permission Request
Launch the Desktop App after installation, and the system will prompt you for authorization. You must enable the following three permissions under **macOS "System Settings" -> "Privacy & Security"**:
*   **Accessibility**: Allows Codex to simulate mouse clicks and keyboard inputs.
*   **Screen Recording**: Allows Codex to capture screen images for the Vision model to analyze layouts.
*   **Full Disk Access / Automation**: Allows Codex to send operation streams to your local IDE and terminal.

```text
[macOS System Settings] -> [Privacy & Security]
  ├─ Accessibility ──────────────────> Check [Codex Desktop] (Enable mouse/keyboard simulation)
  ├─ Screen Recording ───────────────> Check [Codex Desktop] (Allow Vision analysis)
  └─ Full Disk Access ───────────────> Check [Codex Desktop] (Allow file syncing)
```

---

## 2.3 Mobile Sentinel Integration (ChatGPT App)

When you are out of the office, you can leverage Pusher or free third-party webhook forwarding services (such as Keepa/Make) to push Codex's status alerts to your mobile phone.

### 1. Local Configuration File (`.codex/config.json`)
Create `.codex/config.json` in your home directory or project root to configure your mobile push gateway:

```json
{
  "telemetry": {
    "enabled": true,
    "webhook_url": "https://api.pmer.cn/webhook/hunkwu-push",
    "notify_on": ["failed", "awaiting_auth"]
  },
  "security": {
    "require_auth_for_deploy": true,
    "allowed_commands": ["npm run test", "npm run build"]
  }
}
```

### 2. One-Tap Mobile Authorization
When you are enjoying a cup of coffee at a café, and the local Codex runs up to a deployment step, your mobile ChatGPT App or custom webhook will receive a push card. You only need to reply `1` in your WeChat or Slack group, and the relay gateway will write a signal back to the local Codex process (as described in Ch.08) to proceed with the release.

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.01) ](./ch01_mindset.md) | [ ➡️ Next (Ch.03) ](./ch03_sandbox.md) | [ 🌐 中文版 ](../chapters/ch02_setup.md)
