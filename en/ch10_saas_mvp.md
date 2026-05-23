[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.09) ](./ch09_legacy_code.md) | [ ➡️ Next (Ch.11) ](./ch11_expo_mobile.md)

# Ch.10 Monetization in Practice: Shipping a Commercial SaaS MVP in 2 Hours

For indie hackers, shipping fast and getting the first paid subscriber is everything. Let's build a Next.js 15 App Router subscription service with Supabase and Stripe.

---

## 10.1 Prisma Database Schema
Instruct Codex to generate models for users and Stripe subscriptions:

```prisma
model User {
  id             String               @id @default(uuid())
  email          String               @unique
  subscription   Subscription?
}

model Subscription {
  id             String               @id @default(uuid())
  userId         String               @unique
  stripeSubId    String               @unique
  status         SubscriptionStatus
  currentPeriodEnd DateTime
  user           User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 10.2 Handling Stripe Webhooks
Have Codex write a secure Webhook handler:

```typescript
// src/app/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;
  let event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);

  if (event.type === 'checkout.session.completed') {
    // Upsert subscription status to 'ACTIVE' in database
  }
  return NextResponse.json({ received: true });
}
```

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.09) ](./ch09_legacy_code.md) | [ ➡️ Next (Ch.11) ](./ch11_expo_mobile.md)
