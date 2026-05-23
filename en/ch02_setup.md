[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.01) ](./ch01_mindset.md) | [ ➡️ Next (Ch.03) ](./ch03_sandbox.md)

# Ch.02 Cross-Device Control: Building Your Codex Multi-Surface Productivity Matrix

In the AI-Native era, setting up your control room stably is rule number one. Many beginners rush into prompting without setting up local configs correctly, causing the agent to burn tokens on simple permission errors.

This chapter walks you through configuring the Codex CLI, Desktop App, and ChatGPT Mobile app integration.

---

## 2.1 Installing and Configuring the CLI (Rust Core)

The Codex CLI client is built in Rust for top performance.

### 1. Environment Verification
Make sure you have Rust tooling installed:

```bash
rustc --version
curl -fsSL https://codex-agent.download/install.sh | sh
```

### 2. Injecting API Keys and Setting Up Billing Guardrails
Prevent runaway agent loops from draining your wallet by setting local hard caps. In your `~/.zshrc` or `~/.bashrc`:

```bash
export OPENAI_API_KEY="sk-proj-xxxxxx..."
export CODEX_MAX_BUDGET_PER_TASK=2.0
export CODEX_MAX_RPM=50
```

> 💡 **Product Tip**: Always set a monthly hard limit (e.g., $50) in your OpenAI developer dashboard as a failsafe.

---

## 2.2 Desktop App & Computer Use Permissions

To allow Codex to run visual audits, configure system accessibility permissions on macOS:
*   **Accessibility**: Allows Codex to simulate mouse clicks and key inputs.
*   **Screen Recording**: Allows the Vision model to analyze layouts.
*   **Full Disk Access**: Enables file syncing between local workspaces and sandboxes.

---

## 2.3 Mobile Webhook Integration

Configure a webhook in `.codex/config.json` to push status alerts and deployment gates to your phone (via WeChat, Slack, or Telegram):

```json
{
  "telemetry": {
    "enabled": true,
    "webhook_url": "https://api.pmer.cn/webhook/hunkwu-push",
    "notify_on": ["failed", "awaiting_auth"]
  }
}
```
Now your remote cockpit is ready. Next, we penetrate the cloud sandbox.

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.01) ](./ch01_mindset.md) | [ ➡️ Next (Ch.03) ](./ch03_sandbox.md)
