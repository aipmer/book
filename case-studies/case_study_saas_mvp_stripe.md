# 📄 案例 01：Next.js 15 + Stripe 商业 MVP 闭环实录

> 本案例来自《Codex 蓝皮书》Ch.10 商业实战配套工程 [examples/ch10-saas-mvp](https://github.com/aipmer/book/tree/main/examples/ch10-saas-mvp) 的从零孵化全过程。

---

## 📌 项目基本指纹 (Project Fingerprint)
- **项目名称**：Pmer SaaS Starter (商业订阅闭环模板)
- **项目类型**：B2B / 个人出海微型 SaaS MVP
- **核心技术栈**：Next.js 15 (App Router), Prisma, PostgreSQL (Supabase), Stripe Webhook, TailwindCSS
- **交付周期**：从初始化空仓库到跑通支付回执与会员开通，实测用时 1 小时 45 分钟

---

## 🎯 编排目标与红线约束 (Goals & Constraints)

### 1. 核心开发目标
为无状态静态站点注入完整的付费订阅能力：当用户在前端发起 Stripe Checkout，并在付款成功后，Stripe Webhook 能够自动校验事件签名、防重放攻击，并将数据库中的用户权益状态原子更新为 `ACTIVE`。

### 2. 写入 `AGENTS.md` 的核心防腐规则
```markdown
## 🛑 数据库与安全红线
- 严禁未经人工终端审查直接修改 prisma/schema.prisma。
- Stripe Webhook 路由必须使用 request.text() 获取未被篡改的原始 Buffer 进行签名校验。
- 环境变量严格区分服务端密钥 (STRIPE_SECRET_KEY) 与客户端公开 Key (NEXT_PUBLIC_*)。
```

---

## 🚀 Codex 编排实战过程 (Orchestration Steps)

### 1. 遇到的核心难题与 CoT 纠偏
*   **问题现象**：Codex 在初次编写 `/api/stripe/webhook` 时，顺应惯性使用了 `const body = await request.json()`，然后再尝试 `JSON.stringify(body)` 传给 Stripe 校验函数。由于 JSON 序列化键排序与换行符微差，导致 Stripe 签名每次都报 `SignatureVerificationError`。
*   **纠偏方案**：执行打断，使用一条精确指令纠偏：
    ```bash
    codex refine "Stripe 签名校验必须基于原始请求字节流：使用 await request.text() 获取 rawBody，严禁对其执行任何 JSON.parse 或格式化操作"
    ```
    智能体立即纠偏并补齐了 `Buffer.from(rawBody, 'utf-8')`。

### 2. 自动化验证 (Validation)
在沙盒中利用 Stripe CLI 进行本地 Webhook 转发与事件模拟：
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger payment_intent.succeeded
npm run test
```
终端全绿，数据库字段 `subscriptionStatus` 在 300 毫秒内成功流转。

---

## 💰 商业/效率结果 (Results)
- **开发提速**：传统手动阅读 Stripe 文档并对齐 Webhook 调试通常需要 1~2 天，使用目标驱动式 Codex 编排将开发与联调压缩至 2 小时内；
- **防腐效果**：在后续迭代用户中心与账单发票页面时，`AGENTS.md` 规则确保支付核心逻辑零退化、零破坏。

---

## 👤 作者信息 (Author Info)
- **作者**：Hunk Wu (实战产品说)
- **开源代码**：[examples/ch10-saas-mvp](https://github.com/aipmer/book/tree/main/examples/ch10-saas-mvp)
