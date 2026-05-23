[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.07) ](./ch07_desktop_computer_use.md) | [ ➡️ 下一章 (Ch.09) ](./ch09_legacy_code.md) | [ 🌐 English ](../en/ch08_mobile_workflow.md)

# Ch.08 移动看护工作流：全天候离线编排实战

作为独立创始人和产品经理，你的核心追求除了“高效率”外，还有“自由度”。你肯定不希望整天被拴在电脑前，盯着终端控制台看 AI 滚屏编译。

在多端协同的 OpenAI Codex 生态下，我们可以搭建一套**“移动看护工作流”**：
人在地铁上或咖啡馆，本地或云端服务器上的 Codex 正在跑自动化重构；一旦编译失败、或者需要高危部署授权时，你的微信、Slack 或 Telegram 就会瞬间收到通知，你可以直接用手机发送文字进行审批或纠错。

本章教你如何把手机变成远程控制 Codex 研发军团的“方向盘”。

---

## 8.1 移动看护链条的整体架构

我们通过以下管道将本地/云端的 Codex Agent 接入你的手机：

```text
[云端 Codex Agent] ──(Webhook)──> [通知网关 (如 Pusher/Slack API)] ──> [手机端微信/Slack]
       ▲                                                                   │
       └───────────────(手机打字回复 "Approve / Stop") ────────────────────┘
```

---

## 8.2 实战：GitHub Actions 失败推送与 Webhook 配置

当 Codex 在沙盒中运行构建或测试时，我们将构建日志通过 GitHub Actions 抓取，并触发通知。

### 1. GitHub Actions 自动化流水线配置 (`.github/workflows/codex-watchdog.yml`)

在项目根目录下，我们编写如下工作流配置文件，当构建失败时，直接向手机推送包含 CoT 思考链关键节点的摘要：

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
          # 模拟运行 Codex 的验证任务
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

## 8.3 户外移动端双向交互与审批

接收到失败通知只是第一步。更高级的玩法是，直接在手机端对 Codex 进行远程指令干预。

### 1. 场景：生产环境部署审批
当 Codex 跑通了所有的测试，准备将代码合并进 `main` 分支并发布到 Vercel 时，它会暂停并向你的 Slack 或微信群发送卡片：

```text
🚨 [Codex Auth Requested]
Project: pmer-cn-saas
Action: Deploy to production (Vercel)
Change summary: Implemented Stripe subscription webhook in /api/stripe.
Tests: 12 passed, 0 failed.
[回执指令]: 回复 "1" 批准发布，回复 "0" 打断并回滚。
```

### 2. 实现交互的服务器端中转脚本 (Node.js 极简版)
我们在 `pmer.cn` 的中转网关部署一个极简的接收端脚本，它会解析你手机端发出的微信或 Slack 命令，并通过远程控制端口（SSH / Codex Port）向下游的 Agent 实例发送信号：

```javascript
// File: /Users/hunkwu/Desktop/ai/book/scratch/gateway.js
const express = require('express');
const { exec } = require('child_process');
const app = express();
app.use(express.json());

// 接收来自微信/Slack的回复通知
app.post('/api/mobile-reply', (req, res) => {
  const { userMessage, user } = req.body;
  
  // 仅允许主理人 hunkwu 远程控制
  if (user !== 'hunkwu') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (userMessage === '1') {
    // 发送信号给后台挂起的 Codex 进程，批准合并与发布
    exec('echo "approved" > /tmp/codex_deploy_signal', (err) => {
      if (err) return res.status(500).send('Error triggering deploy');
      res.json({ reply: '🚀 部署已批准，生产环境正在上线！' });
    });
  } else if (userMessage === '0') {
    // 强制终止 Codex 进程并回滚代码
    exec('pkill -f codex && git checkout -- .', (err) => {
      res.json({ reply: '🛑 部署已中止，代码已安全回滚至 HEAD！' });
    });
  } else {
    res.json({ reply: '⚠️ 无效指令，请回复 1 (批准) 或 0 (中止)' });
  }
});

app.listen(8080, () => console.log('Mobile gateway listening on port 8080'));
```

---

## 8.4 实战产品说心法：把自由留给自己

很多同行在用 AI 编程时，把自己活成了一个“人体测试机”和“Git 提交工具人”：AI 改完了，人去点刷新；AI 报错了，人复制报错发给 AI。

**移动看护工作流的本质，是把人从“即时等待”中抽离出来。**

通过将测试断言（Validation Specs）托付给 GitHub Actions，将异常通知托付给移动 Webhook，将最终签字权（Deploy Approval）掌握在手机端。你才能真正做到**“人在喝咖啡，产品在自动进化”**。

---

[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.07) ](./ch07_desktop_computer_use.md) | [ ➡️ 下一章 (Ch.09) ](./ch09_legacy_code.md) | [ 🌐 English ](../en/ch08_mobile_workflow.md)
