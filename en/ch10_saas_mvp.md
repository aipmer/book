[ 🏠 Index ](/en/) | [ ⬅️ Prev (Ch.09) ](./ch09_legacy_code.md) | [ ➡️ Next (Ch.11) ](./ch11_expo_mobile.md) | [ 🌐 中文版 ](../chapters/ch10_saas_mvp.md)

# Ch.10 Monetization in Practice: Shipping a Commercial Next.js + Stripe SaaS MVP in 2 Hours

> 🎯 **The Real Problem**: Spending two weeks wrestling with authentication, database schemas, Stripe Webhook signature verification, and cloud hosting before shipping anything.  
> 💡 **Tangible Output & Takeaway**: Fully runnable production repo `examples/ch10-saas-mvp` (Next.js 15 + Supabase + Stripe subscriptions); Stripe CLI local payment test loops.  
> ⚡ **Viral Screenshot Quote**: *"The ultimate milestone for indie developers isn't architectural perfection—it's receiving the first customer payment. Ship monetization in 2 hours."*

As an independent developer (Indie Hacker) or micro-startup founder, your core milestone is not building a "perfect architecture"—it is **"receiving your first payment."** Many developers waste weeks repeatedly configuring boilerplate setups, draining their momentum before ever launching.

In this chapter, in a fast-paced hacker style, we will teach you how to direct Codex to ship a SaaS MVP with a complete payment and subscription access control loop in under 2 hours using `Next.js 15 (App Router) + Supabase (PostgreSQL) + Stripe`.

> 📦 **Companion Source Code**: [examples/ch10-saas-mvp](https://github.com/aipmer/codex-blue-book/tree/main/examples/ch10-saas-mvp) — a fully runnable subscription-based AI translator (TransFlow) with its own CAP `AGENTS.md`. Verified with `npm install && npm run build`.

---

## 🎯 Intuitive Metaphor: Launching a Cash-Generating Street Food Cart

Too many founders try to build a 5-star luxury hotel on Day 1:

```Plaintext
[Daydreaming 5-Star Hotel] ──> Spending 6 months designing an opulent lobby, importing plush carpets,
                               hiring dozens of waiters (over-engineering),
                               only to open doors and discover nobody wants to eat there. Bankruptcy.
[Mobile Street Food Cart]  ──> ✅ You only need 3 essential tools:
                               1. The Griddle (Next.js core product page: delivers immediate customer value);
                               2. The Storage Box (Supabase / PostgreSQL: stores user accounts and orders);
                               3. The QR Payment Code (Stripe subscription: collects real money into your bank).
```

Once a customer scans the code, pays \$10, and receives a hot meal in their hands, your commercial loop is validated!

---

## 🚀 Beginner Quickstart (3 Easy Steps)

Set up and verify your local Stripe payment loop in 3 simple steps:

1. **Step 1: Obtain Stripe Test Keys and Declare in `.env.local`**  
   Log into the Stripe Developer Dashboard, copy your test keys, and write them into `.env.local`:
   ```bash
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```
2. **Step 2: Start Stripe CLI Local Webhook Forwarding**  
   Run the forwarding listener in your terminal to open a local tunnel:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   # The terminal will print your signing secret: whsec_...
   ```
3. **Step 3: Direct Codex in Sandbox to Validate Webhook Signatures**  
   Inject `whsec_...` into the environment and instruct Codex: *"Write automated test cases mocking `checkout.session.completed`; it must return 200 OK and update user subscription status to ACTIVE."*

---

## 10.1 Initialization and Database Schema Design

Our goal is to build a subscription-based AI translation service. First, initialize the project with Next.js 15 and configure core constraints. Next, instruct Codex to generate the database models.

### 1. Designing the Prisma Schema (Database Entity Modeling)

Dispatch the following goal-driven specs to Codex:

```markdown
# 🎯 Goal
Write Prisma database models supporting User, Subscription, and TranslationRecord entities.

# 🛑 Constraints
- Use PostgreSQL (connected via Supabase) as the database provider.
- Subscription status must be an Enum type containing ACTIVE, CANCELED, and EXPIRED.

# 🧪 Validation Specs
- Running `npx prisma validate` must return no syntax or definition errors.
```

Codex will automatically output a standard `prisma/schema.prisma` file containing foreign key relationships, cascade deletes, and database indexes:

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

## 10.2 Integrating Stripe Subscriptions and Webhook Handlers

The core of a payment system is **callback security**. When a user successfully checks out, Stripe's servers send a webhook request to your Next.js application.

### Practice: Dispatching Webhook Route Specifications to Codex

```markdown
# 🎯 Goal
Implement a Next.js 15 App Router style Stripe Webhook route handler `/api/webhooks/stripe`.

# 🛑 Constraints
- Verify the signature of incoming webhook requests using `stripe.webhooks.constructEvent` to prevent forgery attacks.
- Update user subscription status in the database on receiving `checkout.session.completed` or `invoice.payment_succeeded` events.
- Strictly avoid JSON parsing on the request body; Stripe verification requires the raw `req.text()` string.

# 🧪 Validation Specs
- Write unit tests verifying that invalid signatures return 400, while valid signatures return 200.
- The actual subscription billing period must be retrieved from the Stripe response, never hardcoded.
```

Codex generates the compliant handler:

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

## 10.3 Local Debugging: Using Stripe CLI for Payment Integration

1. Run Stripe forwarding locally:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
2. Trigger a real checkout event:
   ```bash
   stripe trigger checkout.session.completed
   ```
3. Observe terminal output for `200 OK`, and inspect the database via Prisma Studio:
   ```bash
   npx prisma studio
   ```

The value of a commercial MVP lies in delivery speed. Enforce strict boundary specs on the AI to achieve the fastest time-to-revenue.

---

## 🛡️ Troubleshooting & Pitfall Cheat Sheet

| Common Pitfall | Root Cause | Rapid Diagnosis & Fix Guide |
| :--- | :--- | :--- |
| `Webhook Error: No signatures found matching the expected signature` | Used `await req.json()` to parse body, corrupting raw payload bytes | Use `await req.text()` to get the raw string before passing to `constructEvent` |
| **Credit card payment succeeds but database has zero new records** | Webhook URL misconfigured or `stripe listen` forwarder not running locally | Run `stripe listen`, confirming listener terminal prints `200 OK [POST /api/webhooks/stripe]` |
| `DATABASE_URL` cannot connect to Supabase | Forgotten connection pooler (confusing Session vs. Transaction ports) | Verify DB connection string; ensure port 6543 (Transaction mode) is used in Serverless environments |

---

[ 🏠 Index ](/en/) | [ ⬅️ Prev (Ch.09) ](./ch09_legacy_code.md) | [ ➡️ Next (Ch.11) ](./ch11_expo_mobile.md) | [ 🌐 中文版 ](../chapters/ch10_saas_mvp.md)
