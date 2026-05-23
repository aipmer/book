[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.09) ](./ch09_legacy_code.md) | [ ➡️ Next (Ch.11) ](./ch11_expo_mobile.md)

# Ch.10 Monetization in Practice: Shipping a Commercial SaaS MVP in 2 Hours

As an independent developer (Indie Hacker) or micro-startup, your key milestone is not building a "perfect architecture." It is **"receiving your first payment."** Many developers spend far too much time repeatedly configuring boilerplate project templates and delaying their actual launch.

In this chapter, in a fast-paced hacker style, we will teach you how to direct Codex to ship a SaaS MVP with a complete payment and subscription access control loop in under 2 hours using `Next.js 15 (App Router) + Supabase (PostgreSQL) + Stripe`.

---

## 10.1 Initialization and Database Schema Design

Our goal is to build a subscription-based AI translation service. First, create [AGENTS.md](../AGENTS.md) in the project root to enforce strict boundaries. Then, instruct Codex to generate the core database models.

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

Codex will automatically output a standard `schema.prisma` file containing foreign key relationships, cascade deletes, and database indexes:

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

## 10.2 Integrating Stripe Subscriptions and Webhook Handlers

The core of a payment system is **callback security**. When a user successfully checks out, Stripe's servers send a webhook request to your Next.js application. We need Codex to write the verification and subscription state flow logic.

### Practice: Dispatching Webhook Route Specifications to Codex
```markdown
# 🎯 Goal
Implement a Next.js App Router style Stripe Webhook route handler `/api/webhooks/stripe`.

# 🛑 Constraints
- Verify the signature of incoming webhook requests using `stripe.webhooks.constructEvent` to prevent forgery attacks.
- Update user subscription status in the database on receiving `checkout.session.completed` or `invoice.payment_succeeded` events.
- Do not parse the request body as JSON. Stripe verification requires the raw binary buffer.

# 🧪 Validation Specs
- Write automated mock requests verifying that invalid signatures return HTTP 400 Bad Request, while valid sessions return HTTP 200 OK.
```

Codex will autonomously search the sandbox for solutions (such as reading the raw body using `request.text()` in Next.js 15) and generate the compliant handler code:

```typescript
// File: src/app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
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

  // Handle state transition
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const stripeSubId = session.subscription as string;
    const customerEmail = session.customer_details?.email!;
    
    // Asynchronously update database state
    await prisma.subscription.upsert({
      where: { stripeSubId },
      update: { status: 'ACTIVE' },
      create: {
        stripeSubId,
        status: 'ACTIVE',
        priceId: session.metadata?.priceId || 'default',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Temporarily set to 30 days for demonstration
        user: { connect: { email: customerEmail } }
      }
    });
  }

  return NextResponse.json({ received: true });
}
```

---

## 10.3 Local Debugging: Using the Sandbox Mock for E2E Validation

Debugging Stripe locally requires the Stripe CLI to forward webhooks. Using the network penetration techniques covered in Ch.03, we can configure our local environment:

1.  Run the Stripe webhook forwarding command locally:
    ```bash
    stripe listen --forward-to localhost:3000/api/webhooks/stripe
    ```
2.  Add the `whsec_xxx` webhook signing secret printed by the console to your local `.env` file and instruct Codex to run the verification tests.

By following this loop (Spec Definition -> AI Coding -> Sandbox Validation -> Real-World Stripe Integration Test), independent developers can compress what normally takes two days of integration struggle down to under 30 minutes.

**The value of a commercial MVP lies in speed. Enforce strict boundaries on the AI to swap for maximum speed-to-market.**

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.09) ](./ch09_legacy_code.md) | [ ➡️ Next (Ch.11) ](./ch11_expo_mobile.md)
