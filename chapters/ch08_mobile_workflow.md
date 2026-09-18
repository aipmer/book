[ 🏠 主目录 ](/) | [ ⬅️ 上一章 (Ch.07) ](./ch07_desktop_computer_use.md) | [ ➡️ 下一章 (Ch.09) ](./ch09_legacy_code.md) | [ 🌐 English ](../en/ch08_mobile_workflow.md)

# Ch.08 移动看护工作流：全天候离线编排实战

> 🎯 **具体工程麻烦**：开发者被困在工位看滚动编译日志；离开工位后 CI 挂了或高危发布卡住，整个团队进度中断。  
> 💡 **可运行实战代码与落地收益**：Guardian 自动审批 (`--approve-for-me`) 与移动看护网关双层分流；飞书 Webhook 告警卡片；手机远程一键审批部署。  
> ⚡ **社交传播 / 截图金句**：“下班不盯屏幕，任务照常推进。常规风险 AI 自审，高危发布手机一键批复。”

独立开发者与产品经理的核心追求除了极致效能，还有高维的时间自由。整天死盯在终端前看几千行编译日志并不是 Vibe Coding 的初衷。

本章我们将搭建一套 **全天候移动看护工作流**：在 2026 年结合 **Guardian 智能自动审批** 与 **移动看护网关**，实现低风险操作 AI 自动放行、高危生产发布推送到手机飞书或微信群，人在户外随时随地一键批复。

---

## 🎯 生活化直觉隐喻：现代无人农场的智能巡视与中央呼机

把离线编排想象成经营一座现代无人农场：

```Plaintext
【传统低效盯梢】 ──> 你一天 24 小时搬个小板凳坐在大棚里，死盯着灌溉水管会不会漏水（枯燥且无法脱身）。
【Guardian + 移动网关】──> 农场引入了全自动机械犬（由 GPT-5.6 Luna 驱动的 Guardian）：
                          - 水管轻微漏水？机械犬自己拧紧阀门，顺畅放行（Guardian 策略自审）；
                          - 遇到总水闸开关切换或高压电网变更？机械犬不敢妄动，
                            立刻往农场主的手机飞书发送一张带高清照片的确认卡；
                          - 你在地铁上喝着咖啡，手机点个「确认」，农场继续自动化运作。
```

这种“低级风险自主消化，核心关卡人工兜底”的机制，才是现代一人公司的终极形态。

---

## 🚀 新手极速上手 3 步走（无痛起步）

用 3 步搭建你的移动告警通知通道：

1. **步骤一：创建一个飞书 / 企微自定义群机器人**  
   在群设置中添加机器人，复制其获得的 Webhook URL。
2. **步骤二：在终端发送一条测试告警卡片**  
   运行 curl 测试手机能否收到推送：
   ```bash
   curl -X POST -H "Content-Type: application/json" \
     -d '{"msg_type":"text","content":{"text":"🔔 Codex 移动看护上线：终端任务正在安全运行！"}}' \
     https://open.feishu.cn/open-apis/bot/v2/hook/YOUR-WEBHOOK-TOKEN
   ```
3. **步骤三：用 Guardian + 沙盒模式启动你的离线任务**  
   工位离席前，输入以下命令即可安心离开：
   ```bash
   codex exec --sandbox workspace-write --approve-for-me "执行全仓回归测试并重构陈旧类型定义"
   ```

---

## 8.1 双层看护分流架构

在 2026 年最新的架构中，移动端不再被琐碎的确认弹窗轰炸：

```Plain Text
[Codex 长时任务] ──> 触发敏感动作（改依赖/写文件/调网络）
                           │
                           ▼
                 [第一道：Guardian 自动策略评审] ──(低风险)──> 自动放行继续执行
                           │ (高危/生产部署)
                           ▼
                 [第二道：移动看护网关] ──> [手机飞书/企微推送卡片] ──> [手机回复 1 放行]
```

配套参考开源工程：
- 蓝皮书官方飞书助理：[plugins-codex-feishu](https://github.com/aipmer/plugins-codex-feishu.git)
- 本机极简穿透网关：[scripts/codex-watchdog](../scripts/codex-watchdog/README.md)

---

## 8.2 实战：GitHub Actions 失败推送与 Webhook 配置

在项目根目录下编写 `.github/workflows/codex-watchdog.yml`，当远程构建失败时，精准提炼失败摘要推送到手机：

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

## 8.3 户外移动端双向交互与审批

### 1. 场景：生产环境部署审批

当 Codex 跑通所有测试，准备将代码发布到 Vercel 时，它会暂停并向飞书群发送审批卡片：

```Plaintext
🚨 [Codex Auth Requested]
Project: pmer-cn-saas
Action: Deploy to production (Vercel)
Change summary: Implemented Stripe subscription webhook in /api/stripe.
Tests: 12 passed, 0 failed.
[回执指令]: 回复 "1" 批准发布，回复 "0" 打断并回滚。
```

### 2. 服务器端极简中转脚本 (Node.js)

网关服务解析手机回复，并通过信号文件或 socket 联动 Codex：

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
      res.json({ reply: '🚀 部署已批准，生产环境正在上线！' });
    });
  } else if (userMessage === '0') {
    exec('pkill -f codex && git checkout -- .', (err) => {
      res.json({ reply: '🛑 部署已中止，代码已安全回滚！' });
    });
  } else {
    res.json({ reply: '⚠️ 无效指令，请回复 1 (批准) 或 0 (中止)' });
  }
});

app.listen(8080, () => console.log('Mobile gateway listening on port 8080'));
```

---

## 8.4 官方参考实现：飞书助理 (Codex Feishu Sentinel)

为了避免开发者重复手写 Webhook 网关与长连接轮询逻辑，本项目配套开源了开箱即用的官方参考工程：**[plugins-codex-feishu（飞书助理）](https://github.com/aipmer/plugins-codex-feishu)**。

它将上述架构全面产品化，具备三大核心形态：

1. **日常巡检与值班日报（极速上手）**：
   - 自动聚合本地 Git 提交与工作区动态，生成图文并茂的进展日报，免去每天下班写进展报告的痛点。
   - 默认通过飞书 Bot 仅推送到开发者个人私聊，3 分钟即可完成从零到一的验证。
2. **移动端警报与双向审批（离线编排）**：
   - 当云端/本地 Codex 执行自动化测试遇挫、或遇到需要人工授权的高危部署时，飞书第一时间震动弹窗通知卡片。
   - 手机端直接点击或打字回复指令，即可远程触发「批准发布」或「一键回滚中断」。
3. **沉淀与进阶知识库（团队协同）**：
   - 支持将结构化项目报告写回飞书 Docx 云文档、同步至 Bitable 多维表格，实现代码进展向团队业务知识库的无缝沉淀。

> 💡 **3 分钟极速配置**：该工程内置了飞书官方应用清单 `feishu_app_manifest.json`，在飞书开放平台直接点击「导入应用清单」即可自动开通所有必要权限与长连接，免去繁琐的手工勾选。

---

## 🛡️ 翻车自救与避坑速查表

| 常见踩坑现象 | 致命原因 | 极速排查与自救指南 |
| :--- | :--- | :--- |
| **手机接收不到 Webhook 消息** | 机器人安全设置中未配置自定义关键词或 IP 白名单 | 检查飞书机器人设置中的“安全设置”，设置包含关键词（如 `Codex`）或签名校验 |
| **手机回复了“1”但本地没有任何动静** | 中转网关未能与执行机器建立长连接或文件信号未监听 | 运行 `node scripts/codex-watchdog` 检查隧道穿透连通性与信号文件状态 |
| **手机每隔 1 分钟被审批卡片轰炸** | 每一个细微改动都未做分流直接请求人工审批 | 开启 `--approve-for-me`，将非破坏性操作委派给 Guardian 自动审批 |

---

## 8.5 实战产品说心法：把自由留给自己

很多同行在用 AI 编程时，把自己活成了一个“人体测试机”和“Git 提交工具人”：AI 改完了，人去点刷新；AI 报错了，人复制报错发给 AI。

**移动看护工作流的本质，是把人从“即时等待”中抽离出来。**

通过将测试断言（Validation Specs）托付给 GitHub Actions，将异常通知托付给移动 Webhook，将最终签字权（Deploy Approval）掌握在手机端。你才能真正做到“人在喝咖啡，产品在自动进化”。

---

[ 🏠 主目录 ](/) | [ ⬅️ 上一章 (Ch.07) ](./ch07_desktop_computer_use.md) | [ ➡️ 下一章 (Ch.09) ](./ch09_legacy_code.md) | [ 🌐 English ](../en/ch08_mobile_workflow.md)

