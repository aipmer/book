# Ch.10 商业实战：2小时跑通 Next.js + Stripe 商业级 MVP

作为独立开发者（Indie Hacker）或微型创业团队，你最核心的里程碑不是“完美架构”，而是**“收到第一笔付款”**。很多人把时间浪费在了反复配置脚手架上，迟迟无法上线。

本章我们以极客速战速决的风格，教你如何指挥 Codex，在 2 小时内利用 `Next.js 15 (App Router) + Supabase (PostgreSQL) + Stripe` 搓出一个具有完整支付与会员权限闭环的 SaaS MVP。

---

## 10.1 初始化骨架与数据库 Schema 设计

我们的目标是做一款订阅制的 AI 翻译工具。首先，在根目录下建立 [AGENTS.md](file:///Users/hunkwu/Desktop/ai/book/AGENTS.md) 锁死边界。接着，让 Codex 生成核心的数据库模型。

### 1. 编写 Prisma Schema (Prisma 实体建模)
向 Codex 下达目标 Specs，让其编写数据库模型：

```markdown
# 🎯 Goal
编写 Prisma 数据库模型，支持用户表（User）、订阅表（Subscription）与翻译记录表（TranslationRecord）。

# 🛑 Constraints
- 数据库驱动使用 PostgreSQL（连接 Supabase）。
- 订阅状态必须是 Enum 类型，包含 ACTIVE, CANCELED, EXPIRED。

# 🧪 Validation Specs
- 运行 `npx prisma validate` 无错误提示。
```

Codex 会自动输出标准的 `schema.prisma` 模型，包含合理的级联删除（Cascade）和索引（Indexes）：

```prisma
// File: prisma/schema.prisma
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

支付系统的核心是**回调安全**。当用户支付成功后，Stripe 的服务器会向你的 Next.js 服务发送一个 Webhook 请求。我们需要 Codex 帮我们快速编写这套验证与状态流转逻辑。

### 实战：向 Codex 下达 Webhook 路由编写 Specs
```markdown
# 🎯 Goal
实现 Next.js App Router 风格的 Stripe Webhook 路由处理程序 `/api/webhooks/stripe`。

# 🛑 Constraints
- 必须使用 `stripe.webhooks.constructEvent` 验证请求签名的真实性，防止伪造攻击。
- 当接收到 `checkout.session.completed` 或 `invoice.payment_succeeded` 事件时，更新用户的订阅状态。
- 严禁对响应体进行普通 JSON 解析，Stripe 验证要求使用原始二进制 Buffer。

# 🧪 Validation Specs
- 编写对应的自动化 Mock 请求测试，验证验证签名失败时返回 400，成功时返回 200。
```

Codex 会在沙盒中自主寻找正确的处理方案（例如如何读取 Next.js 15 新版 `request.text()` 获取 Raw Body 进行验证），并输出符合规范的代码：

```typescript
// File: src/app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
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

  // 状态流转处理
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const stripeSubId = session.subscription as string;
    const customerEmail = session.customer_details?.email!;
    
    // 异步更新数据库状态
    await prisma.subscription.upsert({
      where: { stripeSubId },
      update: { status: 'ACTIVE' },
      create: {
        stripeSubId,
        status: 'ACTIVE',
        priceId: session.metadata?.priceId || 'default',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 演示暂设30天
        user: { connect: { email: customerEmail } }
      }
    });
  }

  return NextResponse.json({ received: true });
}
```

---

## 10.3 本地联调：用沙盒 Mock 通过支付闭环

Stripe 在本地调试需要使用 Stripe CLI 进行 Webhook 转发。我们可以利用 Ch.03 学到的沙盒网络穿透技术，配置本地调试：

1.  在本地运行 Stripe 转发：
    ```bash
    stripe listen --forward-to localhost:3000/api/webhooks/stripe
    ```
2.  将控制台给出的 `whsec_xxx` 写入本地的 `.env` 中，让 Codex 运行单元测试。

通过这种“Specs 定义接口 -> AI 编码 -> 沙盒校验 -> Stripe 真实联动测试”的方式，独立开发者可以把原本需要折腾两天的第三方集成工作缩短到半小时内。

**商业 MVP 的价值在于速度。用最牢靠的边界规则约束 AI，换取最极致的上线时间。**

---

📖 **下一章**：[Ch.11 触角延伸：Expo 跨端原生 App 开发与云端打包](file:///Users/hunkwu/Desktop/ai/book/chapters/ch11_expo_mobile.md)