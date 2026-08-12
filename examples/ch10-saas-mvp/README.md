# TransFlow — Ch.10 配套实战工程

> 《Codex 蓝皮书》Ch.10「商业实战：2小时跑通 Next.js + Stripe 商业级 MVP」的完整可运行源码。

订阅制 AI 翻译工具：**Next.js 15 (App Router) + Supabase (PostgreSQL + Auth) + Stripe Checkout/Webhook + OpenAI**。

## 功能闭环

1. 落地页输入邮箱 → Stripe Checkout 订阅支付
2. Stripe Webhook 验签 → 订阅状态写入 PostgreSQL（`currentPeriodEnd` 实时拉取，绝不硬编码）
3. Supabase 魔法链接登录 → 服务端校验 `ACTIVE` 订阅 → 解锁翻译工作台
4. 翻译请求经 OpenAI 完成并落库 `TranslationRecord`

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env   # 填入 Supabase / Stripe / OpenAI 真实密钥

# 3. 推送数据库 Schema 到 Supabase
npm run prisma:push

# 4. 启动开发服务器
npm run dev

# 5. 另开终端，转发 Stripe Webhook 到本地
npm run stripe:listen   # 将输出的 whsec_xxx 写入 .env 的 STRIPE_WEBHOOK_SECRET
```

## 本地支付联调（对应 Ch.10 §10.3）

```bash
# 模拟一次完整的订阅支付回调
stripe trigger checkout.session.completed

# 或用 Stripe CLI 在测试模式收银台真实付款（卡号 4242 4242 4242 4242）
```

## 目录结构

```text
├── prisma/schema.prisma            # User / Subscription / TranslationRecord
├── src/lib/prisma.ts               # PrismaClient 单例
├── src/lib/stripe.ts               # Stripe 延迟初始化（build 安全）
├── src/lib/supabase/server.ts      # Supabase 服务端客户端（@supabase/ssr）
└── src/app/
    ├── page.tsx                    # 落地页 + 订阅入口
    ├── login/page.tsx              # 魔法链接登录
    ├── auth/callback/route.ts      # Session 交换
    ├── dashboard/                  # 会员翻译工作台（服务端订阅闸门）
    └── api/
        ├── checkout/route.ts       # 创建 Stripe Checkout Session
        ├── translate/route.ts      # 鉴权 + 订阅闸门 + OpenAI 翻译
        └── webhooks/stripe/route.ts# 验签 + 订阅状态流转
```

## 智能体协作

本工程自带 [AGENTS.md](./AGENTS.md)（CAP 协议），直接用 Codex CLI 打开即可体验书中「边界与断言」工作流：

```bash
codex   # 在本目录启动，AGENTS.md 会自动加载为规则层
```
