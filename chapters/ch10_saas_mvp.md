[ 🏠 主目录 ](/) | [ ⬅️ 上一章 (Ch.09) ](./ch09_legacy_code.md) | [ ➡️ 下一章 (Ch.11) ](./ch11_expo_mobile.md) | [ 🌐 English ](../en/ch10_saas_mvp.md)

# Ch.10 商业实战：2小时跑通 Next.js + Stripe 商业级 MVP

> 🎯 **具体工程麻烦**：想做独立付费产品，在登录鉴权、数据库模型、Stripe Webhook 验签和部署上折腾两周，热情耗尽还没上线。  
> 💡 **可运行实战代码与落地收益**：完整可运行代码库 `examples/ch10-saas-mvp`（Next.js 15 + Supabase + Stripe 订阅）；Stripe CLI 本地支付闭环调试命令。  
> ⚡ **社交传播 / 截图金句**：“独立开发最核心的里程碑不是架构多完美，而是收到第一笔付款。2 小时搞定全套付费闭环。”

作为独立开发者（Indie Hacker）或微型创业团队，你最核心的里程碑不是“完美架构”，应该是“收到第一笔付款”。很多人把时间浪费在了反复配置脚手架上，迟迟无法上线。

本章我们以极客速战速决的风格，教你如何指挥 Codex，在 2 小时内利用 `Next.js 15 (App Router) + Supabase (PostgreSQL) + Stripe` 搓出一个具有完整支付与会员权限闭环的 SaaS MVP。

> 📦 **配套实战源码**：[examples/ch10-saas-mvp](https://github.com/aipmer/codex-blue-book/tree/main/examples/ch10-saas-mvp) —— 完整可运行的订阅制 AI 翻译工具（TransFlow），自带 CAP 协议 `AGENTS.md`，`npm install && npm run build` 已验证通过。

---

## 🎯 生活化直觉隐喻：开出能收银的“流动煎饼摊”

很多人做 SaaS 产品，总想着造一座五星级大酒店：

```Plaintext
【空想五星级酒店】 ──> 花 6 个月设计华丽大堂、采购高档地毯、招几十个服务员（过度工程），
                       结果开业第一天发现没人愿意来吃饭，直接倒闭。
【流动煎饼果子小推车】──> ✅ 你只需要 3 件核心装备：
                       1. 煎饼炉子（Next.js 核心业务页面：提供核心价值）；
                       2. 储物箱（Supabase / PostgreSQL：存用户和订单数据）；
                       3. 扫码收款码（Stripe 订阅：能把钱结结实实收进账户）。
```

只要客人扫码付了 10 块钱，你把热腾腾的煎饼交到他手上，商业闭环就算真正跑通了！

---

## 🚀 新手极速上手 3 步走（无痛起步）

用 3 步快速打通本地 Stripe 支付联调闭环：

1. **步骤一：获取 Stripe 测试密钥并在本地声明**  
   登录 Stripe 开发者控制台，获取测试公私钥并写入 `.env.local`：
   ```bash
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```
2. **步骤二：启动 Stripe CLI 本地 Webhook 转发**  
   在终端运行监听命令，打通本地隧道：
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   # 终端将输出专属签名秘钥：whsec_...
   ```
3. **步骤三：让 Codex 沙盒执行并验证 Webhook 签名逻辑**  
   将获得的 `whsec_...` 注入环境，并命令 Codex：“编写测试用例，模拟触发 `checkout.session.completed`，必须返回 200 且用户权限状态变更为 ACTIVE”。

---

## 10.1 初始化骨架与数据库 Schema 设计

我们的目标是做一款订阅制的 AI 翻译工具。首先使用 Next.js 初始化项目，并配置好基础约束。接着，让 Codex 生成核心的数据库模型。

### 1. 编写 Prisma Schema (Prisma 实体建模)

向 Codex 下达目标 Specs：

```markdown
# 🎯 Goal
编写 Prisma 数据库模型，支持用户表（User）、订阅表（Subscription）与翻译记录表（TranslationRecord）。

# 🛑 Constraints
- 数据库驱动使用 PostgreSQL（连接 Supabase）。
- 订阅状态必须是 Enum 类型，包含 ACTIVE, CANCELED, EXPIRED。

# 🧪 Validation Specs
- 运行 `npx prisma validate` 无错误提示。
```

Codex 会自动输出标准的 `prisma/schema.prisma` 模型，包含级联删除与外键索引：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  EXPIRED
}

model User {
  id             String               @id @default(uuid())
  email          String               @unique
  createdAt      DateTime             @default(now())
  subscription   Subscription?
  records        TranslationRecord[]
}

model Subscription {
  id             String               @id @default(uuid())
  userId         String               @unique
  stripeSubId    String               @unique
  status         SubscriptionStatus
  priceId        String
  currentPeriodEnd DateTime
  user           User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model TranslationRecord {
  id             String               @id @default(uuid())
  userId         String
  sourceText     String
  translatedText String
  createdAt      DateTime             @default(now())
  user           User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 10.2 集成 Stripe 订阅与 Webhook 监听

支付系统的核心是**回调安全**。当用户支付成功后，Stripe 的服务器会向你的 Next.js 服务发送一个 Webhook 请求。

### 自动化 Specs：向 Codex 下达路由编写指令

```markdown
# 🎯 Goal
实现 Next.js 15 App Router 风格的 Stripe Webhook 路由处理程序 `/api/webhooks/stripe`。

# 🛑 Constraints
- 必须使用 `stripe.webhooks.constructEvent` 验证请求签名的真实性，防止伪造攻击。
- 当接收到 `checkout.session.completed` 或 `invoice.payment_succeeded` 事件时，更新用户的订阅状态。
- 严禁对响应体进行普通 JSON 解析，Stripe 验证要求使用原始 req.text() 字符串。

# 🧪 Validation Specs
- 编写单元测试，验证签名失败时返回 400，成功时返回 200。
- 真实订阅周期必须从 Stripe 响应中读取，不得硬编码。
```

Codex 生成的标准实现：

```typescript
// File: src/app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia' as any,
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const stripeSubId = session.subscription as string;
    const customerEmail = session.customer_details?.email!;

    const subscription = await stripe.subscriptions.retrieve(stripeSubId);

    await prisma.subscription.upsert({
      where: { stripeSubId },
      update: {
        status: 'ACTIVE',
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
      create: {
        stripeSubId,
        status: 'ACTIVE',
        priceId: subscription.items.data[0]?.price.id || 'default',
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        user: { connect: { email: customerEmail } }
      }
    });
  }

  return NextResponse.json({ received: true });
}
```

---

## 10.3 本地联调：用 Stripe CLI 跑通支付闭环

1. 在本地运行 Stripe 转发：
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
2. 触发一次真实的结账测试：
   ```bash
   stripe trigger checkout.session.completed
   ```
3. 观察终端是否输出 `200 OK`，并使用 Prisma Studio 查验数据库：
   ```bash
   npx prisma studio
   ```

商业 MVP 的价值在于上线速度。用最严密的边界规约约束 AI，换取最极致的交付体验。

---

## 🛡️ 翻车自救与避坑速查表

| 常见踩坑现象 | 致命原因 | 极速排查与自救指南 |
| :--- | :--- | :--- |
| `Webhook Error: No signatures found matching the expected signature` | 使用了 `await req.json()` 解析 Body，破坏了加密签名原貌 | 严格使用 `await req.text()` 获取 Raw String，再传入 `constructEvent` |
| **测试信用卡支付成功后，数据库无任何新增记录** | Webhook URL 配置错误或本地没有运行 `stripe listen` 转发 | 启动 `stripe listen`，确认监听终端打出 `200 OK [POST /api/webhooks/stripe]` |
| `DATABASE_URL` 连不上 Supabase | 忘记开启 Supabase 连接池（Session / Transaction 端口混淆） | 检查数据库连接串，确保在 Serverless 环境使用 6543 连接池端口 |

---

[ 🏠 主目录 ](/) | [ ⬅️ 上一章 (Ch.09) ](./ch09_legacy_code.md) | [ ➡️ 下一章 (Ch.11) ](./ch11_expo_mobile.md) | [ 🌐 English ](../en/ch10_saas_mvp.md)
