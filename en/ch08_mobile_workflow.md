[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.07) ](./ch07_desktop_computer_use.md) | [ ➡️ Next (Ch.09) ](./ch09_legacy_code.md) | [ 🌐 中文版 ](../chapters/ch08_mobile_workflow.md)

# Ch.08 Mobile Sentinel Workflows: 24/7 Remote Development and Orchestration

As an independent founder and product manager, your primary pursuit besides "high efficiency" is "freedom." Sitting in front of a computer screen watching rolling compile logs is far from efficient.

In this chapter, we will build a **Mobile Sentinel Workflow**: when Codex runs automated refactoring on your local or cloud server, if a compile fails or a high-risk production deployment authorization is triggered, your WeChat, Feishu, or Telegram will instantly receive notification cards, allowing you to approve or intervene remotely from your phone.

> ⚠️ **Important Note**: Codex itself **does not have a built-in field for "auto-pushing to Feishu/WeChat on task failure"**. The workflow demonstrated in this chapter is a custom setup composed of **GitHub Actions + Webhook Gateway + Bot**—all official components are real and operational, but you will need to deploy the relay gateway yourself.

> As a side note: If you log into Codex using your ChatGPT account, your cloud Codex tasks will **automatically sync to your ChatGPT mobile app**. This is an official capability provided by OpenAI, which can serve as a simplified alternative to this custom setup.

---

## 8.1 Architecture of the Mobile Sentinel Loop

We connect the local or cloud Codex agent to your phone through the following pipeline:

```text
[Cloud Codex Agent] ──(Webhook)──> [Relay Gateway (Your self-deployed Node service)] ──> [Mobile WeChat/Feishu]
       ▲                                                                                     │
       └───────────────(Type and reply "Approve / Stop" from phone) ─────────────────────────┘
```

---

## 8.2 Practice: Webhook Notification Setup on Build Failures

When Codex runs compile or test suites in a sandbox, we capture build logs via GitHub Actions and trigger alerts.

### 1. GitHub Actions Workflow Configuration (`.github/workflows/codex-watchdog.yml`)

Create the following workflow configuration in your project root. When a build fails, it posts a summary highlighting the critical failure nodes in the CoT reasoning chain directly to your phone:

```yaml
name: Codex Agent Watchdog

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  agent-build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Run Codex Validation (exec mode)
        id: run_agent
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          # Run Codex validation in non-interactive exec mode
          npm ci
          npm run test || echo "STATUS=failed" >> $GITHUB_ENV

      - name: Push Fail Notice to Mobile
        if: env.STATUS == 'failed'
        run: |
          curl -X POST -H "Content-Type: application/json" \
            -d '{
              "event": "build_failed",
              "repo": "${{ github.repository }}",
              "commit": "${{ github.sha }}",
              "message": "Codex sandbox testing failed. Attention required on phone."
            }' \
            ${{ secrets.MOBILE_WEBHOOK_URL }}
```

> 💡 **Tip**: When running Codex in CI scenarios, it is highly recommended to authenticate using an API Key (injected via GitHub Secrets as `OPENAI_API_KEY`). ChatGPT account OAuth is not suitable for unattended CI pipelines.

---

## 8.3 Mobile Bidirectional Interaction and Approval

Receiving failure warnings is only the first step. The advanced usage is sending remote control commands to Codex directly from your phone.

### 1. Scenario: Production Deployment Approval Gate

When Codex passes all test suites and is ready to merge code into `main` and deploy to Vercel, it pauses and posts an approval card to your Feishu or WeChat group:

```text
🚨 [Codex Auth Requested]
Project: pmer-cn-saas
Action: Deploy to production (Vercel)
Change summary: Implemented Stripe subscription webhook in /api/stripe.
Tests: 12 passed, 0 failed.
[Directive Command]: Reply "1" to approve deployment, "0" to abort and roll back.
```

### 2. Server-Side Relay Script for Interaction (Node.js Minimal Version)

We deploy a minimalist gateway server script on the server behind `pmer.cn` to parse incoming messaging webhook payloads (from WeChat or Feishu) and communicate with the downstream agent instance via a control file or port:

```javascript
// File: gateway.js (Deployed on your VPS)
const express = require('express');
const { exec } = require('child_process');
const app = express();
app.use(express.json());

// Receive reply notifications from WeChat/Feishu
app.post('/api/mobile-reply', (req, res) => {
  const { userMessage, user } = req.body;
  
  // Only allow owner hunkwu for remote control
  if (user !== 'hunkwu') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (userMessage === '1') {
    // Write approval signal to file, which is watched by downstream Codex hooks
    exec('echo "approved" > /tmp/codex_deploy_signal', (err) => {
      if (err) return res.status(500).send('Error triggering deploy');
      res.json({ reply: '🚀 Deployment approved, production environment is going live!' });
    });
  } else if (userMessage === '0') {
    // Force kill Codex process and roll back code
    exec('pkill -f codex && git checkout -- .', (err) => {
      res.json({ reply: '🛑 Deployment aborted, code safely rolled back to HEAD!' });
    });
  } else {
    res.json({ reply: '⚠️ Invalid instruction. Reply 1 (approve) or 0 (abort).' });
  }
});

app.listen(8080, () => console.log('Mobile gateway listening on port 8080'));
```

---

## 8.4 Founder's Mantra: Reclaiming Your Freedom

Many tech practitioners using AI tools end up behaving like "manual testing monkeys" and "human git commit triggers." AI edits code, the human refreshes the tab; AI returns an error, the human copies the trace and pastes it back to the chat.

**The essence of the mobile watchtower workflow is detaching humans from constant, immediate waiting.**

By delegating validation assertions to GitHub Actions, forwarding exceptions via mobile webhooks, and holding the deployment approval key on your mobile device, you can achieve the dream: **"enjoying your coffee while the product automatically evolves."**

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.07) ](./ch07_desktop_computer_use.md) | [ ➡️ Next (Ch.09) ](./ch09_legacy_code.md) | [ 🌐 中文版 ](../chapters/ch08_mobile_workflow.md)
