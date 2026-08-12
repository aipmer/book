// File: src/app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const stripe = getStripe();
  const { email } = (await req.json()) as { email?: string };

  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
  }

  const origin = req.headers.get('origin') ?? 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: email,
    line_items: [{ price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${origin}/dashboard?checkout=success`,
    cancel_url: `${origin}/?checkout=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
