[ 🏠 Index ](/en/) | [ ⬅️ Prev (Ch.01) ](./ch01_mindset.md) | [ ➡️ Next (Ch.03) ](./ch03_sandbox.md) | [ 🌐 中文版 ](../chapters/ch02_setup.md)

# Ch.02 Cross-Device Control: Building Your Codex Multi-Surface Productivity Matrix

> 🎯 **The Real Problem**: Beginners rush to prompt AI while local Node dependencies, outdated clients, and OS permissions fail, causing endless terminal errors and burning tokens.  
> 💡 **Tangible Output & Takeaway**: 0.14x CLI quickstart, ChatGPT Desktop Code Mode & Computer Use permissions setup, and cross-device debugging checklist.  
> ⚡ **Viral Screenshot Quote**: *"First stabilize your cockpit before asking AI to code. Don't let local setup errors burn your precious token budget."*

To do a good job, one must first sharpen one's tools. In "Real-World Product Talk", I often emphasize a core principle: **The first step of AI-Native development is configuring your "cockpit" to be sufficiently stable.** Many beginners rush into prompting or writing code with AI, only to end up with AI screaming errors in the terminal and wasting tokens because of local environment mismatches or incorrect permission settings.

This chapter will guide you step-by-step through configuring Codex's multi-device productivity matrix, including the 0.14x CLI, the unified ChatGPT Desktop App (Code Mode), and 24/7 mobile monitoring.

---

## 🎯 Intuitive Metaphor: Your Three-Surface Mission Cockpit

Do not think of these surfaces as disconnected programs. Imagine commanding a space exploration ship:

```Plaintext
【Codex CLI】                ──> Main Engine Room: Mounted in your terminal, handling high-throughput batching, tests, and CI builds.
【ChatGPT Desktop Code Mode】──> Bridge Tactical Screen: Multi-repo diff reviews, Sites in-place preview, and visual audits.
【ChatGPT Mobile App】       ──> Commander's Pager: Monitoring build statuses away from your desk, approving actions via Guardian.
```

Each surface handles its specialized duty, freeing you from being chained to a keyboard.

---

## 🚀 Beginner Quickstart: 3 Steps to Launch

You do not need complex network tunneling on day one. Follow these 3 steps to run your first task in 5 minutes:

1. **Step 1: Install the CLI and Authenticate**  
   Ensure Node.js 20+ is installed, then run in your terminal:
   ```bash
   npm install -g @openai/codex@latest
   codex
   ```
   A browser window will open automatically. Sign in with your ChatGPT account to bind.
2. **Step 2: Create a Minimal Anti-Explosion Config**  
   Run the following snippet to create `~/.codex/config.toml`, binding the GPT-5.6 Terra primary model:
   ```bash
   mkdir -p ~/.codex
   cat << 'EOF' > ~/.codex/config.toml
   model = "gpt-5.6-terra"
   tool_output_token_limit = 12000
   model_auto_compact_token_limit = 64000

   # Optional: Switch to frontier flagship for complex architecture or visual audits
   # model = "gpt-6-astra"

   [profiles.guardian]
   model = "gpt-5.6-luna"
   EOF
   ```
3. **Step 3: Run Your First Safe Sandbox Task**  
   Navigate to your project directory and execute:
   ```bash
   codex exec --sandbox workspace-write "Inspect current code quality and suggest improvements"
   ```

---

## 2.1 CLI Client (0.14x Era) Setup & Best Practices

The core of Codex CLI is written in Rust (`codex-rs`), but OpenAI distributes it via npm. **As a user, you do NOT need a Rust compiler**, only Node.js 20+.

### 1. Installation & Environment Check

Run in your terminal:

```bash
# 1. Verify Node.js (20+ required)
node --version

# 2. Globally install latest stable CLI (0.147.0+)
npm install -g @openai/codex@latest

# Or use the official install script (macOS / Linux)
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

Windows users can install via PowerShell:

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"
```

Verify the installation:

```bash
codex --version
```

### 2. Authentication: ChatGPT Account vs. API Key

Codex CLI offers two authentication paths:

- **Option A (Recommended / Default)**: Run `codex` directly to log in via browser. **ChatGPT Plus ($20/mo), Pro, Team, Business, Edu, and Enterprise plans all include Codex quotas**, offering the highest ROI for solo developers.
- **Option B (Pay-as-you-go / CI)**: Use an OpenAI API Key for CI/CD pipelines or headless servers.

```bash
export OPENAI_API_KEY="sk-proj-xxxxxx..."
```

### 3. Billing Guardrails & Overrun Protection

1. **OpenAI Platform Hard Limit (Crucial)**: Set a monthly Usage Limit (e.g., $50 for beginners) in your OpenAI dashboard. Even in an infinite loop, your budget is safeguarded.
2. **Token Controls in `config.toml`**: Restrict output sizes and compaction thresholds as configured above.
3. **Sandbox & Guardian Approval**: Deprecate `--full-auto`, and use `--sandbox workspace-write` along with `--approve-for-me` (delegated to GPT-5.6 Luna).

### 4. Seamless Multi-Provider Switching: Overcoming Rate Limits & Quota Caps (Recommended Tool: Codex Switch)

During intensive coding sessions, solo developers frequently encounter OpenAI 3-hour usage caps or API rate-limit errors. Manually editing configurations breaks your development flow, and worse, **often causes you to lose the active multi-turn conversation context**.

To solve this dilemma, we recommend the companion open-source utility **[Codex Switch](https://github.com/aipmer/codex-switch)** (created by the author of this book):

*   **One-Click Multi-Provider Switching**: Effortlessly toggle between official OpenAI, DeepSeek, and Kimi Code within seconds on macOS, bypassing single-provider rate limits.
*   **Seamless Cross-Provider Session Resume**: Solves provider message schema discrepancies, local cryptographic validation, and `thread_history.sqlite` byte-offset alignments. You can **continue existing conversations across different providers** without explaining your context from scratch.
*   **Quickstart**:
    ```bash
    # Clone and install Codex Switch
    git clone https://github.com/aipmer/codex-switch.git
    cd codex-switch && ./install.sh

    # Switch active provider to DeepSeek in 1 second
    codex-switch --to deepseek

    # Check current provider status
    codex-switch --status
    ```

---

## 2.2 Desktop Surface: ChatGPT Desktop App (Codex Code Mode)

> ⚠️ **Major Ecosystem Milestone**: In late 2026, the standalone Codex Desktop App was officially retired and merged directly into the **ChatGPT Desktop App**.

### 1. Installation & Accessing Code Mode

```bash
# macOS: Download ChatGPT.dmg and move to Applications
# Windows: Install via winget
winget install OpenAI.ChatGPT
```

Log in and click the **Codex** tab in the left sidebar to enter "Codex Code Mode".

**New Productivity Capabilities:**
- **Sites Hosting**: In-place web project creation, deployment, and preview with Annotations for point-and-click editing.
- **Multi-repo Review**: Inspect diffs across multiple folders in a single unified view.
- **Enhanced Browser**: Search browsing history directly and reference active Chrome tabs.

### 2. Computer Use Permissions (macOS)

To allow the agent to visually inspect your screen, grant two permissions under macOS "System Settings -> Privacy & Security":

```Plaintext
[macOS System Settings] -> [Privacy & Security]
  ├─ Accessibility  ────> Check [ChatGPT] (Allows simulating clicks/keystrokes)
  └─ Screen Recording ──> Check [ChatGPT] (Allows screenshot capture & Vision analysis)
```

**Security Boundaries**:
- You must explicitly approve each third-party application on first launch.
- ChatGPT cannot interact with Terminal itself, its own window, or `sudo` credential dialogs.

---

## 2.3 Mobile Sentinel: 24/7 Remote Oversight

1. **Native Task Syncing**: Signing into Codex with your ChatGPT account automatically mirrors running tasks to the ChatGPT Mobile App.
2. **Guardian Approvals & Alerts**: With Ch.08's mobile gateway, critical deployment gates trigger rich cards in Feishu or WeChat, enabling one-tap mobile approvals.

---

## 🛡️ Troubleshooting & Pitfall Cheat Sheet

| Symptom | Root Cause | Instant Fix |
| :--- | :--- | :--- |
| `error: unknown option '--full-auto'` | Deprecated in CLI 0.14x | Replace with the new sandbox flag: `--sandbox workspace-write` |
| `SyntaxError: Unexpected token ...` (Node error) | Node.js version is older than 20 | Run `node -v`; upgrade using `nvm use 20` or `nvm install 20` |
| `Permission denied: Screen Recording` | Missing macOS screen permissions | Toggle ChatGPT under "System Settings -> Privacy & Security -> Screen Recording" and restart |
| `Model not found: gpt-5.4` | Older models retired | Update `~/.codex/config.toml` to specify `model = "gpt-5.6-terra"` |

---

[ 🏠 Index ](/en/) | [ ⬅️ Prev (Ch.01) ](./ch01_mindset.md) | [ ➡️ Next (Ch.03) ](./ch03_sandbox.md) | [ 🌐 中文版 ](../chapters/ch02_setup.md)
