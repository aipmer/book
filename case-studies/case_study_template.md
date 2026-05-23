# 📄 案例投稿模板：[你的项目名称]

> 💡 **投递前提示**：请完整填写以下板块，可参考以下括号中的引导进行描述。提交时请将括号中的引导说明删除，并替换为你的真实项目数据。

---

## 📌 项目基本指纹 (Project Fingerprint)
- **项目名称**：(例如：Aurora Translate)
- **项目类型**：(例如：SaaS 订阅制 AI 翻译工具 / 跨端原生 APP)
- **核心技术栈**：(例如：Next.js 15, Supabase, Stripe, TailwindCSS)
- **交付周期**：(例如：从零构思到上线付费共用时 12 小时)

---

## 🎯 编排目标与红线约束 (Goals & Constraints)

### 1. 核心开发目标
(描述你给智能体下达的最核心的终态 Goal。例如：实现一个支持 Stripe Webhook 签名校验且能自动给用户开通 ACTIVE 会员权限的 Next.js Route Handler。)

### 2. 写入 `AGENTS.md` 的核心规则
(贴出你在此项目中为智能体定制的、最有效的一到两条 Hard Rules。例如下方的代码防腐规则：)
```markdown
## 🛑 Agent Boundary & Hard Rules
- Never update prisma/schema.prisma without requesting human interactive review.
- Never write API keys as plain text in the codebase.
```

---

## 🚀 Codex 编排实战过程 (Orchestration Steps)

### 1. 遇到的核心难题与 CoT 纠偏
(描述智能体在开发过程中是否遇到过死循环，你是如何使用 refine 命令或修改约束阻断其偏离轨道的？)
*   **问题现象**：(例如：智能体试图在 Next.js API 路由里用传统 JSON 方法解析 Stripe Event 导致签名持续校验失败。)
*   **纠偏方案**：(例如：使用 `Ctrl + C` 打断，执行 `codex refine "使用 request.text() 获取 raw string buffer 传递给 constructEvent，禁止将其序列化为 JSON 格式"`。)

### 2. 自动化验证 (Validation)
(你是如何配置测试断言并让 Codex 跑通验证的？例如：通过 Stripe CLI 在本地沙盒 Mock 发送支付成功事件，验证数据库状态是否变为 ACTIVE。)

---

## 💰 商业/效率结果 (Results)
- **上线耗时缩短**：(例如：相较于以往手写集成支付，利用 Codex 目标驱动在 30 分钟内完成，耗时缩短了 80%。)
- **变现里程碑**：(例如：上线 24 小时内获得第一位付费用户，客单价 9.9 美元/月。)
- **运行稳定性**：(例如：依靠 AGENTS.md 锁定鉴权逻辑，智能体在迭代后续翻译功能时，零次改坏登录和支付模块。)

---

## 👤 作者信息 (Author Info)
- **作者**：(例如：Hunk Wu)
- **个人站点/社交账号**：(例如：https://pmer.cn | X: @ai_pmer)
- **微信号/公众号**：(例如：实战产品说)
