[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.07) ](./ch07_desktop_computer_use.md) | [ ➡️ Next (Ch.09) ](./ch09_legacy_code.md) | [ 🌐 中文版 ](../chapters/ch08_mobile_workflow.md)

# Ch.08 Mobile Sentinel Workflows: 24/7 Remote Development and Orchestration

As an independent founder and product manager, your primary pursuit besides "high efficiency" is "freedom." You certainly do not want to be chained to your desk all day long, watching terminal consoles scroll compile logs.

Under the multi-surface collaborative OpenAI Codex ecosystem, we can construct a **"mobile watchdog workflow"**:
While you are on the subway or at a café, Codex runs automated refactoring on your local or cloud server. The moment a build fails, or high-risk production deployment permissions are requested, your WeChat, Slack, or Telegram will instantly receive a notification card. You can reply with simple text commands from your phone to approve or guide the correction.

This chapter teaches you how to turn your mobile phone into the steering wheel for your remote Codex engineering army.

---

## 8.1 Architecture of the Mobile Watchdog Loop

We connect the local or cloud Codex agent to your phone through the following pipeline:

```text
[Cloud Codex Agent] ──(Webhook)──> [Notification Gateway (Pusher/Slack API)] ──> [Mobile WeChat/Slack]
       ▲                                                                               │
       └───────────────(Reply "1" for Approve / "0" for Abort from phone) ─────────────┘
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

      - name: Run Codex Sandbox Compile & Test
        id: run_agent
        run: |
          # Simulate running Codex validation task
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

---

## 8.3 Mobile Bidirectional Interaction and Approval

Receiving failure warnings is only the first step. The advanced usage is sending remote control commands to Codex directly from your phone.

### 1. Scenario: Production Deployment Approval Gate
When Codex passes all test suites and is ready to merge code into `main` and deploy to Vercel, it pauses and posts a card to your Slack or WeChat group:

```text
🚨 [Codex Auth Requested]
Project: pmer-cn-saas
Action: Deploy to production (Vercel)
Change summary: Implemented Stripe subscription webhook in /api/stripe.
Tests: 12 passed, 0 failed.
[Directive Command]: Reply "1" to approve deployment, "0" to abort and roll back.
```

### 2. Node.js Gateway Script for Remote Execution

We deploy a minimalist gateway server script on the server behind `pmer.cn` to parse incoming messaging webhook payloads and communicate with the downstream agent instance:

```javascript
// File: /Users/hunkwu/Desktop/ai/book/scratch/gateway.js
const express = require('express');
const { exec } = require('child_process');
const app = express();
app.use(express.json());

// Receive reply notifications from WeChat/Slack
app.post('/api/mobile-reply', (req, res) => {
  const { userMessage, user } = req.body;
  
  // Only allow owner hunkwu for remote control
  if (user !== 'hunkwu') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (userMessage === '1') {
    // Send signal to the background suspended Codex process, approving merge and deploy
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
