# 📄 案例 02：从手动测试到全天候「飞书助理」实战

> 本案例来自《Codex 蓝皮书》Ch.08 移动看护工作流与官方参考工程 [plugins-codex-feishu](https://github.com/aipmer/plugins-codex-feishu) 的实战演进。

---

## 📌 项目基本指纹 (Project Fingerprint)
- **项目名称**：Codex Feishu Sentinel (飞书助理)
- **项目类型**：全天候无人值守开发编排与移动看护网关
- **核心技术栈**：Node.js, 飞书开放平台 SDK (WebSocket 长连接), GitHub Actions
- **应用场景**：夜间/户外自动化重构与 CI 异常移动端警报

---

## 🎯 痛点与破局 (Problem & Breakthrough)

### 1. 传统痛点：活成了“人体测试机”
独立开发者经常把大量时间花在“等待智能体跑测试”上。每当重构百万行老旧模块时，人必须坐在电脑前守着终端滚动日志，极其疲惫。

### 2. 解决方案：飞书助理 (Codex Feishu Sentinel)
通过引入长连接 Bot 与 Webhook 管道，将 Codex 的编排结果沉淀到飞书：
- 每天下班前自动发送 Git 提交提炼出的图文日报；
- CI 测试挂掉或触发生产部署提权时，手机飞书立刻弹出富文本告警卡片；
- 在手机端直接打字回复 `1`（批准部署）或 `0`（中止并安全回滚）。

---

## 🛑 避坑经验与 Anti-Loop 护栏

在早期版本中，我们遇到了两个极具代表性的智能体陷阱：

1. **陷阱一：死循环盲猜重试**
   - **现象**：当外部飞书网络偶发 429 限流时，智能体自主编写了无退避重试循环，导致 API 被封禁 1 小时。
   - **规约阻断**：在 `AGENTS.md` 中增加硬性约束：
     ```markdown
     - 网络请求重试最多 2 次，每次间隔必须采用指数退避 (Exponential Backoff)，严禁编写 while(true) 无限制重试。
     ```
2. **陷阱二：敏感凭据外泄**
   - **现象**：智能体为了调试方便，试图在生成 Markdown 报告时将当前的 `.env` 变量完整打出。
   - **规约阻断**：写入严格敏感信息过滤检查脚本 `check-sensitive-values.sh`，并在 `AGENTS.md` 中明令禁止在日志或报告中输出任何带有 `cli_` 或 `sk-` 前缀的机密值。

---

## 💰 效果与收益 (Results)
- **心智解放**：开发者在下班通勤或外出喝咖啡时，只需瞄一眼手机即可掌握云端智能体的编译与自动化进展；
- **响应速度**：高危审批无需打开笔记本开机拉代码，手机端 5 秒内一键确认。

---

## 👤 作者信息 (Author Info)
- **作者**：aipmer
- **参考工程**：[https://github.com/aipmer/plugins-codex-feishu](https://github.com/aipmer/plugins-codex-feishu)
