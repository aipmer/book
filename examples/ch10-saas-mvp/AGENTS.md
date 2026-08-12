# 🤖 Codex Collaboration Protocol (CAP) — Ch.10 SaaS MVP

## 📌 Project Signature
- **Project Name**: TransFlow — 订阅制 AI 翻译 SaaS MVP
- **Tech Stack**: Next.js 15 (App Router), TypeScript, Prisma, Supabase (PostgreSQL + Auth), Stripe
- **Directory Rule**: 页面与路由在 `src/app`，共享客户端在 `src/lib`，数据模型在 `prisma/`

## 🛑 Hard Constraints
- Stripe Webhook 必须使用 `req.text()` 原始 body + `stripe.webhooks.constructEvent` 验签，严禁 JSON.parse。
- 订阅周期 `currentPeriodEnd` 必须从 `stripe.subscriptions.retrieve` 实时拉取，严禁硬编码。
- 所有需要会员身份的 API 必须先过 `prisma.subscription.status === 'ACTIVE'` 闸门。
- 严禁将 `.env` 或任何密钥提交进仓库。

## 🧪 Validation Specs
- 提交前必须运行 `npm run build` 且零错误。
- 修改 `prisma/schema.prisma` 后必须通过 `npx prisma validate`。
- 支付链路必须通过 `npm run stripe:listen` + `stripe trigger checkout.session.completed` 真实联动验证。
