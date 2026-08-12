// File: src/app/api/webhooks/stripe/route.ts
// Ch.10 §10.2 的完整实现：签名校验 + 订阅状态流转
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const stripe = getStripe();
  // 🛑 严禁 JSON.parse：签名验证要求原始 body 字符串
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed' || event.type === 'invoice.payment_succeeded') {
    const obj = event.data.object as Stripe.Checkout.Session | Stripe.Invoice;
    const stripeSubId =
      'subscription' in obj && obj.subscription
        ? (obj.subscription as string)
        : null;
    const customerEmail =
      'customer_details' in obj
        ? obj.customer_details?.email
        : (obj as Stripe.Invoice).customer_email;

    if (stripeSubId && customerEmail) {
      // 💡 避坑：真实订阅周期必须从 Stripe 拉取，严禁硬编码 now() + 30 天
      const raw = await stripe.subscriptions.retrieve(stripeSubId);
      const subscription = raw as unknown as {
        current_period_end: number;
        cancel_at_period_end: boolean;
        items: { data: Array<{ price: { id: string } }> };
      };

      await prisma.subscription.upsert({
        where: { stripeSubId },
        update: {
          status: subscription.cancel_at_period_end ? 'CANCELED' : 'ACTIVE',
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
        create: {
          stripeSubId,
          status: 'ACTIVE',
          priceId: subscription.items.data[0]?.price.id ?? 'unknown',
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          user: {
            connectOrCreate: {
              where: { email: customerEmail },
              create: { email: customerEmail },
            },
          },
        },
      });
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    await prisma.subscription
      .update({ where: { stripeSubId: subscription.id }, data: { status: 'EXPIRED' } })
      .catch(() => undefined); // 订阅记录不存在时静默跳过
  }

  return NextResponse.json({ received: true });
}
