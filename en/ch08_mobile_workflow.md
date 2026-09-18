[ 🏠 Index ](/en/) | [ ⬅️ Prev (Ch.07) ](./ch07_desktop_computer_use.md) | [ ➡️ Next (Ch.09) ](./ch09_legacy_code.md) | [ 🌐 中文版 ](../chapters/ch08_mobile_workflow.md)

# Ch.08 Mobile Sentinel Workflows: 24/7 Remote Development and Orchestration

> 🎯 **The Real Problem**: Engineers tied to desks watching terminal build logs; unattended CI failures or blocked deployments halting team momentum.  
> 💡 **Tangible Output & Takeaway**: Guardian auto-approval (`--approve-for-me`) & mobile gateway two-tier dispatch; Feishu webhook alert cards; one-tap mobile remote approval pipelines.  
> ⚡ **Viral Screenshot Quote**: *"Step away from your desk while tasks run. AI resolves routine risks automatically, while high-risk releases wait for a one-tap phone approval."*

For indie developers and product leaders, the core pursuit alongside extreme productivity is high-dimensional time freedom. Sitting in front of a terminal watching thousands of lines of rolling compile logs is not what Vibe Coding was meant to be.

In this chapter, we will build a **24/7 Mobile Sentinel Workflow**: combining **Guardian intelligent auto-approval** with a **mobile sentinel gateway** in 2026. Routine low-risk tasks proceed automatically, while high-risk production deployments push notification cards to your mobile Feishu or chat group, letting you review and approve anywhere, anytime with a single tap.

---

## 🎯 Intuitive Metaphor: Smart Patrol and Central Pager in a Modern Autonomous Farm

Think of offline orchestration as running a modern unmanned farm:

```Plaintext
[Manual Guarding]      ──> Sitting on a stool inside the greenhouse 24 hours a day,
                           staring at irrigation pipes wondering if one might leak (tedious and confining).
[Guardian + Gateway]   ──> The farm deploys an autonomous robotic watchdog (Guardian powered by GPT-5.6 Luna):
                           - Minor pipe leak? The robot tightens the valve and moves on (Guardian policy auto-pass);
                           - Main water gate switch or high-voltage grid changes? The robot halts,
                             instantly sending a high-res photo and confirmation card to the owner's phone;
                           - You tap "Approve" while sipping coffee on the train, and the farm resumes autonomous operation.
```

This dual mechanism—"digesting routine risks automatically while holding humans at core checkpoints"—is the ultimate form of a modern company of one.

---

## 🚀 Beginner Quickstart (3 Easy Steps)

Set up your mobile alert notification channel in 3 simple steps:

1. **Step 1: Create a Feishu / Slack / WeCom Custom Bot**  
   Add a bot in your group chat settings and copy its incoming Webhook URL.
2. **Step 2: Send a Test Alert Card from Terminal**  
   Run curl to verify your phone receives notifications:
   ```bash
   curl -X POST -H "Content-Type: application/json" \
     -d '{"msg_type":"text","content":{"text":"🔔 Codex Mobile Sentinel Online: Terminal task running safely!"}}' \
     https://open.feishu.cn/open-apis/bot/v2/hook/YOUR-WEBHOOK-TOKEN
   ```
3. **Step 3: Launch Your Offline Task with Guardian + Sandbox**  
   Before stepping away from your desk, run this command with peace of mind:
   ```bash
   codex exec --sandbox workspace-write --approve-for-me "Run full regression suite and refactor legacy types"
   ```

---

## 8.1 Two-Tier Sentinel Dispatch Architecture

In the 2026 architecture, your mobile phone is protected from notification bombardment:

```Plaintext
[Codex Long Task] ──> Triggers sensitive action (dependency changes / file writes / network calls)
                             │
                             ▼
                 [Tier 1: Guardian Policy Review] ──(Low Risk)──> Auto-approved to proceed
                             │ (High Risk / Production Deploy)
                             ▼
                 [Tier 2: Mobile Sentinel Gateway] ──> [Mobile Feishu/Slack Card] ──> [Reply 1 to Approve]
```

Companion open-source references:
- Blue Book Official Feishu Assistant: [plugins-codex-feishu](https://github.com/aipmer/plugins-codex-feishu.git)
- Minimal Local Tunnel Gateway: [scripts/codex-watchdog](../scripts/codex-watchdog/README.md)

---

## 8.2 Practice: GitHub Actions Build Failures and Webhook Setup

Create `.github/workflows/codex-watchdog.yml` in your project root. When a remote build fails, it summarizes the critical failure points and pushes an alert directly to your phone:

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

## 8.3 Mobile Bidirectional Interaction and Remote Approval

### 1. Scenario: Production Deployment Approval Gate

When Codex passes all tests and is ready to deploy code to Vercel, it pauses and sends an approval card to Feishu:

```Plaintext
🚨 [Codex Auth Requested]
Project: pmer-cn-saas
Action: Deploy to production (Vercel)
Change summary: Implemented Stripe subscription webhook in /api/stripe.
Tests: 12 passed, 0 failed.
[Directive Command]: Reply "1" to approve deployment, "0" to abort and roll back.
```

### 2. Server-Side Minimal Relay Script (Node.js)

The gateway parses incoming replies and communicates with Codex via signal files or sockets:

```javascript
// File: gateway.js
const express = require('express');
const { exec } = require('child_process');
const app = express();
app.use(express.json());

app.post('/api/mobile-reply', (req, res) => {
  const { userMessage, user } = req.body;
  if (user !== 'hunkwu') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (userMessage === '1') {
    exec('echo "approved" > /tmp/codex_deploy_signal', (err) => {
      if (err) return res.status(500).send('Error');
      res.json({ reply: '🚀 Deployment approved, production environment is going live!' });
    });
  } else if (userMessage === '0') {
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

## 8.4 Official Reference Implementation: Codex Feishu Sentinel

To eliminate the need for developers to manually build webhook gateways and polling logic, this book provides an out-of-the-box companion repository: **[plugins-codex-feishu (Feishu Assistant)](https://github.com/aipmer/plugins-codex-feishu)**.

It productizes this entire workflow into three primary capabilities:

1. **Daily Inspection & Sentinel Reports (Quick Start)**:
   - Automatically summarizes local Git commits and workspace status into rich notification cards sent directly to your personal Feishu chat.
   - Takes less than 3 minutes to verify with zero cognitive overhead.
2. **Mobile Alerts & Two-Way Approval (Offline Orchestration)**:
   - Vibrates your phone immediately whenever cloud/local Codex runs into testing failures or requests high-risk deployment authorization.
   - Reply directly on mobile to "Approve" or "Abort & Rollback".
3. **Knowledge Base Persistence (Team Collaboration)**:
   - Write project status into Feishu Docx documents and sync project metadata with Bitable multidimensional tables.

> 💡 **3-Minute Quick Setup**: The project provides `feishu_app_manifest.json`, allowing you to create the complete Feishu app with pre-configured scopes and websocket events via a single JSON import in the Feishu Open Platform.

---

## 🛡️ Troubleshooting & Pitfall Cheat Sheet

| Common Pitfall | Root Cause | Rapid Diagnosis & Fix Guide |
| :--- | :--- | :--- |
| **Phone does not receive Webhook messages** | Bot security settings require keyword or IP whitelist | In bot settings under "Security", add matching keyword (e.g., `Codex`) or configure request signature |
| **Replied "1" on phone but nothing happened locally** | Relay gateway lost tunnel connectivity or signal file is unmonitored | Run `node scripts/codex-watchdog` to verify tunnel connectivity and inspect signal file status |
| **Phone flooded with approval cards every minute** | Minor edits routed directly to mobile without filtering | Enable `--approve-for-me` to delegate non-destructive routine actions to Guardian |

---

## 8.5 Founder's Mantra: Reclaiming Your Freedom

Many tech practitioners using AI tools end up behaving like "manual testing monkeys" and "human git commit triggers." AI edits code, the human refreshes the tab; AI returns an error, the human copies the trace and pastes it back to the chat.

By delegating validation assertions to GitHub Actions, forwarding exceptions via mobile webhooks, and holding the deployment approval key on your mobile device, you can achieve the dream: **"enjoying your coffee while the product automatically evolves."**

---

[ 🏠 Index ](/en/) | [ ⬅️ Prev (Ch.07) ](./ch07_desktop_computer_use.md) | [ ➡️ Next (Ch.09) ](./ch09_legacy_code.md) | [ 🌐 中文版 ](../chapters/ch08_mobile_workflow.md)

