[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.07) ](./ch07_desktop_computer_use.md) | [ ➡️ 下一章 (Ch.09) ](./ch09_legacy_code.md) | [ 🌐 English ](../en/ch08_mobile_workflow.md)

# Ch.08 移动看护工作流：全天候离线编排实战

独立开发者与产品经理的核心追求除了高效率，还有工作的自由度。盯在电脑前查看智能体编译滚动日志的方式并不高效。

本章我们将搭建一套 **移动看护工作流**：当本地或云端服务器上的 Codex 进行自动化重构时，一旦遭遇编译失败或触发高危部署授权，微信、飞书或 Telegram 即可实时接收通知卡片，支持直接通过手机进行远程审批或干预。



> ⚠️ **重要说明**：Codex 本身**没有内置“任务失败时自动推送到飞书/微信”的字段**。本章展示的是利用 **GitHub Actions + Webhook 网关 + 机器人** 自行拼装的方案——所有官方零件都是真实可用的，但中转网关需要你自己部署。

> 顺带一提：如果你用 ChatGPT 账号登录 Codex，你的云端 Codex 任务会**自动同步到手机 ChatGPT App**，这是 OpenAI 官方提供的能力，可作为本套自定义方案的简化平替。

---

## 8.1 移动看护链条的整体架构



我们通过以下管道将本地/云端的 Codex Agent 接入你的手机：

```Plain Text
[云端 Codex Agent] ──(Webhook)──> [中转网关 (你自部署的 Node 服务)] ──> [手机端微信/飞书]
       ▲                                                                   │
       └───────────────(手机打字回复 "Approve / Stop") ────────────────────┘
```

---

## 8.2 实战：GitHub Actions 失败推送与 Webhook 配置

当 Codex 在沙盒中运行构建或测试时，我们将构建日志通过 GitHub Actions 抓取，并触发通知。

### 1. GitHub Actions 自动化流水线配置 (`\.github/workflows/codex\-watchdog\.yml`)

在项目根目录下，我们编写如下工作流配置文件，当构建失败时，直接向手机推送包含 CoT 思考链关键节点的摘要：

```YAML
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
          # 使用 Codex exec 非交互模式跑验证任务
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

> 💡 在 CI 场景下使用 Codex 时，认证方式推荐用 API Key（通过 GitHub Secrets 注入 `OPENAI\\\_API\\\_KEY`）。ChatGPT 账号 OAuth 不适合无人值守的 CI 流程。

---

## 8.3 户外移动端双向交互与审批

接收到失败通知只是第一步。更高级的玩法是，直接在手机端对 Codex 进行远程指令干预。



### 1. 场景：生产环境部署审批

当 Codex 跑通了所有的测试，准备将代码合并进 `main` 分支并发布到 Vercel 时，它会暂停并向你的 飞书 或微信群发送卡片：

```Plain Text
🚨 [Codex Auth Requested]
Project: pmer-cn-saas
Action: Deploy to production (Vercel)
Change summary: Implemented Stripe subscription webhook in /api/stripe.
Tests: 12 passed, 0 failed.
[回执指令]: 回复 "1" 批准发布，回复 "0" 打断并回滚。
```

### 2. 实现交互的服务器端中转脚本 (Node.js 极简版)

假设在 `pmer\.cn` 的中转网关部署一个极简的接收端脚本，它会解析你手机端发出的微信或 飞书 命令，并通过远程控制端口（SSH / Codex Port）向下游的 Agent 实例发送信号：

```JavaScript
// File: gateway.js (部署在你的 VPS 上)
const express = require('express');
const { exec } = require('child_process');
const app = express();
app.use(express.json());

// 接收来自微信/飞书的回复通知
app.post('/api/mobile-reply', (req, res) => {
  const { userMessage, user } = req.body;
  
  // 仅允许主理人 hunkwu 远程控制
  if (user !== 'hunkwu') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (userMessage === '1') {
    // 写入信号文件，下游 Codex hooks 监听此文件以批准部署
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



通过将测试断言（Validation Specs）托付给 GitHub Actions，将异常通知托付给移动 Webhook，将最终签字权（Deploy Approval）掌握在手机端。你才能真正做到“人在喝咖啡，产品在自动进化”。

---

[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.07) ](./ch07_desktop_computer_use.md) | [ ➡️ 下一章 (Ch.09) ](./ch09_legacy_code.md) | [ 🌐 English ](../en/ch08_mobile_workflow.md)
